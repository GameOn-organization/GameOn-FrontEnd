import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { IconButton } from "react-native-paper";
import React from "react";
import { SafeAreaView, Image, StyleSheet, Text } from "react-native";

export default function MessagesLayout() {
    const router = useRouter();

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
            <Stack.Screen
                name="chat"
                options={{
                    headerTitle: () => (
                        <SafeAreaView
                            style={{
                                flexDirection: "column",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: "bold", left: 0 }}>
                                Nome
                            </Text>
                            <Text style={{ fontSize: 14, color: "gray", left: 25 }}>
                                Ativo 10h atrás
                            </Text>
                        </SafeAreaView>
                    ),
                    headerLeft: () => (
                        <>
                            <IconButton
                                icon="arrow-left"
                                size={40}
                                onPress={() => {
                                    router.back();
                                }}
                            />
                            <SafeAreaView style={styles.imageContainer}>
                                <Image
                                    source={require("../../../assets/images/icon.jpeg")}
                                    style={styles.image}
                                />
                            </SafeAreaView>
                        </>
                    ),
                    headerRight: () => (
                        <IconButton
                            icon="phone"
                            size={33}
                            onPress={() => {
                                console.log("Iniciar Chamada");
                            }}
                        />
                    ),
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
