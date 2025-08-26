import { Icon } from "react-native-paper";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Platform,
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
                <TouchableOpacity
                    onPress={() => router.navigate("/")}
                    style={[styles.backLink, {cursor: 'pointer'}]}
                >
                    {/* <Icon name="arrow-back" type="ionicon" color="#000" /> */}
                    <Icon source="camera" size={20} />
                </TouchableOpacity>
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
                        textContentType="telephoneNumber"
                        keyboardType="phone-pad"
                        // leftIcon={<Icon name="phone" type="font-awesome" />}
                        // leftIcon={<Icon source="camera" size={20} />}
                        // containerStyle={styles.inputContainer}
                        // inputStyle={styles.input}
                        // leftIconContainerStyle={styles.iconContainer}
                    />
                    <TextInput
                        placeholder="Email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect={false}
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        // leftIcon={<Icon name="user" type="font-awesome" />}
                        // leftIcon={<Icon source="camera" size={20} />}
                        // containerStyle={styles.inputContainer}
                        // inputStyle={styles.input}
                        // leftIconContainerStyle={styles.iconContainer}
                    />
                    <TextInput
                        placeholder="Senha"
                        autoCapitalize="none"
                        autoComplete="password"
                        autoCorrect={false}
                        textContentType="password"
                        // leftIcon={
                        //     password === confirmPassword
                        //         // ? <Icon name="lock" type="entypo" />
                        //         // : <Icon name="lock-open" type="entypo" />
                        //         ? <Icon source="camera" size={20} />
                        //         : <Icon source="camera" size={20} />
                        // }
                        secureTextEntry={true}
                        // containerStyle={styles.inputContainer}
                        // inputStyle={styles.input}
                        // leftIconContainerStyle={styles.iconContainer}
                        onChangeText={(value) => setPassword(value)} // Update password state
                    />
                    <TextInput
                        placeholder="Confirmar Senha"
                        autoCapitalize="none"
                        autoComplete="password"
                        autoCorrect={false}
                        textContentType="password"
                        // leftIcon={
                        //     password === confirmPassword
                        //         // ? <Icon name="lock" type="entypo" />
                        //         // : <Icon name="lock-open" type="entypo" />
                        //         ? <Icon source="camera" size={20} />
                        //         : <Icon source="camera" size={20} />
                        // }
                        secureTextEntry={true}
                        // containerStyle={styles.inputContainer}
                        // inputStyle={styles.input}
                        // leftIconContainerStyle={styles.iconContainer}
                        onChangeText={(value) => setConfirmPassword(value)} // Update confirmPassword state
                    />
                    {errorMessage ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : null}
                </View>
                <TouchableOpacity style={styles.button} onPress={handleCreateAccount}>
                    {/* <Icon name="user-plus" type="font-awesome" color="#fff" /> */}
                    <Icon source="camera" size={20} />
                    <Text style={styles.buttonText}>Criar conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const width = "90%";

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
        height: "100%",
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