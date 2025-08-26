import React from "react";
import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Icon } from "react-native-paper";
import { Stack } from "expo-router";

export default function Events() {
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: "Eventos",
        //   headerRight: () => (
        //     <Link href="/events/create" style={styles.createEventLink}>
        //       <Icon name="plus" type="font-awesome" color="#fff" />
        //       <Icon source="camera" size={20} />
        //     </Link>
        //   ),
        }}
      />
      <Text style={styles.title}>Eventos</Text>
      <Text style={styles.description}>
        Aqui você pode ver os eventos disponíveis e criar novos eventos.
      </Text>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f0f0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  description: {
    fontSize: 16,
    color: "#666",
  },
  createEventLink: {
    padding: 10,
    backgroundColor: "#007bff",
    borderRadius: 5,
    marginRight: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
});