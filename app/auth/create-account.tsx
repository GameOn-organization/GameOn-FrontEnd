import { IconButton, Icon } from "react-native-paper";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function CreateAccount() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const handleCreateAccount = () => {
        if (password !== confirmPassword) {
            setErrorMessage("As senhas não coincidem");
        } else {
            console.log("Conta criada com sucesso!");
            setErrorMessage(""); // Clear error message
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.form}>
                <IconButton
                    icon="arrow-left"
                    size={20}
                    iconColor="black"
                    onPress={() => router.navigate("/")}
                    style={styles.backLink} />
                <View style={{ width: "100%", alignItems: "center" }}>
                    <Text style={styles.header}>
                        Game On
                    </Text>
                    <Text style={styles.subHeader}>
                        Criar uma conta
                    </Text>
                    <TextInput
                        placeholder="(99) 99999-9999"
                        autoCapitalize="none"
                        autoComplete="tel"
                        autoCorrect={false}
                        keyboardType="phone-pad"
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                    <TextInput
                        placeholder="Email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect={false}
                        keyboardType="email-address"
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                    <TextInput
                        placeholder="Senha"
                        autoCapitalize="none"
                        autoComplete="password"
                        autoCorrect={false}
                        secureTextEntry={true}
                        onChangeText={(value) => setPassword(value)} // Update password state
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                    <TextInput
                        placeholder="Confirmar Senha"
                        autoCapitalize="none"
                        autoComplete="password"
                        autoCorrect={false}
                        textContentType="password"
                        secureTextEntry={true}
                        onChangeText={(value) => setConfirmPassword(value)} // Update confirmPassword state
                        style={styles.input}
                        placeholderTextColor="gray"
                    />
                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}
                </View>
                <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
                    <Icon source="account-plus" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Criar conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
    },
    form: {
        justifyContent: "space-between",
        width: width,
        height: height * 0.7,
        maxWidth: 400,
        padding: 20,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#fff",
    },
    backLink: {
        position: "absolute",
        borderRadius: 5,
        zIndex: 1,
    },
    header: {
        fontSize: 30,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
        textAlign: "center",
    },
    subHeader: {
        fontSize: 24,
        marginBottom: 20,
        color: "#333",
        textAlign: "center",
    },
    inputContainer: {
        width: "100%",
        maxWidth: 400,
        marginBottom: 15,
    },
    input: {
        color: "#333",
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#fff",
        marginBottom: 15,
    },
    iconContainer: {
        marginRight: 10,
    },
    errorText: {
        color: "red",
        marginBottom: 10,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#000",
        paddingVertical: 15,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        maxWidth: 400,
        marginTop: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
});