import React from 'react';
import {
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    ScrollView,
    TouchableOpacity,
    Switch,
} from 'react-native';
import { Icon } from 'react-native-paper';

export default function PrivacyScreen() {
    const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
    const [locationServicesEnabled, setLocationServicesEnabled] = React.useState(true);

    const privacyOptions = [
        { title: 'Gerenciar Dados Pessoais', icon: 'shield-account' },
        { title: 'Termos de Serviço', icon: 'file-document-outline' },
        { title: 'Política de Privacidade', icon: 'shield-lock-outline' },
    ];

    const securityOptions = [
        { title: 'Alterar Senha', icon: 'lock-reset' },
        { title: 'Autenticação de Dois Fatores', icon: 'two-factor-authentication' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                <Text style={styles.sectionTitle}>Configurações de Privacidade</Text>

                <View style={styles.card}>
                    <View style={styles.settingRow}>
                        <Icon source="bell-outline" size={24} color="#333" />
                        <Text style={styles.settingText}>Permitir Notificações</Text>
                        <Switch
                            onValueChange={setNotificationsEnabled}
                            value={notificationsEnabled}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
                        />
                    </View>

                    <View style={styles.settingRow}>
                        <Icon source="map-marker-outline" size={24} color="#333" />
                        <Text style={styles.settingText}>Serviços de Localização</Text>
                        <Switch
                            onValueChange={setLocationServicesEnabled}
                            value={locationServicesEnabled}
                            trackColor={{ false: "#767577", true: "#81b0ff" }}
                            thumbColor={locationServicesEnabled ? "#f5dd4b" : "#f4f3f4"}
                        />
                    </View>
                </View>

                <View style={styles.card}>
                    {privacyOptions.map((option, index) => (
                        <TouchableOpacity key={index} style={styles.settingItem}>
                            <Icon source={option.icon} size={24} color="#333" />
                            <Text style={styles.settingItemText}>{option.title}</Text>
                            <Icon source="chevron-right" size={24} color="#ccc" />
                        </TouchableOpacity>
                    ))}
                </View>

                <Text style={styles.sectionTitle}>Segurança da Conta</Text>

                <View style={styles.card}>
                    {securityOptions.map((option, index) => (
                        <TouchableOpacity key={index} style={styles.settingItem}>
                            <Icon source={option.icon} size={24} color="#333" />
                            <Text style={styles.settingItemText}>{option.title}</Text>
                            <Icon source="chevron-right" size={24} color="#ccc" />
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    scroll: {
        width: '100%',
    },
    scrollContent: {
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        marginLeft: 5,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 20,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
        flex: 1,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    settingItemText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
        flex: 1,
    },
});