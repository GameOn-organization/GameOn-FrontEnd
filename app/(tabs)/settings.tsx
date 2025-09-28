import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { IconButton, Switch } from 'react-native-paper';

type RootDrawerParamList = {
  Profile: undefined;
  Settings: undefined;
};

type SettingsScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList, 'Settings'>;

export default function SettingsScreen() {
    const navigation = useNavigation<SettingsScreenNavigationProp>();
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>('Português'); //exemplicação

    const toggleNotifications = () => setNotificationsEnabled(previousState => !previousState);
    const toggleDarkMode = () => setDarkModeEnabled(previousState => !previousState);

    const handleLogout = () => {
        Alert.alert(
            "Sair",
            "Tem certeza que deseja sair?",
            [
                { text: "Cancelar", style: "cancel" },
                { text: "Sair", onPress: () => console.log("Usuário saiu") } //falta implementar a lógica de logout
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => navigation.goBack()} //volta para a tela anterior ou fecha o drawer
                />
                <Text style={styles.headerTitle}>Configurações</Text>
            </View>

            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Notificações</Text>
                <Switch value={notificationsEnabled} onValueChange={toggleNotifications} /> //teste
            </View> 

            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Tema Escuro</Text>
                <Switch value={darkModeEnabled} onValueChange={toggleDarkMode} /> //teste para mudar para o modo escuro
            </View>

            <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert("Idioma", "Funcionalidade de seleção de idioma.")}>
                <Text style={styles.settingText}>Idioma</Text>
                <Text style={styles.settingValue}>{language}</Text>
            </TouchableOpacity> //teste para mudar o idioma

            <TouchableOpacity style={styles.settingItem} onPress={() => Alert.alert("Ajuda", "Redirecionar para a tela de ajuda/FAQ.")}>
                <Text style={styles.settingText}>Ajuda</Text>
                <IconButton icon="chevron-right" size={20} />
            </TouchableOpacity> //teste para redirecionar para a tela de ajuda/FAQ

            <TouchableOpacity style={[styles.settingItem, styles.logoutButton]} onPress={handleLogout}>
                <Text style={[styles.settingText, styles.logoutText]}>Sair</Text>
            </TouchableOpacity> //teste para implementar a lógica de logout
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        paddingTop: 50, // Para evitar a barra de status em iOS
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingBottom: 15,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    settingText: {
        fontSize: 16,
        color: '#333',
    },
    settingValue: {
        fontSize: 16,
        color: '#666',
    },
    logoutButton: {
        justifyContent: 'center',
        backgroundColor: '#ff4d4d',
        marginTop: 20,
    },
    logoutText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
