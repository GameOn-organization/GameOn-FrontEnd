import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { IconButton, Icon, Badge } from "react-native-paper";
import React from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function FaqsLayout() {
    const router = useRouter();

    return (
        <SafeAreaView
            style={{flex: 1}}
        >
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
                    // If User != Player And User != Associate
                        // If CurrentPage == faqsScreen
                            headerRight: () => (
                                <IconButton
                                    icon="plus"
                                    size={40}
                                    onPress={() => {
                                        console.log('Adicionar FAQ');
                                    }}
                                />
                            )
                        // EndIf
                    //Endif
                }}
            >
                <Stack.Screen
                    name="faqsScreen"
                    options={{
                        title: "FAQS",
                    }}
                />
                <Stack.Screen
                    name="faqAbout"
                    options={{
                        title: "NOME DA FAQ",
                    }}
                />
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

const styles = StyleSheet.create({
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
