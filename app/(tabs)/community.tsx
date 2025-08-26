import React from "react";
import { Text, TextInput, View, StyleSheet } from "react-native";
import { Icon } from "react-native-paper";
import { Stack } from "expo-router";

export default function Community() {
    return (
        <View style={[styles.container, { justifyContent: "flex-start" }]}>
            <Stack.Screen
                options={{
                    headerTitle: "Comunidade",
                    headerTitleStyle: styles.headerTitle,
                    headerStyle: styles.header,
                }}
            />
            <View>

                <TextInput
                    placeholder="Buscar na comunidade"
                    // leftIcon={<Icon name="search" type="font-awesome" />}
                    // leftIcon={<Icon source="camera" size={20} />}
                    // rightIcon={
                    //     // <Icon
                    //     //     name="filter"
                    //     //     type="font-awesome"
                    //     //     color="#000"
                    //     //     onPress={() => console.log()}
                    //     // />
                    //     <Icon source="camera" size={20} />
                    // }
                    // containerStyle={styles.inputContainer}
                    // inputStyle={styles.input}
                    // leftIconContainerStyle={{ marginRight: 10 }}
                    // rightIconContainerStyle={{ marginLeft: 10 }}
                />

            </View>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
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