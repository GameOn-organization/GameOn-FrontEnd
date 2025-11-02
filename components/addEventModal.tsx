import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

const AddEventModal = ({ isVisible, onClose, onAddEvent }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [imagePlaceholderText, setImagePlaceholderText] = useState('');
  const [imagePlaceholderSubtext, setImagePlaceholderSubtext] = useState('');

  const handleSave = () =>{
    if (title && description) {
      onAddEvent({
        title,
        price: price || 'Grátis',
        description,
        imagePlaceholderText: imagePlaceholderText || title.toUpperCase(),
        imagePlaceholderSubtext: imagePlaceholderSubtext || 'Novo Evento',
      });
      // Limpar formulário
      setTitle('');
      setPrice('');
      setDescription('');
      setImagePlaceholderText('');
      setImagePlaceholderSubtext('');
    } else {
      alert('Título e Descrição são obrigatórios!');
    }
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
              placeholder="Título do Evento"
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Preço (ex: R$150)"
              value={price}
              onChangeText={setPrice}
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Descrição do Evento"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
            <TextInput
              style={styles.input}
              placeholder="Texto da Imagem (ex: MEU EVENTO)"
              value={imagePlaceholderText}
              onChangeText={setImagePlaceholderText}
            />
            <TextInput
              style={styles.input}
              placeholder="Subtexto da Imagem (ex: Grande Show)"
              value={imagePlaceholderSubtext}
              onChangeText={setImagePlaceholderSubtext}
            />
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
});

export default AddEventModal;