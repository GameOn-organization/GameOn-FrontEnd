import React from "react";
import { Dimensions, Text, SafeAreaView, StyleSheet } from "react-native";
import { Icon, IconButton, TextInput } from "react-native-paper";
import { Stack } from "expo-router";

export default function Community() {
    return (
        <SafeAreaView style={[styles.container, { justifyContent: "flex-start" }]}>
            <Stack.Screen
                options={{
                    headerTitle: "Comunidade",
                    headerTitleStyle: styles.headerTitle,
                    headerStyle: styles.header,
                }}
            />
            <SafeAreaView style={styles.inputContainer}>
                <TextInput
                    placeholder="Buscar na Comunidade"
                    style={styles.input}
                    left={<TextInput.Icon
                                icon="search-web"
                                color="black"
                                size={30}
                                style={{ margin: 'auto'}}
                                onPress={() => console.log('Pesquisar')}
                            />}
                    right={<TextInput.Icon
                                icon="pencil-outline"
                                color="black"
                                size={30}
                                style={{ margin: 'auto', paddingRight: 20 }}
                                onPress={() => console.log('Editar Local')}
                            />}
                />
            </SafeAreaView>
            
        </SafeAreaView>
    );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
        padding: 20,
    },
    header: {
        backgroundColor: "#007bff",
        padding: 10,
        width: "100%",
        alignItems: "center",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    headerTitle: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
    },
    inputContainer: {
        width: "100%",
        marginBottom: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    input: {
        backgroundColor: "#e0e0e0",
        width: width * 0.85,
        height: 30,
        color: "#333",
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    iconContainer: {
        marginRight: 10,
    },
});