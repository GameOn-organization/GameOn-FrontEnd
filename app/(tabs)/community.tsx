import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    StatusBar,
    TouchableOpacity,
    Modal,
    Image,
    Dimensions,
} from "react-native";
import { IconButton } from "react-native-paper";
import MapView, { Marker } from "react-native-maps";

const { width, height } = Dimensions.get("window");

export default function Community() {
    const [selectedPlace, setSelectedPlace] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [localSearch, setLocalSearch] = useState("");

    // Dados dos locais marcados no mapa
    const places = [
        {
            id: 1,
            name: "Chico Mendes",
            distance: "800 metros",
            rating: 4.8,
            reviews: 500,
            type: "Gratuito",
            image: "https://via.placeholder.com/300x150/4CAF50/FFFFFF?text=Quadra+Esportiva",
            coordinate: {
                latitude: -23.6186,
                longitude: -46.5472,
            },
            markerColor: "#8E44AD",
        },
        {
            id: 2,
            name: "Centro Esportivo",
            distance: "1.2 km",
            rating: 4.5,
            reviews: 320,
            type: "Pago",
            image: "https://via.placeholder.com/300x150/2196F3/FFFFFF?text=Centro+Esportivo",
            coordinate: {
                latitude: -23.6156,
                longitude: -46.5502,
            },
            markerColor: "#E67E22",
        },
        {
            id: 3,
            name: "Quadra Municipal",
            distance: "600 metros",
            rating: 4.2,
            reviews: 180,
            type: "Gratuito",
            image: "https://via.placeholder.com/300x150/FF9800/FFFFFF?text=Quadra+Municipal",
            coordinate: {
                latitude: -23.6206,
                longitude: -46.5432,
            },
            markerColor: "#8E44AD",
        },
        {
            id: 4,
            name: "Arena Esportiva",
            distance: "1.5 km",
            rating: 4.7,
            reviews: 650,
            type: "Pago",
            image: "https://via.placeholder.com/300x150/9C27B0/FFFFFF?text=Arena+Esportiva",
            coordinate: {
                latitude: -23.6126,
                longitude: -46.5532,
            },
            markerColor: "#E67E22",
        },
    ];

    const handleMarkerPress = (place) => {
        setSelectedPlace(place);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedPlace(null);
    };

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

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.searchContainer}>
                    <IconButton
                        icon="web-search"
                        size={20}
                        color="#666"
                        style={styles.searchIcon}
                    />
                    <TextInput
                        style={styles.searchText}
                        placeholder="Digite o Local"
                        onChange={setLocalSearch}
                        value={localSearch}
                    />
                    <IconButton icon="pencil" size={18} color="#666" />
                </View>

                <View style={styles.filtersContainer}>
                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterText}>Filtrar</Text>
                        <IconButton
                            icon="chevron-down"
                            size={16}
                            color="#666"
                        />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={styles.filterText}>Organizar</Text>
                        <IconButton
                            icon="chevron-down"
                            size={16}
                            color="#666"
                        />
                    </TouchableOpacity>

                    <Text style={styles.resultsText}>59 results</Text>
                </View>
            </View>

            {/* Mapa */}
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -23.6176,
                    longitude: -46.5472,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                {places.map((place) => (
                    <Marker
                        key={place.id}
                        coordinate={place.coordinate}
                        onPress={() => handleMarkerPress(place)}
                    >
                        <CustomMarker place={place} />
                    </Marker>
                ))}
            </MapView>

            {/* Modal */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        onPress={closeModal}
                        activeOpacity={1}
                    />

                    <View style={styles.modalContent}>
                        <View style={styles.modalHandle} />

                        {selectedPlace && (
                            <>
                                <Image
                                    source={{ uri: selectedPlace.image }}
                                    style={styles.placeImage}
                                    resizeMode="cover"
                                />

                                <View style={styles.placeInfo}>
                                    <Text style={styles.placeName}>
                                        {selectedPlace.name}
                                    </Text>
                                    <View style={styles.placeDetails}>
                                        <View style={styles.ratingContainer}>
                                            <IconButton
                                                icon="star"
                                                size={16}
                                                color="#FFD700"
                                            />
                                            <Text style={styles.ratingText}>
                                                {selectedPlace.rating} (
                                                {selectedPlace.reviews}{" "}
                                                avaliações)
                                            </Text>
                                        </View>
                                        <Text style={styles.distanceText}>
                                            📍 {selectedPlace.distance}
                                        </Text>
                                    </View>

                                    <View style={styles.typeContainer}>
                                        <Text style={styles.typeText}>
                                            {selectedPlace.type}
                                        </Text>
                                        <TouchableOpacity
                                            style={styles.selectButton}
                                        >
                                            <Text
                                                style={styles.selectButtonText}
                                            >
                                                Selecionar
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </>
                        )}
                    </View>
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
        justifyContent: "space-between",
    },
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    filterText: {
        fontSize: 14,
        color: "#666",
        marginRight: 4,
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
    bottomNav: {
        flexDirection: "row",
        backgroundColor: "#FFFFFF",
        paddingVertical: 12,
        paddingBottom: 34,
        borderTopWidth: 1,
        borderTopColor: "#E0E0E0",
    },
    navItem: {
        flex: 1,
        alignItems: "center",
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "flex-end",
    },
    modalBackdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 8,
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
    },
    placeInfo: {
        padding: 16,
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
});
