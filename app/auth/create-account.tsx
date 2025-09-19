import { IconButton, Icon } from "react-native-paper";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    SafeAreaView,
} from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";
import DateTimePicker from "@react-native-community/datetimepicker";
import Formulario from "../../components/Formulario";

export default function CreateAccount() {
    const [modalTransparent, setModalTransparent] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
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
            {/* Formulário de Editar Perfil*/}
            <Modal
                backdropColor='black'
                animationType="slide"
                transparent={modalTransparent}
                visible={editVisible}
                onRequestClose={() => {
                    setEditVisible(!editVisible),
                        setModalTransparent(!modalTransparent);
                }}
            >
                <IconButton
                    icon="arrow-left"
                    size={24}
                    iconColor="white"
                    style={{ backgroundColor: "black" }}
                    onPress={() => {
                        setEditVisible(!editVisible),
                            setModalTransparent(!modalTransparent);
                    }}
                />
                <Formulario
                    styleProp={{backgroundColor: 'black'}}
                    colorProp={['black', 'black']}
                />
            </Modal>

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
                    <View style={{ width: "100%" }}>
                        <Text>Telefone</Text>
                        <MaskInput
                            placeholder="(99) 99999-9999"
                            autoCapitalize="none"
                            autoComplete="tel"
                            autoCorrect={false}
                            minLength={15}
                            maxLength={15}
                            keyboardType="phone-pad"
                            placeholderTextColor="gray"
                            value={phone}
                            onChangeText={(masked, unmasked) =>
                                setPhone(masked)
                            }
                            mask={Masks.BRL_PHONE}
                            style={styles.input}
                        />
                    </View>
                    <View style={{ width: "100%" }}>
                        <Text>Email</Text>
                        <TextInput
                            placeholder="Email"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect={false}
                            maxLength={40}
                            value={email}
                            onChangeText={(value) => setEmail(value)}
                            keyboardType="email-address"
                            style={styles.input}
                            placeholderTextColor="gray"
                        />
                    </View>
                    <View style={{ width: "100%" }}>
                        <Text>Senha</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                placeholder="Senha"
                                autoCapitalize="none"
                                minLength={8}
                                autoComplete="password"
                                autoCorrect={false}
                                secureTextEntry={!viewPsw}
                                onChangeText={(value) => setPassword(value)} // Update password state
                                style={styles.input}
                                placeholderTextColor="gray"
                            />
                            <IconButton
                                icon={viewPsw ? "eye" : "eye-off"}
                                size={20}
                                iconColor="black"
                                onPress={() => setViewPsw(!viewPsw)}
                            />
                        </View>
                    </View>

                    <View style={{ width: "100%" }}>
                        <Text>Confirmar Senha</Text>
                        <View style={{ flexDirection: "row" }}>
                            <TextInput
                                placeholder="Confirmar Senha"
                                autoCapitalize="none"
                                minLength={8}
                                autoComplete="password"
                                autoCorrect={false}
                                textContentType="password"
                                secureTextEntry={!viewConPsw}
                                onChangeText={(value) =>
                                    setConfirmPassword(value)
                                }
                                style={styles.input}
                                placeholderTextColor="gray"
                            />
                            <IconButton
                                icon={viewConPsw ? "eye" : "eye-off"}
                                size={20}
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
                    onPress={() => {
                        setEditVisible(true), setModalTransparent(false);
                    }}
                >
                    <Icon source="pencil-outline" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Editar Informações</Text>
                </TouchableOpacity>
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
        width: width - 40,
        maxWidth: width - 40,
        height: height * 0.7,
        alignItems: "center",
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
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "space-around",
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
    input: {
        width: "85%",
        maxWidth: "85%",
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
