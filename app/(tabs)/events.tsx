import AddEventModal from "@/components/addEventModal";
import EventDetailModal from "@/components/eventDetailModal";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Image,
} from "react-native";
import {
    Event as BackendEvent,
    CreateEventData,
    createEvent,
    getSubscribedEvents,
    listEvents,
    subscribeToEvent,
    unsubscribeFromEvent,
} from "../../services/eventsService";
import { getAuth } from "firebase/auth";

const { width } = Dimensions.get("window");

// Interface local para exibicao
interface EventDisplay {
    id: string;
    title: string;
    rating: string;
    distance: string;
    price: string;
    description: string;
    imagePlaceholderText: string;
    imagePlaceholderSubtext: string;
    category: "Eventos Inscritos" | "Eventos Abertos";
    location?: {
        latitude: number;
        longitude: number;
        address?: string;
    };
    eventType?: 'physical' | 'digital';
    date?: string;
    isSubscribed?: boolean;
    image?: string;
}

type FilterCategory = "Todos" | "Eventos Inscritos" | "Eventos Abertos";

// Converter evento do backend para formato de exibicao
const convertBackendEventToDisplay = (
    event: BackendEvent,
    subscribedIds: string[]
): EventDisplay => {
    const isSubscribed = subscribedIds.includes(event.id);

    // Log para debug
    if (event.image) {
        console.log(`[CONVERT] Evento "${event.title}" tem imagem:`, event.image);
    }

    return {
        id: event.id,
        title: event.title,
        rating: `${event.rating || 0} (${event.participants?.length || 0} participantes)`,
        distance: event.distance || "Calcular...",
        price: event.price,
        description: event.description,
        imagePlaceholderText: event.imagePlaceholderText || event.title.substring(0, 10),
        imagePlaceholderSubtext: event.imagePlaceholderSubtext || event.category || "Evento",
        category: isSubscribed ? "Eventos Inscritos" : "Eventos Abertos",
        location: event.location,
        eventType: event.eventType,
        date: event.date ? String(event.date) : undefined,
        isSubscribed,
        image: event.image,
    };
};

