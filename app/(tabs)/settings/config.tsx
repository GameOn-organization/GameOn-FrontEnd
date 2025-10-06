import { IconButton, Icon } from "react-native-paper";
import React, { useState } from 'react'
import {
    Alert,
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    ScrollView,
    Dimensions,
    Modal,
    Pressable,
    TouchableOpacity,
    TextInput
} from 'react-native'
import { useRouter } from 'expo-router'
import MaskInput, { Masks } from "react-native-mask-input";


export default function SettingsScreen() {

    const router = useRouter()

    const [emailVisible, setEmailVisible]               = useState(false)
    const [emailTransparent, setEmailTransparent]       = useState(false)
    const [email, setEmail]                             = useState('')
    const [confirmEmail, setConfirmEmail]               = useState('')
    
    const [phoneVisible, setPhoneVisible]               = useState(false)
    const [phoneTransparent, setPhoneTransparent]       = useState(false)
    const [phone, setPhone]                             = useState('')
    
    const [passwordVisible, setPasswordVisible]         = useState(false)
    const [passwordTransparent, setPasswordTransparent] = useState(false)
    const [password, setPassword]                       = useState('')
    const [confirmPassword, setConfirmPassword]         = useState('')
    const [viewPsw, setViewPsw] = useState(false);
    const [viewConPsw, setViewConPsw] = useState(false);
    
    const validateChange = () => {
        if (email === confirmEmail) {
            Alert.alert('Sucesso!', 'Alteração Realizada com Sucesso!');
            setEmail('')
            setConfirmEmail('')
            setEmailVisible(!emailVisible)
            setEmailTransparent(!emailTransparent)
        } else {
            Alert.alert('Erro!', 'Email Não Confere!');
        }
    }

    const validatePassword = () => {
        if (password === confirmPassword) {
            Alert.alert('Sucesso!', 'Alteração Realizada com Sucesso!');
            setPassword('')
            setConfirmPassword('')
            setPasswordVisible(!passwordVisible)
            setPasswordTransparent(!passwordTransparent)
        } else {
            Alert.alert('Erro!', 'Senhas Não Conferem!');
        }
    }

    return (
        <>
            {/* Formulário de Alteração de Email*/}
            <Modal
                backdropColor='rgba(0,0,0,0.5)'
                animationType="fade"
                transparent={emailTransparent}
                visible={emailVisible}
                onRequestClose={() => {
                    setEmailVisible(!emailVisible),
                    setEmailTransparent(!emailTransparent);
                }}
            >
                <Pressable
                    style={{flex: 0.1, height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                    onPress={() => {
                        setEmailVisible(!emailVisible),
                        setEmailTransparent(!emailTransparent);
                    }}
                />
                <Text>Alterar Email</Text>
                <Text>E-mail Atual</Text>
                <Text>dummy@dominio.com</Text>
                <Text>Novo E-mail</Text>
                <TextInput
                    autoComplete="email"
                    keyboardType="email-address"
                    style={styles.input}
                    onChangeText={setEmail}
                    value={email}
                    />
                <Text>Confirmar Novo E-mail</Text>
                <TextInput
                    autoComplete="email"
                    keyboardType="email-address"
                    style={styles.input}
                    onChangeText={setConfirmEmail}
                    value={confirmEmail}
                />
                <TouchableOpacity
                    style={styles.buttonSend}
                    onPress={validateChange}
                >
                    <Text>Confirmar</Text>
                </TouchableOpacity>
            </Modal>

            {/* Formulário de Alteração de Telefone*/}
            <Modal
                backdropColor='rgba(0,0,0,0.5)'
                animationType="fade"
                transparent={phoneTransparent}
                visible={phoneVisible}
                onRequestClose={() => {
                    setPhoneVisible(!phoneVisible)
                    setPhoneTransparent(!phoneTransparent)
                }}
            >
                <Pressable
                    style={{flex: 0.1, height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                    onPress={() => {
                        setPhoneVisible(!phoneVisible)
                        setPhoneTransparent(!phoneTransparent)
                    }}
                />
                <Text>Alterar Telefone</Text>
                <Text>Telefone Atual</Text>
                <Text>+55 (11) 99999-9999</Text>
                <Text>Novo Telefone</Text>
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
                <TouchableOpacity
                    style={styles.buttonSend}
                    onPress={() => {
                        setPhoneVisible(!phoneVisible)
                        setPhoneTransparent(!phoneTransparent)
                    }}
                >
                    <Text>Confirmar</Text>
                </TouchableOpacity>
            </Modal>

            {/* Formulário de Alteração de Senha*/}
            <Modal
                backdropColor='rgba(0,0,0,0.5)'
                animationType="fade"
                transparent={passwordTransparent}
                visible={passwordVisible}
                onRequestClose={() => {
                    setPasswordVisible(!passwordVisible),
                    setPasswordTransparent(!passwordTransparent);
                }}
            >
                <Pressable
                    style={{flex: 0.1, height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                    onPress={() => {
                        setPasswordVisible(!passwordVisible),
                        setPasswordTransparent(!passwordTransparent);
                    }}
                />
                <Text>Alterar Senha</Text>
                <Text>Nova Senha</Text>
                <TextInput
                    placeholder="Senha"
                    autoCapitalize="none"
                    minLength={8}
                    autoComplete="password"
                    autoCorrect={false}
                    secureTextEntry={!viewPsw}
                    onChangeText={(value) => setPassword(value)}
                    style={styles.input}
                    placeholderTextColor="gray"
                />
                <IconButton
                    icon={viewPsw ? "eye" : "eye-off"}
                    size={20}
                    iconColor="black"
                    onPress={() => setViewPsw(!viewPsw)}
                />
                <Text>Confirmar Senha</Text>
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
                <TouchableOpacity
                    style={styles.buttonSend}
                    onPress={validatePassword}
                >
                    <Text>Confirmar</Text>
                </TouchableOpacity>
            </Modal>

            <SafeAreaView
                style={styles.container}
            >

                <ScrollView
                    style={styles.scroll}
                    contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }}
                >
                    <Text>Conta</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setEmailTransparent(!emailTransparent)
                            setEmailVisible(!emailVisible)
                        }}
                    >
                        <Text>Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setPhoneVisible(!phoneVisible)
                            setPhoneTransparent(!phoneTransparent)
                        }}
                    >
                        <Text>Telefone</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            setPasswordVisible(!passwordVisible)
                            setPasswordTransparent(!passwordTransparent)
                        }}
                    >
                        <Text>Senha</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: "50%",
        marginLeft: width * 0.025,
        maxHeight: height * 0.3,
        maxWidth: width * 0.95,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
    },
    scroll: { width: '100%' },
    container: {
        flex: 1,
        marginTop: "50%",
        marginLeft: width * 0.025,
        maxHeight: height * 0.3,
        maxWidth: width * 0.95,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 25,
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 30,
        marginBottom: 10,
        gap: 20,
    },
    postContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        marginBottom: 20,
    },
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        marginTop: 10,
    },
    input: {
        borderColor: 'gray',
        borderWidth: 1,
        padding: 10,
        width: width * 0.8,
        height: 100,
        borderRadius: 10,
    },
    buttonSend: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
        backgroundColor: '#DDDDDD',
        borderRadius: 25,
        paddingLeft: 15,
    },
});
