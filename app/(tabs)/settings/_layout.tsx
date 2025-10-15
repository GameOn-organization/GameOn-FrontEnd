import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { IconButton } from "react-native-paper";
import React from "react";
import { SafeAreaView } from "react-native";

export default function SettingsLayout() {
    const router = useRouter();

    return (
        <SafeAreaView
            style={{flex: 1}}
        >
            <Stack
                screenOptions={{
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
                        alignItems: "center", 
                        justifyContent: "center"
                    },
                    headerLeft: () => (
                        <IconButton
                            icon="arrow-left"
                            size={40}
                            onPress={() => {
                                router.navigate('../../profile');
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