export default function Events() {
    const [events, setEvents] = useState<EventDisplay[]>([]);
    const [subscribedIds, setSubscribedIds] = useState<string[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<EventDisplay | null>(null);
    const [isDetailModalVisible, setDetailModalVisible] = useState(false);
    const [isAddModalVisible, setAddModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedFilter, setSelectedFilter] = useState<FilterCategory>("Todos");

    const filters: FilterCategory[] = [
        "Todos",
        "Eventos Inscritos",
        "Eventos Abertos",
    ];

    // Carregar eventos do backend
    const loadEvents = useCallback(async (showLoading = true) => {
        try {
            if (showLoading) setIsLoading(true);
            setError(null);

            // Buscar eventos e eventos inscritos em paralelo
            const [allEvents, subscribed] = await Promise.all([
                listEvents({ isActive: true, orderBy: 'date', orderDirection: 'asc' }),
                getSubscribedEvents().catch(() => []), // Se falhar, retorna lista vazia
            ]);

            const subscribedIdsList = subscribed.map(e => e.id);
            setSubscribedIds(subscribedIdsList);

            const displayEvents = allEvents.map(e =>
                convertBackendEventToDisplay(e, subscribedIdsList)
            );

            setEvents(displayEvents);
        } catch (err: any) {
            console.error('[EVENTS] Erro ao carregar eventos:', err);
            setError(err.message || 'Erro ao carregar eventos');
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        loadEvents();
    }, [loadEvents]);

    const onRefresh = useCallback(() => {
        setIsRefreshing(true);
        loadEvents(false);
    }, [loadEvents]);

    const filteredEvents = useMemo(() => {
        if (selectedFilter === "Todos") {
            return events;
        }
        return events.filter((event) => event.category === selectedFilter);
    }, [selectedFilter, events]);

    const handleFilterPress = (filter: FilterCategory) => {
        setSelectedFilter(filter);
    };

    const handleEventPress = (event: EventDisplay) => {
        setSelectedEvent(event);
        setDetailModalVisible(true);
    };

    const handleAddEvent = async (newEventData: any) => {
        try {
            const eventToCreate: CreateEventData = {
                title: newEventData.title,
                description: newEventData.description,
                price: newEventData.price || "Gratis",
                image: newEventData.image, // ✅ Adicionar a URL da imagem
                imagePlaceholderText: newEventData.imagePlaceholderText,
                imagePlaceholderSubtext: newEventData.imagePlaceholderSubtext,
                location: newEventData.location || {
                    latitude: -23.6186,
                    longitude: -46.5472,
                    address: "Sao Paulo, SP"
                },
                eventType: newEventData.eventType || 'physical',
                category: newEventData.category || 'Geral',
                date: newEventData.date || new Date(),
            };

            console.log('[EVENTS] Criando evento com imagem:', eventToCreate.image ? 'SIM' : 'NÃO');
            await createEvent(eventToCreate);
            setAddModalVisible(false);
            loadEvents(false); // Recarregar eventos
        } catch (err: any) {
            console.error('[EVENTS] Erro ao criar evento:', err);
            alert(err.message || 'Erro ao criar evento');
        }
    };

    const handleSubscribe = async (eventId: string) => {
        try {
            const auth = getAuth();
            if (!auth.currentUser) {
                alert('Voce precisa estar logado para se inscrever em eventos');
                return;
            }

            await subscribeToEvent(eventId);
            loadEvents(false);
        } catch (err: any) {
            console.error('[EVENTS] Erro ao se inscrever:', err);
            alert(err.message || 'Erro ao se inscrever no evento');
        }
    };

    const handleUnsubscribe = async (eventId: string) => {
        try {
            await unsubscribeFromEvent(eventId);
            loadEvents(false);
        } catch (err: any) {
            console.error('[EVENTS] Erro ao cancelar inscricao:', err);
            alert(err.message || 'Erro ao cancelar inscricao');
        }
    };

    const renderEventItem = ({ item }: { item: EventDisplay }) => (
        <TouchableOpacity
            style={styles.eventCard}
            onPress={() => handleEventPress(item)}
        >
            {item.image ? (
                <Image
                    source={{ uri: item.image }}
                    style={styles.eventImageSmall}
                />
            ) : (
                <View style={styles.eventImagePlaceholderSmall}>
                    <Text style={styles.imagePlaceholderTextSmall}>
                        {item.imagePlaceholderText}
                    </Text>
                </View>
            )}
            <View style={styles.eventCardInfo}>
                <Text style={styles.eventCardTitle}>{item.title}</Text>
                <Text style={styles.eventCardRating}>{item.rating}</Text>
                <Text style={styles.eventCardDistance}>{item.distance}</Text>
                {item.isSubscribed && (
                    <View style={styles.subscribedBadge}>
                        <Text style={styles.subscribedBadgeText}>Inscrito</Text>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );

    if (isLoading) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#000" />
                    <Text style={styles.loadingText}>Carregando eventos...</Text>
                </View>
            </SafeAreaView>
        );
    }

    if (error) {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => loadEvents()}>
                        <Text style={styles.retryButtonText}>Tentar Novamente</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }

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

            {/* FlatList com pull-to-refresh */}
            {filteredEvents.length > 0 ? (
                <FlatList
                    data={filteredEvents}
                    renderItem={renderEventItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.eventList}
                    refreshControl={
                        <RefreshControl
                            refreshing={isRefreshing}
                            onRefresh={onRefresh}
                            colors={["#000"]}
                        />
                    }
                />
            ) : (
                <View style={styles.emptyState}>
                    <Text style={styles.emptyStateText}>
                        Nenhum evento encontrado para "{selectedFilter}".
                    </Text>
                    <TouchableOpacity onPress={onRefresh}>
                        <Text style={styles.refreshText}>Atualizar</Text>
                    </TouchableOpacity>
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
                    onSubscribe={() => handleSubscribe(selectedEvent.id)}
                    onUnsubscribe={() => handleUnsubscribe(selectedEvent.id)}
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
        paddingBottom: 100,
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
    eventImageSmall: {
        width: 100,
        height: 100,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        resizeMode: "cover",
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
    subscribedBadge: {
        backgroundColor: "#4CAF50",
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 10,
        alignSelf: "flex-start",
        marginTop: 5,
    },
    subscribedBadgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
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
    refreshText: {
        fontSize: 16,
        color: "#007AFF",
        marginTop: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: "#ff4757",
        textAlign: "center",
        marginBottom: 20,
    },
    retryButton: {
        backgroundColor: "#000",
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});