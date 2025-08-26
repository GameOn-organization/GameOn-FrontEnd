import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Icon } from 'react-native-paper';

export default function ForgotPassword() {
    return (
        <View style={styles.container}>
            <Text style={styles.header}>Esqueci minha senha</Text>
            <Text style={styles.description}>
                Digite seu e-mail para receber instruções de recuperação de senha.
            </Text>
            <TextInput
                style={styles.input}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="done"
                onSubmitEditing={() => console.log("E-mail enviado")}
            />
            <TouchableOpacity style={styles.button} onPress={() => console.log("E-mail enviado")}>
                {/* <Icon name="envelope" type="font-awesome" color="#fff" /> */}
                <Icon source="camera" size={20} />
                <Text style={styles.buttonText}>Enviar e-mail de recuperação</Text>
            </TouchableOpacity>
            <Link href="/" style={styles.link}>
                <Text style={styles.linkText}>Voltar para o login</Text>
            </Link>
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
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#333",
        textAlign: "center",
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
        color: "#666",
        textAlign: "center",
    },
    input: {
        width: "100%",
        maxWidth: 400,
        borderColor: "#ccc",
        borderWidth: 1,
        padding: 10,
        borderRadius: 5,
        marginBottom: 20,
        color: "#333",
        backgroundColor: "#fff",
    },
    button: {
        backgroundColor: "black",
        padding: 15,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        maxWidth: 400,
        marginBottom: 20,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
        marginLeft: 10,
    },
    link: {
        marginTop: 10,
    },
    linkText: {
        color: "blue",
        textDecorationLine: "underline",
        fontSize: 16,
    },
});