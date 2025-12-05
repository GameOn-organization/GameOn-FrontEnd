import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { IconButton } from "react-native-paper";
import React from "react";
import { SafeAreaView, Image, StyleSheet, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function MessagesLayout() {
    const router = useRouter();
    const { name, image } = useLocalSearchParams();

    return (
        <Stack
            screenOptions={{
                headerShown: true, //Se (Chat) -> headerTitle: Nome Usuario
                headerTitleAlign: "center",
                headerTitleStyle: {
                    fontSize: 20,
                    fontWeight: "bold",
                },
                headerStyle: {
                    backgroundColor: "#fafafa",
                    borderBottomWidth: 0,
                    shadowOpacity: 0,
                    elevation: 0,
                    alignItems: "center", 
                    justifyContent: "center"
                },
                headerLeft: () => (
                    <IconButton
                        icon="arrow-left"
                        size={40}
                        onPress={() => {
                            router.back();
                        }}
                    />
                ),
            }}
        >
            <Stack.Screen
                name="message"
                options={{
                    title: "Mensagens",
                }}
            />
        </Stack>
    );
}

const styles = StyleSheet.create({
    imageContainer: {
        left: 20, // Centraliza horizontalmente
        width: 50,
        height: 50,
        borderRadius: 75,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 75,
    },
});
