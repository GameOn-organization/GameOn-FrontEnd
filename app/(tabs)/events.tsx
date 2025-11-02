import AddEventModal from "@/components/addEventModal";
import EventDetailModal from "@/components/eventDetailModal";
import React, { useMemo, useState } from "react";
import {
    Dimensions,
    FlatList,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

// Definindo o tipo para os dados de evento para melhor tipagem
interface Event {
    id: string;
    title: string;
    rating: string;
    distance: string;
    price: string;
    description: string;
    imagePlaceholderText: string;
    imagePlaceholderSubtext: string;
    category: "Eventos Inscritos" | "Eventos Abertos";
}

// Definindo o tipo para as categorias de filtro
type FilterCategory = "Todos" | "Eventos Inscritos" | "Eventos Abertos";

// Dados Iniciais (com tipagem)
const initialEvents: Event[] = [
    {
        id: "1",
        title: "NBA House",
        rating: "4.8 (500 avaliações)",
        distance: "1.2 km",
        price: "R$200",
        description:
            "Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites",
        imagePlaceholderText: "NBA House",
        imagePlaceholderSubtext: "Evento de basquete",
        category: "Eventos Inscritos",
    },
    {
        id: "2",
        title: "Brasil Game Show",
        rating: "4.9 (1200 avaliações)",
        distance: "5.0 km",
        price: "R$350",
        description:
            "The Rock in Rio festival is one of the largest music festivals in the world, held in Rio de Janeiro, Brazil. It features a wide variety of international and national artists across multiple stages.",
        imagePlaceholderText: "BGS",
        imagePlaceholderSubtext: "Evento de Games",
        category: "Eventos Inscritos",
    },
    {
        id: "3",
        title: "Comic Con Experience",
        rating: "4.7 (800 avaliações)",
        distance: "3.5 km",
        price: "R$150",
        description:
            "Comic Con Experience (CCXP) is a Brazilian multi-genre entertainment convention. It features comics, movies, TV series, video games, literature, and more, bringing together fans and creators.",
        imagePlaceholderText: "CCXP",
        imagePlaceholderSubtext: "Cultura Pop",
        category: "Eventos Abertos",
    },
];

export default function App() {
    // Mantendo o estado 'events' para permitir a adição de novos eventos
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isDetailModalVisible, setDetailModalVisible] = useState(false);
    const [isAddModalVisible, setAddModalVisible] = useState(false);

    // Estado para o filtro. Usamos "Todos" como valor inicial.
    const [selectedFilter, setSelectedFilter] =
        useState<FilterCategory>("Todos");

    const filters: FilterCategory[] = [
        "Todos",
        "Eventos Inscritos",
        "Eventos Abertos",
    ];

    // Lógica de Filtragem Otimizada com useMemo
    const filteredEvents = useMemo(() => {
        if (selectedFilter === "Todos") {
            // Retorna a lista de eventos atualizada (incluindo os adicionados)
            return events;
        }
        // Filtra a lista de eventos atualizada pela categoria selecionada
        return events.filter((event) => event.category === selectedFilter);
    }, [selectedFilter, events]); // Recalcula quando o filtro ou a lista de eventos muda

    const handleFilterPress = (filter: FilterCategory) => {
        // Apenas define o filtro, a lista é recalculada pelo useMemo
        setSelectedFilter(filter);
    };

    const handleEventPress = (event: Event) => {
        setSelectedEvent(event);
        setDetailModalVisible(true);
    };

    const handleAddEvent = (newEvent: Omit<Event, "id">) => {
        setEvents((prevEvents) => [
            { ...newEvent, id: String(prevEvents.length + 1) } as Event,
            ...prevEvents, // Adiciona o novo evento no topo da lista
        ]);
        setAddModalVisible(false);
    };

    const renderEventItem = ({ item }: { item: Event }) => (
        <TouchableOpacity
            style={styles.eventCard}
            onPress={() => handleEventPress(item)}
        >
            <View style={styles.eventImagePlaceholderSmall}>
                <Text style={styles.imagePlaceholderTextSmall}>
                    {item.imagePlaceholderText}
                </Text>
            </View>
            <View style={styles.eventCardInfo}>
                <Text style={styles.eventCardTitle}>{item.title}</Text>
                <Text style={styles.eventCardRating}>{item.rating}</Text>
                <Text style={styles.eventCardDistance}>{item.distance}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.mainTitle}>Eventos</Text>

            {/* Filtros */}
            <SafeAreaView style={styles.filterContainer}>
                {filters.map((filter) => (
                    <TouchableOpacity
                        key={filter}
                        style={[
                            styles.filterButton,
                            selectedFilter === filter
                                ? styles.activeFilterButton
                                : null,
                        ]}
                        onPress={() => handleFilterPress(filter)}
                    >
                        <Text
                            style={[
                                styles.filterText,
                                selectedFilter === filter
                                    ? styles.activeFilterText
                                    : null,
                            ]}
                        >
                            {filter}
                        </Text>
                    </TouchableOpacity>
                ))}
            </SafeAreaView>

            {/* FlatList agora usa a lista filtrada */}
            {filteredEvents.length > 0 ? (
                <FlatList
                    data={filteredEvents}
                    renderItem={renderEventItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.eventList}
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        Nenhum evento encontrado para "{selectedFilter}".
                    </Text>
                </View>
            )}

            <TouchableOpacity
                style={styles.addButton}
                onPress={() => setAddModalVisible(true)}
            >
                <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>

            {selectedEvent && (
                <EventDetailModal
                    isVisible={isDetailModalVisible}
                    onClose={() => setDetailModalVisible(false)}
                    event={selectedEvent}
                />
            )}

            <AddEventModal
                isVisible={isAddModalVisible}
                onClose={() => setAddModalVisible(false)}
                onAddEvent={handleAddEvent}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f0f2f5",
        paddingTop: 20,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        textAlign: "center",
        marginBottom: 20,
        paddingTop: 30,
    },
    eventList: {
        paddingHorizontal: 10,
        paddingBottom: 100, // Adicionado para garantir que o último item não fique escondido pelo botão flutuante
    },
    eventCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        marginVertical: 8,
        marginHorizontal: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: "hidden",
    },
    eventImagePlaceholderSmall: {
        width: 100,
        height: 100,
        backgroundColor: "#1a1a2e",
        justifyContent: "center",
        alignItems: "center",
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
    },
    imagePlaceholderTextSmall: {
        color: "#ff4757",
        fontSize: 18,
        fontWeight: "bold",
        textAlign: "center",
    },
    eventCardInfo: {
        padding: 15,
        justifyContent: "center",
        flex: 1,
    },
    eventCardTitle: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 5,
    },
    eventCardRating: {
        fontSize: 14,
        color: "#666",
        marginBottom: 3,
    },
    eventCardDistance: {
        fontSize: 14,
        color: "#666",
    },
    addButton: {
        position: "absolute",
        bottom: 30,
        right: 30,
        backgroundColor: "#000",
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    addButtonText: {
        color: "#fff",
        fontSize: 30,
        lineHeight: 30,
    },
    filterContainer: {
        flexDirection: "row",
        paddingHorizontal: 10,
        marginBottom: 10,
        flexWrap: "wrap",
    },
    filterButton: {
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: "#f0f0f0",
    },
    activeFilterButton: {
        backgroundColor: "#000",
        borderColor: "#000",
    },
    filterText: {
        fontSize: 14,
        color: "#000",
    },
    activeFilterText: {
        color: "#fff",
        fontWeight: "bold",
    },
    emptyState: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 50,
    },
    emptyStateText: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
    },
});
