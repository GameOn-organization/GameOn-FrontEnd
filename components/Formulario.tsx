import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";
import { MultiSelect } from "react-native-element-dropdown";
import { Icon, IconButton } from "react-native-paper";

import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
// import axios from 'axios';

// Define the type for data items
interface DataItem {
    label: string;
    value: string;
    icon: string;
}

interface FormularioProps {
    styleProp?: object;
    colorProp?: object;
    onSubmit?: (data: {
        nome: string;
        descricao: string;
        idade: number;
        sexo: string;
        localizacao: string;
        selected1: string[];
        selected2: string[];
        images: (string | null)[];
        wallpaper: string | null;
    }) => void | Promise<void>;
    initialData?: {
        nome?: string;
        descricao?: string;
        idade?: number;
        sexo?: string;
        localizacao?: string;
        selected1?: string[];
        selected2?: string[];
        images?: (string | null)[];
        wallpaper?: string | null;
    };
}

export default function Formulario({styleProp, colorProp, onSubmit, initialData}: FormularioProps) {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [idade, setIdade] = useState("");
    const [sexo, setSexo] = useState("");
    const [localizacao, setLocalizacao] = useState("");
    const [editaLocal, setEditaLocal] = useState(true);
    const [selected1, setSelected1] = useState<string[]>([]);
    const [selected2, setSelected2] = useState<string[]>([]);

    const dateMin = new Date(new Date().getFullYear()-100, new Date().getMonth(), new Date().getDate())
    const dateMax = new Date(new Date().getFullYear()-18, new Date().getMonth(), new Date().getDate())
    
    const [date, setDate] = useState(dateMax);
    const [modeDate, setModeDate] = useState('date');
    const [showDate, setShowDate] = useState(false);

    const [images, setImages] = useState<(string | null)[]>([]);
    // Estado separado para o wallpaper
    const [wallpaper, setWallpaper] = useState<string | null>(null);

    const onChange = (event: any, selectedDate: Date | undefined) => {
        const currentDate = selectedDate || date;
        setShowDate(false);
        setDate(currentDate);
    };
    const showMode = (currentMode) => {
        setShowDate(true);
        setModeDate(currentMode);
    };


    // Jogos
    const games: DataItem[] = [
        { label: "The Legend of Zelda", value: "1", icon: "sword" },
        { label: "Super Mario", value: "2", icon: "mushroom" },
        { label: "Minecraft", value: "3", icon: "cube-outline" },
        { label: "Fortnite", value: "4", icon: "pistol" },
        { label: "League of Legends", value: "5", icon: "chess-queen" },
        { label: "Counter-Strike", value: "6", icon: "target" },
        { label: "Pokémon", value: "7", icon: "pokeball" },
        { label: "GTA V", value: "8", icon: "car-sports" },
    ];

    // Esportes
    const sports: DataItem[] = [
        { label: "Futebol", value: "1", icon: "soccer" },
        { label: "Basquete", value: "2", icon: "basketball" },
        { label: "Tênis", value: "3", icon: "tennis" },
        { label: "Vôlei", value: "4", icon: "volleyball" },
        { label: "Natação", value: "5", icon: "swim" },
        { label: "Ciclismo", value: "6", icon: "bike" },
        { label: "Corrida", value: "7", icon: "run" },
        { label: "Beisebol", value: "8", icon: "baseball" },
    ];

    // Modificação: Função para selecionar imagem em um slot específico
    const pickImage = async (index: number) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            const newImages = [...images];
            newImages[index] = result.assets[0].uri;
            setImages(newImages);
        }
    };

    // Modificação: Função para remover imagem de um slot específico e reorganizar índices
    const removeImage = (index: number) => {
        const newImages = [...images];
        // Remove a imagem do índice especificado
        newImages.splice(index, 1);
        // Filtra apenas as imagens válidas (não nulas) para manter sequência contínua
        const filteredImages = newImages.filter(img => img !== null);
        setImages(filteredImages);
    };

    // Função para selecionar wallpaper
    const pickWallpaper = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [16, 9], // Proporção mais larga para wallpaper
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setWallpaper(result.assets[0].uri);
        }
    };

    // Função para remover wallpaper
    const removeWallpaper = () => {
        setWallpaper(null);
    };

    // Modificação: Função para calcular quantos slots devem ser renderizados
    const getImageSlotsCount = () => {
        const filledSlots = images.filter(img => img !== null).length;
        if (filledSlots === 0) return 1; // Sempre mostrar pelo menos 1 slot
        if (filledSlots >= 9) return 9; // Máximo de 9 slots
        return filledSlots + 1; // Mostrar slots preenchidos + 1 novo slot
    };

    // Modificação: Função para renderizar os slots de imagem
    const renderImageSlots = () => {
        const slotsCount = getImageSlotsCount();
        const slots = [];

        for (let i = 0; i < slotsCount; i++) {
            const hasImage = i < images.length && images[i] !== null;
            
            slots.push(
                <TouchableOpacity
                    key={i}
                    style={[
                        styles.imageSlot,
                        hasImage ? styles.imageSlotFilled : styles.imageSlotEmpty
                    ]}
                    onPress={() => pickImage(i)}
                >
                    {hasImage ? (
                        <View style={styles.imageContainer}>
                            <Image 
                                source={{ uri: images[i] }} 
                                style={styles.slotImage} 
                            />
                            <TouchableOpacity
                                style={styles.removeButton}
                                onPress={() => removeImage(i)}
                            >
                                <Icon
                                    source="close"
                                    color="white"
                                    size={16}
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <Icon
                            source="plus"
                            color="white"
                            size={30}
                        />
                    )}
                </TouchableOpacity>
            );
        }

        return slots;
    };


    const renderItem = (item: DataItem) => (
        <SafeAreaView style={styles.item}>
            <Icon
                source={item.icon as any}
                size={20}
                color="black"
                style={styles.icon}
            />
            <Text style={styles.selectedTextStyle}>{item.label}</Text>
        </SafeAreaView>
    );

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permissão negada",
                    "Não foi possível acessar a localização"
                );
                console.log("Permissão de localização negada");
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            const { latitude, longitude } = location.coords;
            console.log("Coordenadas obtidas:", latitude, longitude);

            try {
                const [address] = await Location.reverseGeocodeAsync({
                    latitude,
                    longitude,
                });
                console.log("Endereço retornado:", address);

                if (address) {
                    const cidade =
                        address.city || address.subregion || "Cidade";
                    const estado = address.region || "Estado";
                    const pais = address.country || "País";
                    const bairro = address.district || "Bairro";
                    const rua = address.street || "Rua";
                    const numero = address.name || "Número";
                    const cep = address.postalCode || "CEP";
                    const endereco = address.formattedAddress || "Endereço";
                    console.log("Endereço formatado:", endereco);

                    setLocalizacao(`${cidade} - ${estado} - ${pais}`);
                } else {
                    setLocalizacao(
                        `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                    );
                }
                setEditaLocal(false);
            } catch (error) {
                console.log("Erro no reverseGeocodeAsync:", error);
                setLocalizacao(
                    `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
                );
            }
        })();
    }, []);

    function calcularIdade(dataNascimento) {
        const dataAtual = new Date();
        const dataNasc = new Date(dataNascimento);
        let idade = dataAtual.getFullYear() - dataNasc.getFullYear();
        const mesAtual = dataAtual.getMonth()
        const mesNasc = dataNasc.getMonth();
        if (mesAtual < mesNasc || (mesAtual === mesNasc && dataAtual.getDate() < dataNasc.getDate())) {
            idade--;
        }
        return idade;
    }

    const handleSubmit = () => {
        if (!onSubmit) return;
        
        const idadeCalculada = calcularIdade(date);
        onSubmit({
            nome,
            descricao,
            idade: idadeCalculada,
            sexo,
            localizacao,
            selected1,
            selected2,
            images,
            wallpaper
        });
    };

    return (
        <LinearGradient
            colors={colorProp ? colorProp : ["#667eea", "#764ba2"]}
            style={[styles.container, styleProp]}
        >
            <ScrollView>

                <SafeAreaView style={styles.formContainer}>
                    <Text style={styles.title}>Criar Perfil</Text>

                    <SafeAreaView style={styles.inputContainer}>
                        <Icon
                            source="account"
                            size={20}
                            color={colorProp ? colorProp : "#667eea"}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setNome}
                            maxLength={40}
                            value={nome}
                            placeholder="Nome"
                            placeholderTextColor="#999"
                            keyboardType="default"
                        />
                    </SafeAreaView>

                    <SafeAreaView style={styles.inputContainer}>
                        <Icon
                            source="script-text"
                            size={20}
                            color={colorProp ? colorProp : "#667eea"}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={setDescricao}
                            maxLength={120}
                            value={descricao}
                            placeholder="Descrição"
                            placeholderTextColor="#999"
                            keyboardType="default"
                            multiline
                        />
                    </SafeAreaView>

                    <SafeAreaView style={styles.inputContainer}>
                        <Icon
                            source="cake-variant"
                            size={20}
                            color={colorProp ? colorProp : "#667eea"}
                            style={styles.inputIcon}
                        />
                        {showDate && (
                            <DateTimePicker
                            minimumDate={dateMin}
                            maximumDate={dateMax}
                            value={date}
                            mode={modeDate}
                            is24Hour={true}
                            //Android: {default, spinner, calendar, clock}
                            //iOS: {default, spinner, compact, inline}
                            display="default"
                            design="default" //default, material
                            onChange={onChange}
                            />
                        )}
                        <TextInput
                            style={styles.input}
                            onChangeText={setIdade}
                            value={date.toLocaleDateString() + " - (" + calcularIdade(date) + " anos)"}
                            editable={false}
                            placeholder="Idade"
                            placeholderTextColor="#999"
                            keyboardType="numeric"
                        />
                        <IconButton
                            icon="calendar"
                            size={24}
                            iconColor={colorProp ? colorProp : "#667eea"}
                            style={[styles.inputIcon, { marginRight: 0 }]}
                            onPress={() => showMode('date')}
                        />
                    </SafeAreaView>

                    <SafeAreaView style={styles.inputContainer}>
                        <Icon
                            source="map-marker"
                            size={20}
                            color={colorProp ? colorProp : "#667eea"}
                            style={styles.inputIcon}
                        />
                        <TextInput
                            style={styles.input}
                            value={localizacao}
                            editable={editaLocal}
                            onChangeText={setLocalizacao}
                            placeholder="Localização"
                            placeholderTextColor="#999"
                        />
                    </SafeAreaView>

                    <SafeAreaView style={styles.pickerContainer}>
                        <Icon
                            source="border-color"
                            size={20}
                            color={colorProp ? colorProp : "#667eea"}
                            style={styles.inputIcon}
                        />
                        <Picker
                            style={styles.picker}
                            selectedValue={sexo}
                            onValueChange={(itemValue) => setSexo(itemValue)}
                        >
                            <Picker.Item label="Selecione o Gênero" value="" />
                            <Picker.Item label="Masculino" value="m" />
                            <Picker.Item label="Feminino" value="f" />
                            <Picker.Item label="Não-Binário" value="nb" />
                        </Picker>
                    </SafeAreaView>

                    <MultiSelect
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={sports}
                        labelField="label"
                        valueField="value"
                        placeholder="Esportes"
                        value={selected1}
                        search
                        searchPlaceholder="Buscar..."
                        onChange={setSelected1}
                        renderLeftIcon={() => (
                            <Icon
                                style={styles.icon}
                                color={colorProp ? colorProp : "#667eea"}
                                source="check"
                                size={20}
                            />
                        )}
                        renderItem={renderItem}
                        renderSelectedItem={(item, unSelect) => (
                            <TouchableOpacity
                                onPress={() => unSelect && unSelect(item)}
                            >
                                <SafeAreaView style={[styles.selectedStyle, {backgroundColor: colorProp ? colorProp : '#667eea'}]}>
                                    <Icon
                                        source={item.icon as any}
                                        size={17}
                                        color="white"
                                        style={styles.icon}
                                    />
                                    <Text style={styles.textSelectedStyle}>
                                        {item.label}
                                    </Text>
                                    <Icon color="white" source="delete" size={17} />
                                </SafeAreaView>
                            </TouchableOpacity>
                        )}
                    />

                    <MultiSelect
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        data={games}
                        labelField="label"
                        valueField="value"
                        placeholder="Jogos"
                        value={selected2}
                        search
                        searchPlaceholder="Buscar..."
                        onChange={setSelected2}
                        renderLeftIcon={() => (
                            <Icon
                                style={styles.icon}
                                color={colorProp ? colorProp : "#667eea"}
                                source="check"
                                size={20}
                            />
                        )}
                        renderItem={renderItem}
                        renderSelectedItem={(item, unSelect) => (
                            <TouchableOpacity
                                onPress={() => unSelect && unSelect(item)}
                            >
                                <SafeAreaView style={[styles.selectedStyle, {backgroundColor: colorProp ? colorProp : '#667eea'}]}>
                                    <Icon
                                        source={item.icon as any}
                                        size={17}
                                        color="white"
                                        style={styles.icon}
                                    />
                                    <Text style={styles.textSelectedStyle}>
                                        {item.label}
                                    </Text>
                                    <Icon color="white" source="delete" size={17} />
                                </SafeAreaView>
                            </TouchableOpacity>
                        )}
                    />

                    {/* Modificação: Container para os slots de imagem */}
                    <View style={styles.imageSlotsContainer}>
                        <Text style={styles.imageSectionTitle}>Fotos do Perfil</Text>
                        <View style={styles.imageSlotsGrid}>
                            {renderImageSlots()}
                        </View>
                    </View>

                    {/* Slot de Wallpaper */}
                    <View style={styles.wallpaperContainer}>
                        <Text style={styles.imageSectionTitle}>Wallpaper do Perfil</Text>
                        <TouchableOpacity
                            style={[
                                styles.wallpaperSlot,
                                wallpaper ? styles.wallpaperSlotFilled : styles.wallpaperSlotEmpty
                            ]}
                            onPress={pickWallpaper}
                        >
                            {wallpaper ? (
                                <View style={styles.wallpaperImageContainer}>
                                    <Image 
                                        source={{ uri: wallpaper }} 
                                        style={styles.wallpaperImage} 
                                    />
                                    <TouchableOpacity
                                        style={styles.removeWallpaperButton}
                                        onPress={removeWallpaper}
                                    >
                                        <Icon
                                            source="close"
                                            color="white"
                                            size={20}
                                        />
                                    </TouchableOpacity>
                                </View>
                            ) : (
                                <View style={styles.wallpaperPlaceholder}>
                                    <Icon
                                        source="image-plus"
                                        color="white"
                                        size={40}
                                    />
                                    <Text style={styles.wallpaperPlaceholderText}>
                                        Adicionar Wallpaper
                                    </Text>
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Botão de Submit */}
                    {onSubmit && (
                        <TouchableOpacity
                            style={styles.submitButton}
                            onPress={handleSubmit}
                        >
                            <Text style={styles.submitButtonText}>Salvar Perfil</Text>
                        </TouchableOpacity>
                    )}
                </SafeAreaView>
            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        padding: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "white",
        textAlign: "center",
        marginBottom: 30,
        textShadowColor: "rgba(0, 0, 0, 0.3)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        height: 50,
        fontSize: 16,
        color: "#333",
        paddingLeft: 10,
    },
    pickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        borderRadius: 12,
        marginBottom: 16,
        paddingHorizontal: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    picker: {
        flex: 1,
        height: 50,
        fontSize: 16,
    },
    dropdown: {
        height: 50,
        backgroundColor: "white",
        borderRadius: 12,
        padding: 12,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 16,
    },
    placeholderStyle: {
        fontSize: 16,
        color: "#999",
    },
    selectedTextStyle: {
        fontSize: 14,
        color: "#333",
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 8,
    },
    item: {
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
    },
    selectedStyle: {
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 16,
        backgroundColor: "#667eea",
        shadowColor: "#000",
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    textSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
        color: "white",
        fontWeight: "500",
    },
    // Estilos para o wallpaper
    wallpaperContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    wallpaperSlot: {
        width: "100%",
        height: 120,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    wallpaperSlotEmpty: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderStyle: "dashed",
    },
    wallpaperSlotFilled: {
        backgroundColor: "white",
        padding: 2,
    },
    wallpaperImageContainer: {
        width: "100%",
        height: "100%",
        position: "relative",
    },
    wallpaperImage: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
        resizeMode: "cover",
    },
    wallpaperPlaceholder: {
        alignItems: "center",
        justifyContent: "center",
    },
    wallpaperPlaceholderText: {
        color: "white",
        fontSize: 16,
        fontWeight: "500",
        marginTop: 8,
        textShadowColor: "rgba(0, 0, 0, 0.3)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    removeWallpaperButton: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "red",
        borderRadius: 15,
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    // Novos estilos para os slots de imagem
    imageSlotsContainer: {
        marginTop: 20,
        marginBottom: 20,
    },
    imageSectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "white",
        marginBottom: 15,
        textAlign: "center",
        textShadowColor: "rgba(0, 0, 0, 0.3)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 2,
    },
    imageSlotsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 10,
    },
    imageSlot: {
        width: "30%",
        aspectRatio: 1,
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageSlotEmpty: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        borderWidth: 2,
        borderColor: "rgba(255, 255, 255, 0.3)",
        borderStyle: "dashed",
    },
    imageSlotFilled: {
        backgroundColor: "white",
        padding: 2,
    },
    imageContainer: {
        width: "100%",
        height: "100%",
        position: "relative",
    },
    slotImage: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
        resizeMode: "cover",
    },
    removeButton: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "red",
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 5,
    },
    submitButton: {
        backgroundColor: "white",
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 30,
        marginBottom: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    submitButtonText: {
        color: "#667eea",
        fontSize: 18,
        fontWeight: "bold",
    },
});
