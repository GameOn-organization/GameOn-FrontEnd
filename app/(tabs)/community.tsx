import React from "react";
import { Dimensions, Text, TextInput, SafeAreaView, StyleSheet } from "react-native";
import { Icon } from "react-native-paper";
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
            <SafeAreaView>

                <TextInput
                    placeholder="Buscar na comunidade"
                    style={styles.input}
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
    },
    input: {
        color: "#333",
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
    },
    iconContainer: {
        marginRight: 10,
    },
});