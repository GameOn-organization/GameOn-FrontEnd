import React, { useState } from "react";
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    StyleSheet,
    Switch,
    View,
} from "react-native";
import { Icon, Badge } from "react-native-paper";
import { useRouter } from "expo-router";

export default function MenuProfile({ closeDrawer }: { closeDrawer: () => void }) {
    const router = useRouter();
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    const handleNavigation = (path: string) => {
        if (closeDrawer) {
            closeDrawer();
        }
        router.navigate(path);
    };

    const menuItems = [
        { icon: 'calendar', text: 'Eventos', badge: 33, onPress: () => handleNavigation("../../events") },
        { icon: 'lock-outline', text: 'Privacidade e Segurança', onPress: () => handleNavigation("../../settings/privacy") },
        { icon: 'lightning-bolt-outline', text: 'Assinatura', onPress: () => handleNavigation("../../settings/premium") },
        { icon: 'tools', text: 'Configurações', onPress: () => handleNavigation("../../settings/config") },
        { icon: 'handshake', text: 'Seja um Associado', onPress: () => console.log("Seja um Associado") },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.menuContainer}>
                {menuItems.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.button} onPress={item.onPress}>
                        <Icon source={item.icon} size={24} color='#333' />
                        <Text style={styles.buttonText}>{item.text}</Text>
                        {item.badge && <Badge style={styles.badge}>{item.badge}</Badge>}
                        <Icon source="chevron-right" size={24} color="#ccc" />
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.footerButton} onPress={() => handleNavigation('faqs/faqsScreen')}>
                    <Icon source='help-circle-outline' size={24} color='#333' />
                    <Text style={styles.footerButtonText}>FAQ</Text>
                </TouchableOpacity>

                <View style={styles.themeSwitcher}>
                    <Icon source='white-balance-sunny' size={24} color='#333' />
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Icon source='moon-waxing-crescent' size={24} color='#333' />
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 15,
    },
    menuContainer: {
        flex: 1,
        marginTop: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginBottom: 10,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    buttonText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: '#333',
    },
    badge: {
        marginRight: 10,
        backgroundColor: '#6200ee',
        color: 'white',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
    },
    footerButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerButtonText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#333',
    },
    themeSwitcher: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});