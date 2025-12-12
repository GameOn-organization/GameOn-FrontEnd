import React, { useState, useEffect } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadEventImage } from '../services/storageService';

interface AddEventModalProps {
  isVisible: boolean;
  onClose: () => void;
  onAddEvent: (eventData: {
    title: string;
    price: string;
    description: string;
    imagePlaceholderText: string;
    imagePlaceholderSubtext: string;
    location: {
      latitude: number;
      longitude: number;
      cep?: string;
      rua?: string;
      numero?: string;
      bairro?: string;
      cidade?: string;
      estado?: string;
      address?: string;
    };
    eventType: 'physical' | 'digital';
    category: string;
    date: Date;
  }) => void;
}

const AddEventModal = ({ isVisible, onClose, onAddEvent }: AddEventModalProps) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');

  // Imagem do evento
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Campos de endereço separados
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [estado, setEstado] = useState('');

  const [eventType, setEventType] = useState<'physical' | 'digital'>('physical');
  const [category, setCategory] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);

  const apiKey = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

  // Função para selecionar imagem da galeria
  const pickImage = async () => {
    try {
      // Pedir permissão para acessar a galeria
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de permissão para acessar suas fotos.');
        return;
      }

      // Abrir seletor de imagens
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao selecionar imagem:', error);
      Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
    }
  };

  // Função para tirar foto com a câmera
  const takePhoto = async () => {
    try {
      // Pedir permissão para acessar a câmera
      const { status } = await ImagePicker.requestCameraPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'Precisamos de permissão para acessar a câmera.');
        return;
      }

      // Abrir câmera
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
      Alert.alert('Erro', 'Não foi possível tirar a foto.');
    }
  };

  // Mostrar opções de imagem
  const showImageOptions = () => {
    Alert.alert(
      'Adicionar Imagem',
      'Escolha uma opção:',
      [
        { text: 'Galeria', onPress: pickImage },
        { text: 'Câmera', onPress: takePhoto },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  // Função para buscar endereço pelo CEP usando ViaCEP
  const fetchAddressByCep = async (cepValue: string) => {
    // Remove caracteres não numéricos
    const cleanCep = cepValue.replace(/\D/g, '');

    if (cleanCep.length !== 8) {
      return;
    }

    setIsLoadingCep(true);

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();

      if (data.erro) {
        alert('CEP não encontrado. Verifique e tente novamente.');
        return;
      }

      // Preencher campos automaticamente
      setRua(data.logradouro || '');
      setBairro(data.bairro || '');
      setCidade(data.localidade || '');
      setEstado(data.uf || '');

    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      alert('Erro ao buscar CEP. Tente novamente.');
    } finally {
      setIsLoadingCep(false);
    }
  };

  // useEffect para buscar endereço quando CEP é preenchido
  useEffect(() => {
    if (cep.replace(/\D/g, '').length === 8) {
      fetchAddressByCep(cep);
    }
  }, [cep]);

  // Função para obter coordenadas a partir do endereço completo
  const getCoordinatesFromAddress = async () => {
    if (!apiKey) {
      console.error("Google API key is not defined.");
      alert("Erro de configuração: A chave da API de mapas não foi encontrada.");
      return null;
    }

    // Montar endereço completo
    const fullAddress = `${rua}${numero ? ', ' + numero : ''}, ${bairro}, ${cidade} - ${estado}, ${cep}`;

    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      fullAddress
    )}&key=${apiKey}&components=country:BR`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        const { lat, lng } = data.results[0].geometry.location;
        return {
          latitude: lat,
          longitude: lng,
        };
      } else {
        console.error('Geocoding API error:', data.status, data.error_message);
        return null;
      }
    } catch (error) {
      console.error('Error fetching geocoding data:', error);
      return null;
    }
  };


  const handleSave = async () => {
    if (!title || !description) {
      alert('Titulo e Descricao sao obrigatorios!');
      return;
    }

    if (eventType === 'physical') {
      if (!cep || !rua || !bairro || !cidade || !estado) {
        alert('Para eventos fisicos, CEP, Rua, Bairro, Cidade e Estado sao obrigatorios!');
        return;
      }
    }

    // Upload da imagem se houver
    let imageUrl: string | undefined = undefined;
    if (imageUri) {
      try {
        setIsUploadingImage(true);
        console.log('📤 [UPLOAD] Iniciando upload da imagem:', imageUri);
        imageUrl = await uploadEventImage(imageUri) || undefined;
        console.log('✅ [UPLOAD] Imagem do evento enviada com sucesso!');
        console.log('🔗 [UPLOAD] URL da imagem:', imageUrl);
      } catch (error) {
        console.error('❌ [UPLOAD] Erro ao fazer upload da imagem:', error);
        Alert.alert('Erro', 'Não foi possível fazer upload da imagem. Deseja continuar sem imagem?', [
          { text: 'Cancelar', style: 'cancel', onPress: () => { setIsUploadingImage(false); return; } },
          { text: 'Continuar', onPress: () => {} }
        ]);
      } finally {
        setIsUploadingImage(false);
      }
    } else {
      console.log('⚠️ [UPLOAD] Nenhuma imagem selecionada');
    }

    let locationData = {
      latitude: 0,
      longitude: 0,
      cep: eventType === 'digital' ? undefined : cep,
      rua: eventType === 'digital' ? undefined : rua,
      numero: eventType === 'digital' ? undefined : numero,
      bairro: eventType === 'digital' ? undefined : bairro,
      cidade: eventType === 'digital' ? undefined : cidade,
      estado: eventType === 'digital' ? undefined : estado,
      address: eventType === 'digital' ? 'Online' : `${rua}${numero ? ', ' + numero : ''}, ${bairro}, ${cidade} - ${estado}, ${cep}`,
    };

    if (eventType === 'physical') {
      const coords = await getCoordinatesFromAddress();
      if (!coords) {
        alert('Nao foi possivel encontrar as coordenadas para o endereço fornecido. Verifique o endereço e tente novamente.');
        return;
      }
      locationData.latitude = coords.latitude;
      locationData.longitude = coords.longitude;
    }

    const eventData = {
      title,
      price: price || 'Gratis',
      description,
      image: imageUrl,
      imagePlaceholderText: title.substring(0, 10).toUpperCase(),
      imagePlaceholderSubtext: category || 'Evento',
      location: locationData,
      eventType,
      category: category || 'Geral',
      date: new Date(),
    };

    console.log('📝 [EVENTO] Dados do evento a serem enviados:');
    console.log('   - Título:', eventData.title);
    console.log('   - Imagem URL:', eventData.image || 'SEM IMAGEM');
    console.log('   - Tipo:', eventData.eventType);

    onAddEvent(eventData);

    // Limpar formulario
    setTitle('');
    setPrice('');
    setDescription('');
    setImageUri(null);
    setCep('');
    setRua('');
    setNumero('');
    setBairro('');
    setCidade('');
    setEstado('');
    setEventType('physical');
    setCategory('');
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
            <Text style={styles.modalTitle}>Adicionar Novo Evento</Text>

            <TextInput
              style={styles.input}
              placeholder="Titulo do Evento *"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Preco (ex: R$150)"
              value={price}
              onChangeText={setPrice}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descricao do Evento *"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />

            <Text style={styles.sectionTitle}>Tipo de Evento</Text>
            <View style={styles.eventTypeContainer}>
              <TouchableOpacity
                style={[
                  styles.eventTypeButton,
                  eventType === 'physical' && styles.eventTypeButtonActive
                ]}
                onPress={() => setEventType('physical')}
              >
                <Text style={[
                  styles.eventTypeText,
                  eventType === 'physical' && styles.eventTypeTextActive
                ]}>Fisico</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.eventTypeButton,
                  eventType === 'digital' && styles.eventTypeButtonActive
                ]}
                onPress={() => setEventType('digital')}
              >
                <Text style={[
                  styles.eventTypeText,
                  eventType === 'digital' && styles.eventTypeTextActive
                ]}>Digital</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.input}
              placeholder="Categoria (ex: Esportes, Games, Musica)"
              value={category}
              onChangeText={setCategory}
            />

            <Text style={styles.sectionTitle}>Localizacao</Text>

            {/* Campo CEP com indicador de carregamento */}
            <View style={{ position: 'relative' }}>
              <TextInput
                style={styles.input}
                placeholder="CEP *"
                value={cep}
                onChangeText={(text) => {
                  // Formatar CEP automaticamente
                  const cleaned = text.replace(/\D/g, '');
                  if (cleaned.length <= 8) {
                    const formatted = cleaned.length > 5
                      ? `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`
                      : cleaned;
                    setCep(formatted);
                  }
                }}
                keyboardType="numeric"
                maxLength={9}
                editable={eventType === 'physical'}
              />
              {isLoadingCep && (
                <ActivityIndicator
                  size="small"
                  color="#666"
                  style={{ position: 'absolute', right: 10, top: 12 }}
                />
              )}
            </View>

            {/* Campos preenchidos automaticamente pelo CEP */}
            <TextInput
              style={styles.input}
              placeholder="Rua *"
              value={rua}
              onChangeText={setRua}
              editable={eventType === 'physical'}
            />

            <TextInput
              style={styles.input}
              placeholder="Numero"
              value={numero}
              onChangeText={setNumero}
              keyboardType="numeric"
              editable={eventType === 'physical'}
            />

            <TextInput
              style={styles.input}
              placeholder="Bairro *"
              value={bairro}
              onChangeText={setBairro}
              editable={eventType === 'physical'}
            />

            <TextInput
              style={styles.input}
              placeholder="Cidade *"
              value={cidade}
              onChangeText={setCidade}
              editable={eventType === 'physical'}
            />

            <TextInput
              style={styles.input}
              placeholder="Estado (ex: SP) *"
              value={estado}
              onChangeText={(text) => setEstado(text.toUpperCase())}
              maxLength={2}
              editable={eventType === 'physical'}
            />

            <Text style={styles.sectionTitle}>Imagem do Evento</Text>

            {/* Preview da imagem selecionada */}
            {imageUri && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={() => setImageUri(null)}
                >
                  <Text style={styles.removeImageText}>X</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Botão para adicionar imagem */}
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={showImageOptions}
              disabled={isUploadingImage}
            >
              <Text style={styles.addImageButtonText}>
                {imageUri ? 'Alterar Imagem' : '+ Adicionar Imagem do Evento'}
              </Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Text style={styles.buttonText}>Salvar Evento</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '90%',
    height: '90%',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 10,
    color: '#666',
  },
  input: {
    width: '100%',
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  eventTypeContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  eventTypeButton: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  eventTypeButtonActive: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  eventTypeText: {
    fontSize: 16,
    color: '#333',
  },
  eventTypeTextActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  coordinateInput: {
    flex: 1,
    marginHorizontal: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
  },
  button: {
    flex: 1,
    borderRadius: 20,
    padding: 12,
    elevation: 2,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#ff4757',
  },
  saveButton: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  imagePreviewContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
    marginBottom: 15,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#ff4757',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addImageButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
  },
  addImageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddEventModal;
