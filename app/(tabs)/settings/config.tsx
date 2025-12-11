import { IconButton } from "react-native-paper";
import React, { useState, useEffect } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    ScrollView,
    TouchableOpacity,
    TextInput
} from 'react-native';
import MaskInput, { Masks } from "react-native-mask-input";
import { getMyProfile, updateMyProfile } from "../../../services/authService";

export default function SettingsScreen() {
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [viewPsw, setViewPsw] = useState(false);
    const [viewConPsw, setViewConPsw] = useState(false);

    const [userProfile, setUserProfile] = useState<any>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    // Função para buscar perfil do usuário
    const fetchProfile = async () => {
        try {
            const profile = await getMyProfile();
            if (profile) {
                setUserProfile(profile);
            } else {
                console.warn("Perfil não encontrado");
            }
        } catch (error: any) {
            console.error("Erro ao buscar perfil:", error);
            // Não mostrar alerta, apenas logar o erro
            // O usuário pode não ter perfil ainda
        } finally {
            setIsLoadingProfile(false);
        }
    };

    // Buscar posts e perfil ao montar o componente
    useEffect(() => {
        fetchProfile();
    }, []);

    const validateChange = () => {
        if (email === confirmEmail) {
            Alert.alert('Sucesso!', 'Alteração de e-mail realizada com sucesso!');
            setEmail('');
            setConfirmEmail('');
        } else {
            Alert.alert('Erro!', 'Os e-mails não conferem!');
        }
    };

    const validatePassword = () => {
        if (password === confirmPassword) {
            Alert.alert('Sucesso!', 'Alteração de senha realizada com sucesso!');
            setPassword('');
            setConfirmPassword('');
        } else {
            Alert.alert('Erro!', 'As senhas não conferem!');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
            >
                    
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Alterar E-mail</Text>
                    <View style={styles.card}>
                        <Text style={styles.currentInfo}>E-mail Atual: {isLoadingProfile ? "Carregando..." : (userProfile?.email || "Email do Usuário")}</Text>
                        <TextInput
                            placeholder="Novo E-mail"
                            autoComplete="email"
                            keyboardType="email-address"
                            style={styles.input}
                            onChangeText={setEmail}
                            value={email}
                            placeholderTextColor="gray"
                        />
                        <TextInput
                            placeholder="Confirmar Novo E-mail"
                            autoComplete="email"
                            keyboardType="email-address"
                            style={styles.input}
                            onChangeText={setConfirmEmail}
                            value={confirmEmail}
                            placeholderTextColor="gray"
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={validateChange}
                        >
                            <Text style={styles.buttonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Alterar Telefone</Text>
                    <View style={styles.card}>
                        <Text style={styles.currentInfo}>Telefone Atual: {isLoadingProfile ? "Carregando..." : (userProfile?.phone || "Telefone do Usuário")}</Text>
                        <MaskInput
                            placeholder="Novo Telefone"
                            autoCapitalize="none"
                            autoComplete="tel"
                            autoCorrect={false}
                            minLength={15}
                            maxLength={15}
                            keyboardType="phone-pad"
                            placeholderTextColor="gray"
                            value={phone}
                            onChangeText={(masked) => setPhone(masked)}
                            mask={Masks.BRL_PHONE}
                            style={styles.input}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => Alert.alert('Sucesso!', 'Telefone alterado com sucesso!')}
                        >
                            <Text style={styles.buttonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Alterar Senha</Text>
                    <View style={styles.card}>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Nova Senha"
                                autoCapitalize="none"
                                minLength={8}
                                autoComplete="new-password"
                                autoCorrect={false}
                                secureTextEntry={!viewPsw}
                                onChangeText={(value) => setPassword(value)}
                                style={styles.inputPassword}
                                placeholderTextColor="gray"
                            />
                            <IconButton
                                icon={viewPsw ? "eye" : "eye-off"}
                                size={20}
                                iconColor="black"
                                onPress={() => setViewPsw(!viewPsw)}
                            />
                        </View>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Confirmar Senha"
                                autoCapitalize="none"
                                minLength={8}
                                autoComplete="new-password"
                                autoCorrect={false}
                                secureTextEntry={!viewConPsw}
                                onChangeText={(value) => setConfirmPassword(value)}
                                style={styles.inputPassword}
                                placeholderTextColor="gray"
                            />
                            <IconButton
                                icon={viewConPsw ? "eye" : "eye-off"}
                                size={20}
                                iconColor="black"
                                onPress={() => setViewConPsw(!viewConPsw)}
                            />
                        </View>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={validatePassword}
                        >
                            <Text style={styles.buttonText}>Confirmar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    scroll: {
        width: '100%',
    },
    scrollContent: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    section: {
        width: '90%',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 15,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    currentInfo: {
        fontSize: 14,
        color: 'gray',
        marginBottom: 10,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        width: '100%',
        borderRadius: 5,
        marginBottom: 10,
    },
    inputPassword: {
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        width: '85%',
        borderRadius: 5,
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});
