import { Stack } from "expo-router";
import React, { useState, useEffect } from "react";
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, ActivityIndicator, RefreshControl } from "react-native";
import { Notification } from "../../components/Notification";
import { getNotifications, markAsRead, Notification as NotificationType, ListNotificationsQuery } from "../../services/notificationService";
import { formatTimeAgo } from "../../utils/dateUtils";

export default function NotificationScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const query: ListNotificationsQuery = {};
      
      console.log('🔔 [NOTIFICATION SCREEN] Filtro selecionado:', selectedFilter);
      
      // Aplicar filtro de categoria apenas se não for "Todos" e se houver um filtro selecionado
      console.log('🔔 [NOTIFICATION SCREEN] Verificando filtro - selectedFilter:', selectedFilter);
      console.log('🔔 [NOTIFICATION SCREEN] Tipo do selectedFilter:', typeof selectedFilter);
      
      if (selectedFilter && selectedFilter !== "Todos" && selectedFilter !== null) {
        console.log('🔔 [NOTIFICATION SCREEN] Entrou no if - filtro válido detectado');
        const validCategories: ('MATCH' | 'Equipes' | 'Eventos' | 'Comunidade')[] = ['MATCH', 'Equipes', 'Eventos', 'Comunidade'];
        if (validCategories.includes(selectedFilter as any)) {
          query.category = selectedFilter as 'MATCH' | 'Equipes' | 'Eventos' | 'Comunidade';
          console.log('✅ [NOTIFICATION SCREEN] Filtro category aplicado na query:', query.category);
        } else {
          console.warn('⚠️ [NOTIFICATION SCREEN] Categoria inválida:', selectedFilter);
        }
      } else {
        // Não incluir category na query quando for "Todos" ou null
        console.log('🔔 [NOTIFICATION SCREEN] Mostrando todas as notificações (sem filtro de categoria)');
        console.log('🔔 [NOTIFICATION SCREEN] Razão: selectedFilter é', selectedFilter === null ? 'null' : selectedFilter === "Todos" ? '"Todos"' : selectedFilter);
      }

      console.log('🔔 [NOTIFICATION SCREEN] Query enviada:', JSON.stringify(query, null, 2));
      const data = await getNotifications(query);
      console.log('🔔 [NOTIFICATION SCREEN] Notificações recebidas:', data.length);
      if (data.length > 0) {
        console.log('🔔 [NOTIFICATION SCREEN] Categorias das notificações:', data.map(n => n.category));
      }
      setNotifications(data);
    } catch (error) {
      console.error("Erro ao carregar notificações:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    console.log('🔔 [NOTIFICATION SCREEN] useEffect disparado - selectedFilter mudou para:', selectedFilter);
    loadNotifications();
  }, [selectedFilter]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
  };

  const handleNotificationPress = async (notification: NotificationType) => {
    if (!notification.read) {
      try {
        await markAsRead(notification.id);
        // Atualizar localmente
        setNotifications(prev =>
          prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
        );
      } catch (error) {
        console.error("Erro ao marcar notificação como lida:", error);
      }
    }
  };

  const getDefaultAvatar = () => require("../../assets/images/icon.jpeg");
 
  const filters = ["Todos", "MATCH", "Equipes", "Eventos", "Comunidade"];

  const handleFilterPress = (filter: string) => {
    console.log('🔔 [NOTIFICATION SCREEN] Botão clicado:', filter);
    console.log('🔔 [NOTIFICATION SCREEN] Filtro atual antes:', selectedFilter);
    const newFilter = filter === "Todos" ? null : filter;
    console.log('🔔 [NOTIFICATION SCREEN] Novo filtro que será definido:', newFilter);
    setSelectedFilter(newFilter);
  };

  return (
    <SafeAreaView style={styles.wrapper}>
      <Stack.Screen
        options={{
          headerTitle: "Notificações",
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.header,
        }}
      />
      <Text style={styles.title}>Notificações</Text>

      {/* Filtros */}
      <SafeAreaView style={styles.filterContainer}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter ||
              (filter === "Todos" && selectedFilter === null)
                ? styles.activeFilterButton
                : null,
            ]}
            onPress={() => handleFilterPress(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter ||
                (filter === "Todos" && selectedFilter === null)
                  ? styles.activeFilterText
                  : null,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </SafeAreaView>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {loading ? (
          <ActivityIndicator size="large" color="#667eea" style={{ marginTop: 50 }} />
        ) : notifications.length === 0 ? (
          <Text style={styles.emptyText}>Nenhuma notificação encontrada</Text>
        ) : (
          notifications.map((n) => (
            <Notification
              key={n.id}
              avatar={n.fromUserAvatar || getDefaultAvatar()}
              username={n.fromUsername}
              time={formatTimeAgo(n.createdAt)}
              action={n.action}
              thumbnail={n.thumbnail || undefined}
              highlight={!n.read}
              category={n.category}
              onPress={() => handleNotificationPress(n)}
            />
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  wrapper: {
    height: height,
    width: width,
    flex: 1,
    paddingTop: 50,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 16,
    marginBottom: 10,
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
  header: {
    backgroundColor: "#007bff",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    fontSize: 16,
    marginTop: 50,
    paddingHorizontal: 20,
  },
});
