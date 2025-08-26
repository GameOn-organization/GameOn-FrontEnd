import React, { useState } from "react";
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Stack } from "expo-router";
import { Notification } from "../../components/Notification";

export default function NotificationScreen() {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const notifications = [
    {
      avatar: require("../../assets/images/icon.jpeg"),
      username: "starryskies23",
      time: "1d",
      action: "NOVO MATCH!",
      thumbnail: null,
      highlight: true,
      category: "MATCH!",
    },
    {
      avatar: require("../../assets/images/icon.jpeg"),
      username: "nebulanomad",
      time: "1d",
      action: "Curtiu sua publicação",
      thumbnail: require("../../assets/images/icon.jpeg"),
      category: "Equipes",
    },
    {
      avatar: require("../../assets/images/icon.jpeg"),
      username: "shadowlynx",
      time: "4d",
      action: "Comentou sua publicação: O Luka Magic DETONOU nesse jogo!!",
      thumbnail: require("../../assets/images/icon.jpeg"),
      category: "Eventos",
    },
    {
      avatar: require("../../assets/images/icon.jpeg"),
      username: "emberecho",
      time: "2d",
      action: "Curtiu seu comentário 🎉",
      thumbnail: null,
      category: "Comunidade",
    },
  ];

  const filters = ["Todos", "MATCH!", "Equipes", "Eventos", "Comunidade"];

  const filteredNotifications =
    selectedFilter && selectedFilter !== "Todos"
      ? notifications.filter((n) => n.category === selectedFilter)
      : notifications;

  const handleFilterPress = (filter: string) => {
    setSelectedFilter((prev) => (prev === filter ? null : filter));
  };

  return (
    <View style={styles.wrapper}>
      <Stack.Screen
        options={{
          headerTitle: "Notificações",
          headerTitleStyle: styles.headerTitle,
          headerStyle: styles.header,
        }}
      />
      <Text style={styles.title}>Notificações</Text>

      {/* Filtros */}
      <View style={styles.filterContainer}>
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
            onPress={() =>
              setSelectedFilter(filter === "Todos" ? null : filter)
            }
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
      </View>

      <ScrollView>
        {filteredNotifications.map((n, i) => (
          <Notification key={i} {...n} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    marginTop: 20,
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
});
