import axios from "axios";
import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { Event, listEvents } from "../../services/eventsService";
import { useRouter } from "expo-router";

const { height } = Dimensions.get("window");

// Tipo adaptado para exibicao no mapa
interface MapPlace {
    id: string;
    name: string;
    distance: string;
    rating: number;
    reviews: number;
    type: string;
    image: string;
    coordinate: { latitude: number; longitude: number };
    markerColor: string;
    description: string;
    eventType: 'physical' | 'digital';
    price: string;
    date?: unknown;
}

export default function Community() {
    const router = useRouter();
    const [selectedPlace, setSelectedPlace] = useState<MapPlace | null>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [localSearch, setLocalSearch] = useState("");
    const [detailsVisible, setDetailsVisible] = useState(false);
    const [open1, setOpen1] = useState(false);
    const [value1, setValue1] = useState("Todos");
    const [items1, setItems1] = useState([
        { label: "Eventos Fisicos", value: "Eventos Fisicos" },
        { label: "Eventos Digitais", value: "Eventos Digitais" },
        { label: "Todos", value: "Todos" },
    ]);

    const [isLoadingMaps, setIsLoadingMaps] = useState(true);
    const [places, setPlaces] = useState<MapPlace[]>([]);
    const [isLoadingEvents, setIsLoadingEvents] = useState(true);

    const mapRef = useRef<MapView>(null);

    // Converter evento do backend para formato do mapa
    const convertEventToMapPlace = (event: Event): MapPlace => {
        return {
            id: event.id,
            name: event.title,
            distance: event.distance || "Calcular...",
            rating: event.rating || 0,
            reviews: event.participants?.length || 0,
            type: event.price === "Gratis" || event.price === "R$0" ? "Gratuito" : "Pago",
            image: event.image || `https://via.placeholder.com/300x150/${event.eventType === 'digital' ? '8E44AD' : 'E67E22'}/FFFFFF?text=${encodeURIComponent(event.title)}`,
            coordinate: {
                latitude: event.location?.latitude || -23.6186,
                longitude: event.location?.longitude || -46.5472,
            },
            markerColor: event.markerColor || (event.eventType === 'digital' ? '#8E44AD' : '#E67E22'),
            description: event.description,
            eventType: event.eventType,
            price: event.price,
            date: event.date,
        };
    };

    // Carregar eventos do backend
    const loadEvents = useCallback(async () => {
        try {
            setIsLoadingEvents(true);
            // MODIFIED: Removed orderBy and orderDirection to fetch all active events
            const events = await listEvents({
                isActive: true,
            });

            const mapPlaces = events
                .filter(e => e.location?.latitude && e.location?.longitude)
                .map(convertEventToMapPlace);

            setPlaces(mapPlaces);
        } catch (error) {
            console.error('[COMMUNITY] Erro ao carregar eventos:', error);
            // Fallback para dados locais em caso de erro
            setPlaces([
                {
                    id: "1",
                    name: "Chico Mendes",
                    distance: "800 metros",
                    rating: 4.8,
                    reviews: 500,
                    type: "Gratuito",
                    image: "https://images.adsttc.com/media/images/643d/5d58/3e4b/311f/a145/231d/large_jpg/parque-ecologico-chico-mendes-recebe-o-selo-de-qualidade-internacional-green-flag-award_1.jpg?1681743201",
                    coordinate: { latitude: -23.6186, longitude: -46.5472 },
                    markerColor: "#8E44AD",
                    description: "O Parque Ecologico Chico Mendes e uma otima opcao para lazer ao ar livre.",
                    eventType: 'physical',
                    price: "Gratis",
                },
            ]);
        } finally {
            setIsLoadingEvents(false);
        }
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

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

    const handleMarkerPress = (place: MapPlace) => {
        setSelectedPlace(place);
        setDetailsVisible(false);
        setModalVisible(true);
    };

    const handleSelectPlace = () => setDetailsVisible(true);

    const CustomMarker = ({ place }: { place: MapPlace }) => (
        <View
            style={[
                styles.markerContainer,
                { backgroundColor: place.markerColor },
            ]}
        >
            <IconButton icon="map-marker" size={20} iconColor="white" />
        </View>
    );

    // This effect fits the map to the markers when the places array is populated.
    useEffect(() => {
        if (mapRef.current && places.length > 0) {
            const coordinates = places.map((p) => p.coordinate);
            mapRef.current.fitToCoordinates(coordinates, {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
        }
    }, [places]);

    const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

    const searchLocation = async () => {
        if (!localSearch) return;

        // Log da URL para debug
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            localSearch
        )}&key=${GOOGLE_API_KEY}`;
        console.log("URL da Requisição:", url);

        try {
            const response = await axios.get(url);

            if (response.data.status === "OK") {
                const result = response.data.results[0];
                const location = result.geometry.location;
                const viewport = result.geometry.viewport;

                // Verifica se há um viewport (geralmente presente para áreas maiores como países ou estados)
                if (viewport) {
                    // Se houver viewport, usa fitToCoordinates para mostrar a área inteira
                    const northEast = viewport.northeast;
                    const southWest = viewport.southwest;

                    mapRef.current?.fitToCoordinates(
                        [
                            { latitude: northEast.lat, longitude: northEast.lng },
                            { latitude: southWest.lat, longitude: southWest.lng },
                        ],
                        {
                            edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                            animated: true,
                        }
                    );
                } else {
                    // Se não houver viewport (geralmente para pontos específicos ou cidades), usa animateToRegion
                    const region = {
                        latitude: location.lat,
                        longitude: location.lng,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05,
                    };
                    mapRef.current?.animateToRegion(region, 1000);
                }
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
                        iconColor="#666"
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

                    <IconButton icon="pencil" size={18} iconColor="#666" />
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
                        {filteredPlaces.length} Resultados
                    </Text>
                </View>
            </View>

            <MapView
                ref={mapRef}
                style={styles.map}
                initialRegion={{
                    latitude: -23.550520,
                    longitude: -46.633308,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
            >
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
                                                        iconColor="#FFD700"
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
                                                        onPress={() => {closeWithAnimation(); router.navigate('/events')}}
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
