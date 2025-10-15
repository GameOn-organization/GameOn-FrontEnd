import React from 'react';
import {
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-paper';

export default function PremiumScreen() {

    const features = [
        { icon: 'star-circle', text: 'Acesso a jogos exclusivos e antecipados' },
        { icon: 'shield-off', text: 'Experiência sem anúncios' },
        { icon: 'headset', text: 'Suporte prioritário 24/7' },
        { icon: 'account-edit', text: 'Personalização avançada do perfil' },
        { icon: 'gift', text: 'Bônus e recompensas diárias' },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Icon source="rocket-launch" size={50} color="#6200ee" />
                    <Text style={styles.headerTitle}>Seja Premium!</Text>
                    <Text style={styles.headerSubtitle}>Desbloqueie todo o potencial do GameOn</Text>
                </View>

                <View style={styles.featureList}>
                    {features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <Icon source={feature.icon} size={24} color="#6200ee" />
                            <Text style={styles.featureText}>{feature.text}</Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.upgradeButton} onPress={() => alert('Funcionalidade de upgrade em breve!')}>
                    <Text style={styles.upgradeButtonText}>Assinar Agora</Text>
                </TouchableOpacity>
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
        alignItems: 'center',
        paddingVertical: 20,
        paddingHorizontal: 15,
    },
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 10,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    featureList: {
        width: '100%',
        marginBottom: 30,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    featureText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 15,
    },
    upgradeButton: {
        backgroundColor: '#6200ee',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    upgradeButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});