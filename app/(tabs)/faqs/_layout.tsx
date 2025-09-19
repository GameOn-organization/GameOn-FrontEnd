import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { IconButton, Icon, Badge } from "react-native-paper";
import React from "react";
import { SafeAreaView, Image, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";

export default function FaqsLayout() {
    const router = useRouter();

    return (
        <SafeAreaView
            style={{flex: 1}}
        >
            <Stack
                screenOptions={{
                    headerStyle: { alignItems: "center", justifyContent: "center" },
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
                    // If User != Player And User != Associate
                    headerRight: () => (
                        <IconButton
                            icon="plus"
                            size={40}
                            onPress={() => {
                                console.log('Adicionar FAQ');
                            }}
                        />
                    )
                    //Endif
                }}
            >
                <Stack.Screen
                    name="faqsScreen"
                    options={{
                        title: "FAQS",
                    }}
                />
                {/* <Stack.Screen
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
                /> */}
            </Stack>
            <SafeAreaView
                style={styles.footer}
            >
                <TouchableOpacity
                    style={styles.button}
                    // Chat Com o Suporte
                    onPress={() => router.navigate('/messages/chat')}
                >
                    <Text
                        style={{fontSize: 35}}
                    >SOS</Text>
                    <Icon
                        source='message-outline'
                        color='black'
                        size={45}
                    />
                    <Badge
                        size={22} // Tamanho do badge
                        style={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            borderColor: 'white',
                            borderWidth: 1.5,
                        }}
                    >33</Badge>
                </TouchableOpacity>
            </SafeAreaView>
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
