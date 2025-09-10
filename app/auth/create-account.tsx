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
    SafeAreaView,
} from "react-native";

export default function CreateAccount() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [viewPsw, setViewPsw] = useState(false);
    const [viewConPsw, setViewConPsw] = useState(false);
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
        <SafeAreaView style={styles.container}>
            <View style={styles.form}>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "center",
                        width: "100%",
                    }}
                >
                    <IconButton
                        icon="arrow-left"
                        size={20}
                        iconColor="black"
                        onPress={() => router.navigate("/")}
                        style={styles.backLink}
                    />
                    <View style={styles.title}>
                        <Text style={styles.header}>Game On</Text>
                        <Text style={styles.subHeader}>Criar uma conta</Text>
                    </View>
                </View>

                <View style={styles.fields}>
                    <View>
                        <Text>Telefone</Text>
                        <TextInput
                            placeholder="(99) 99999-9999"
                            autoCapitalize="none"
                            autoComplete="tel"
                            autoCorrect={false}
                            keyboardType="phone-pad"
                            style={styles.input}
                            placeholderTextColor="gray"
                        />
                    </View>
                    <View>
                        <Text>Email</Text>
                        <TextInput
                            placeholder="Email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect={false}
                            keyboardType="email-address"
                            style={styles.input}
                            placeholderTextColor="gray"
                        />
                    </View>
                    <View>
                        <Text>Senha</Text>
                        <View style={{flexDirection: 'row'}}>
                            <TextInput
                                placeholder="Senha"
                                autoCapitalize="none"
                                autoComplete="password"
                                autoCorrect={false}
                                secureTextEntry={!viewPsw}
                                onChangeText={(value) => setPassword(value)} // Update password state
                                style={styles.input}
                                placeholderTextColor="gray"
                            />
                            <IconButton
                                icon= {viewPsw ? 'eye' : 'eye-off'}
                                size={20}
                                iconColor="black"
                                onPress={() => setViewPsw(!viewPsw)}
                            />
                        </View>
                    </View>

                    <View style={{backgroundColor: 'green', width: '70%'}}>
                        <Text>Confirmar Senha</Text>
                        <View style={{flexDirection: 'row', backgroundColor: 'blue', width: 'auto'}}>
                            <TextInput
                                placeholder="Confirmar Senha"
                                autoCapitalize="none"
                                autoComplete="password"
                                autoCorrect={false}
                                textContentType="password"
                                secureTextEntry={!viewConPsw}
                                onChangeText={(value) => setConfirmPassword(value)} // Update confirmPassword state
                                style={styles.input}
                                placeholderTextColor="gray"
                            />
                            <IconButton
                                icon= {viewConPsw ? 'eye' : 'eye-off'}
                                size={20}
                                style={{margin: 'none', justifyContent: 'center'}}
                                iconColor="black"
                                onPress={() => setViewConPsw(!viewConPsw)}
                            />
                        </View>
                        {errorMessage ? (
                            <Text style={styles.errorText}>{errorMessage}</Text>
                        ) : null}
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={handleCreateAccount}
                >
                    <Icon source="account-plus" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Criar conta</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
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
        width: width,
        maxWidth: width - 40,
        height: height * 0.7,
        alignItems: "flex-start",
        justifyContent: "flex-start",
        padding: 20,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: "#fff",
    },
    title: {
        alignItems: "center",
        marginLeft: 0,
    },
    fields: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
    },
    backLink: {
        position: "absolute",
        borderRadius: 5,
        zIndex: 1,
        marginRight: "90%",
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
        marginBottom: 15,
    },
    input: {
        color: "#333",
        width: "70%",
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
