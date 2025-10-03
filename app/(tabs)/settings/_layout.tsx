import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { IconButton, Icon, Badge } from "react-native-paper";
import React from "react";
import { SafeAreaView, Image, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";

export default function SettingsLayout() {
    const router = useRouter();

    return (
        <SafeAreaView
            style={{flex: 1}}
        >
            <Stack
                screenOptions={{
                    headerStyle: { alignItems: "center", justifyContent: "center" },
                    headerShown: true,
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
                    name="premium"
                    options={{
                        title: "Assinatura",
                    }}
                />
                <Stack.Screen
                    name="config"
                    options={{
                        title: "Configurações",
                    }}
                />
                <Stack.Screen
                    name="privacy"
                    options={{
                        title: "Privacidade e Segurança",
                    }}
                />
            </Stack>
        </SafeAreaView>
    );
}

const { width, height } = Dimensions.get("window");

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
    footer: {
        height: 100,
        backgroundColor: "#f5f5f5",
        borderTopWidth: 1,
        borderTopColor: "#ddd",
        justifyContent: "center",
        alignItems: "center",
    },
    button: {
        flexDirection: 'row',
        gap: 5,
        justifyContent: 'center',
        alignItems: 'center',
    }
});
