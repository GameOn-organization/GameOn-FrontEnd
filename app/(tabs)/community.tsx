import axios from "axios";
import React, { useEffect, useRef, useState } from "react"; // <-- MUDANÇA
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    PanResponder,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import MapView, { Marker } from "react-native-maps";
import { IconButton } from "react-native-paper";

const { width, height } = Dimensions.get("window");

export default function Community() {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [localSearch, setLocalSearch] = useState("");
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [value1, setValue1] = useState("Todos");
    const [items1, setItems1] = useState([
        { label: "Eventos Físicos", value: "Eventos Físicos" },
        { label: "Eventos Digitais", value: "Eventos Digitais" },
        { label: "Todos", value: "Todos" },
    ]);

    // <-- MUDANÇA: Ref para o MapView para podermos controlá-lo
    const mapRef = useRef<MapView>(null);

    const places = [
        {
            id: 1,
            name: "Chico Mendes",
            distance: "800 metros",
            rating: 4.8,
            reviews: 500,
            type: "Gratuito",
            image: "https://images.adsttc.com/media/images/643d/5d58/3e4b/311f/a145/231d/large_jpg/parque-ecologico-chico-mendes-recebe-o-selo-de-qualidade-internacional-green-flag-award_1.jpg?1681743201",
            coordinate: { latitude: -23.6186, longitude: -46.5472 },
            markerColor: "#8E44AD",
            description:
                "O Parque Ecológico Chico Mendes é uma ótima opção para lazer ao ar livre, com quadras poliesportivas, pistas de caminhada e uma vasta área verde para piqueniques e descanso.",
        },
        {
            id: 2,
            name: "Centro Esportivo",
            distance: "1.2 km",
            rating: 4.5,
            reviews: 320,
            type: "Pago",
            image: "https://www.saocaetanodosul.sp.gov.br/images/secretarias/selj/LAZER_E_ESPORTE_PARA_TODOS_NO_CER_PROSPERIDADE_-_Foto_Divulgacao_PMSCS_-_(1 ).jpg",
            coordinate: { latitude: -23.6156, longitude: -46.5502 },
            markerColor: "#E67E22",
            description:
                "Complexo esportivo completo com piscinas, academia e quadras para diversas modalidades. Requer matrícula e pagamento de mensalidade.",
        },
        {
            id: 3,
            name: "Quadra Municipal",
            distance: "600 metros",
            rating: 4.2,
            reviews: 180,
            type: "Gratuito",
            image: "https://via.placeholder.com/300x150/FF9800/FFFFFF?text=Quadra+Municipal",
            coordinate: { latitude: -23.6206, longitude: -46.5432 },
            markerColor: "#8E44AD",
            description:
                "Quadra pública disponível para uso da comunidade, ideal para futebol de salão e basquete.",
        },
        {
            id: 4,
            name: "Arena Esportiva",
            distance: "1.5 km",
            rating: 4.7,
            reviews: 650,
            type: "Pago",
            image: "https://via.placeholder.com/300x150/9C27B0/FFFFFF?text=Arena+Esportiva",
            coordinate: { latitude: -23.6126, longitude: -46.5532 },
            markerColor: "#E67E22",
            description:
                "Arena moderna para eventos esportivos e shows, com estrutura de alta qualidade.",
        },
    ];

    const pan = useRef(new Animated.ValueXY()).current;

    // <-- MUDANÇA: Função para fechar o modal com animação
    const closeWithAnimation = () => {
        Animated.timing(pan, {
            toValue: { x: 0, y: height },
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setModalVisible(false); // Fecha o modal DEPOIS que a animação termina
            pan.setValue({ x: 0, y: 0 }); // Reseta a posição para a próxima vez
        });
    };

    const panResponder = useRef(
        PanResponder.create({
            onMoveShouldSetPanResponder: (evt, gestureState) =>
                Math.abs(gestureState.dy) > 5 && gestureState.dy > 0,
            onPanResponderMove: Animated.event([null, { dy: pan.y }], {
                useNativeDriver: false,
            }),
            onPanResponderRelease: (evt, gestureState) => {
                if (gestureState.dy > 120) {
                    closeWithAnimation(); // Usa a nova função para fechar com animação
                } else {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: true,
                    }).start();
                }
            },
        })
    ).current;

    const handleMarkerPress = (place) => {
        setSelectedPlace(place);
        setDetailsVisible(false);
        setModalVisible(true); // Abre o modal instantaneamente (a animação de entrada cuidará do resto)
    };

    const handleSelectPlace = () => setDetailsVisible(true);

    const CustomMarker = ({ place }) => (
        <View
            style={[
                styles.markerContainer,
                { backgroundColor: place.markerColor },
            ]}
        >
            <IconButton icon="map-marker" size={20} color="white" />
        </View>
    );

    // <-- MUDANÇA: Efeito para ajustar o mapa quando o componente é montado
    useEffect(() => {
        if (mapRef.current) {
            const coordinates = places.map((p) => p.coordinate);
            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, []); // O array vazio [] garante que isso rode apenas uma vez

    const GOOGLE_API_KEY = "mandei a chave da api no gp, se precisar ela vai estar la, só substituir";

    const searchLocation = async () => {
        if (!localSearch) return;

        // Log da URL para debug
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            localSearch
        )}&components=country:BR&key=${GOOGLE_API_KEY}`;
        console.log("URL da Requisição:", url);

        try {
            const response = await axios.get(url);

            if (response.data.status === "OK") {
                const location = response.data.results[0].geometry.location;

                //A API do Google retorna 'lat' e 'lng'
                const region = {
                    latitude: location.lat, // CORRIGIDO
                    longitude: location.lng, // CORRIGIDO
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                };

                mapRef.current?.animateToRegion(region, 1000);
            } else {
                // Tratamento para status de erro da API (ex: ZERO_RESULTS, REQUEST_DENIED)
                const errorMessage =
                    response.data.error_message || "Local não encontrado.";
                alert(
                    `Erro da API: ${errorMessage} (Status: ${response.data.status})`
                );
                console.log("Erro de Status da API:", response.data.status);
                console.log(
                    "Mensagem de Erro da API:",
                    response.data.error_message
                );
            }
        } catch (error) {
            // Tratamento para erros de rede ou HTTP (ex: 403 Forbidden)
            console.error("Erro completo da requisição:", error);

            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const data = error.response?.data;

                console.error("Status HTTP:", status);
                console.error("Dados da Resposta (Erro):", data);

                let alertMessage =
                    "Erro ao buscar localização. Verifique o console para detalhes.";
                if (status === 403) {
                    alertMessage =
                        "Erro 403: A chave da API está inválida ou não tem permissão (Verifique as restrições no Google Cloud Console).";
                } else if (status) {
                    alertMessage = `Erro HTTP ${status}: ${error.message}`;
                } else {
                    alertMessage = `Erro de Rede: ${error.message}`;
                }

                alert(alertMessage);
            } else {
                alert("Erro Desconhecido. Verifique o console.");
            }
        }
    };

    const filteredPlaces = places.filter((place) => {
        if (value1 === "Eventos Digitais") {
            return place.markerColor === "#8E44AD";
        }
        if (value1 === "Eventos Físicos") {
            return place.markerColor !== "#8E44AD";
        } else {
            return true; // mostra todos se não for nenhum filtro específico
        }
    });

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <IconButton
                        icon="search-web"
                        size={20}
                        color="#666"
                        style={styles.searchIcon}
                        onPress={searchLocation}
                    />
                    <TextInput
                        style={styles.searchText}
                        placeholder="Digite o Local"
                        onChangeText={setLocalSearch}
                        value={localSearch}
                        onSubmitEditing={searchLocation}
                    />

                    <IconButton icon="pencil" size={18} color="#666" />
                </View>

                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                    }}
                >
                    <View style={styles.filtersContainer}>
                        <DropDownPicker
                            open={open1}
                            value={value1}
                            items={items1}
                            setOpen={setOpen1}
                            setValue={setValue1}
                            setItems={setItems1}
                            placeholder="Filtrar"
                            style={{ width: "100%" }}
                        />
                    </View>
                    <Text style={styles.resultsText}>
                        {filteredPlaces.length} results
                    </Text>
                </View>
            </View>

            {/* <-- MUDANÇA: Adicionada a ref e removida a initialRegion */}
            <MapView ref={mapRef} style={styles.map}>
                {filteredPlaces.map((place) => (
                    <Marker
                        key={place.id}
                        coordinate={place.coordinate}
                        onPress={() => handleMarkerPress(place)}
                    >
                        <CustomMarker place={place} />
                    </Marker>
                ))}
            </MapView>

            <Modal
                animationType="none" // A animação é 100% manual agora
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeWithAnimation} // Usa a função com animação também para o botão "voltar" do Android
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        onPress={closeWithAnimation}
                        activeOpacity={1}
                    />

                    <Animated.View
                        style={[
                            styles.animatedContainer,
                            { transform: [{ translateY: pan.y }] },
                        ]}
                        {...panResponder.panHandlers}
                    >
                        <ScrollView contentContainerStyle={styles.modalScroll}>
                            <View style={styles.modalContent}>
                                <View style={styles.modalHandle} />
                                {selectedPlace && (
                                    <>
                                        <Image
                                            source={{
                                                uri: selectedPlace.image,
                                            }}
                                            style={styles.placeImage}
                                            resizeMode="cover"
                                        />
                                        <View style={styles.placeInfo}>
                                            <Text style={styles.placeName}>
                                                {selectedPlace.name}
                                            </Text>
                                            <View style={styles.placeDetails}>
                                                <View
                                                    style={
                                                        styles.ratingContainer
                                                    }
                                                >
                                                    <IconButton
                                                        icon="star"
                                                        size={16}
                                                        color="#FFD700"
                                                    />
                                                    <Text
                                                        style={
                                                            styles.ratingText
                                                        }
                                                    >
                                                        {selectedPlace.rating} (
                                                        {selectedPlace.reviews}{" "}
                                                        avaliações)
                                                    </Text>
                                                </View>
                                                <Text
                                                    style={styles.distanceText}
                                                >
                                                    📍 {selectedPlace.distance}
                                                </Text>
                                            </View>
                                            {!detailsVisible ? (
                                                <View
                                                    style={styles.typeContainer}
                                                >
                                                    <Text
                                                        style={styles.typeText}
                                                    >
                                                        {selectedPlace.type}
                                                    </Text>
                                                    <TouchableOpacity
                                                        style={
                                                            styles.selectButton
                                                        }
                                                        onPress={
                                                            handleSelectPlace
                                                        }
                                                    >
                                                        <Text
                                                            style={
                                                                styles.selectButtonText
                                                            }
                                                        >
                                                            Selecionar
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            ) : (
                                                <View
                                                    style={
                                                        styles.detailsSection
                                                    }
                                                >
                                                    <Text
                                                        style={
                                                            styles.sectionTitle
                                                        }
                                                    >
                                                        Descrição
                                                    </Text>
                                                    <Text
                                                        style={
                                                            styles.descriptionText
                                                        }
                                                    >
                                                        {
                                                            selectedPlace.description
                                                        }
                                                    </Text>
                                                    <Text
                                                        style={
                                                            styles.sectionTitle
                                                        }
                                                    >
                                                        Horários
                                                    </Text>
                                                    <Text
                                                        style={
                                                            styles.descriptionText
                                                        }
                                                    >
                                                        Segunda a Sexta: 08:00 -
                                                        22:00
                                                    </Text>
                                                    <TouchableOpacity
                                                        style={[
                                                            styles.selectButton,
                                                            {
                                                                marginTop: 20,
                                                                alignSelf:
                                                                    "center",
                                                            },
                                                        ]}
                                                    >
                                                        <Text
                                                            style={
                                                                styles.selectButtonText
                                                            }
                                                        >
                                                            Confirmar Local
                                                        </Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )}
                                        </View>
                                    </>
                                )}
                            </View>
                        </ScrollView>
                    </Animated.View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        backgroundColor: "#FFFFFF",
        paddingTop: 50,
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#E0E0E0",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 12,
        marginBottom: 16,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchText: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        fontWeight: "500",
    },
    filtersContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        width: "40%",
    },
    resultsText: {
        fontSize: 14,
        color: "#666",
    },
    map: {
        flex: 1,
    },
    markerContainer: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "#FFFFFF",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
    },
    modalBackdrop: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "rgba(0,0,0,0.2)",
    },
    animatedContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    modalScroll: {
        justifyContent: "flex-end",
        flexGrow: 1,
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 8,
        maxHeight: height * 0.8,
    },
    modalHandle: {
        width: 40,
        height: 4,
        backgroundColor: "#E0E0E0",
        borderRadius: 2,
        alignSelf: "center",
        marginBottom: 16,
    },
    placeImage: {
        width: "100%",
        height: 180,
        backgroundColor: "#F0F0F0",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    placeInfo: {
        padding: 16,
        paddingBottom: 32,
    },
    placeName: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    placeDetails: {
        marginBottom: 16,
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 4,
    },
    ratingText: {
        fontSize: 14,
        color: "#666",
        marginLeft: 4,
    },
    distanceText: {
        fontSize: 14,
        color: "#666",
    },
    typeContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    typeText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
    },
    selectButton: {
        backgroundColor: "#333",
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    selectButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "600",
    },
    detailsSection: {
        marginTop: 16,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
        paddingTop: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 8,
    },
    descriptionText: {
        fontSize: 15,
        color: "#666",
        lineHeight: 22,
        marginBottom: 16,
    },
});
