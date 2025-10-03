import React, {useState} from "react";
import {
    SafeAreaView,
    Text,
    TouchableOpacity,
    StyleSheet,
    Switch,
} from "react-native";
import { Icon, IconButton, Badge } from "react-native-paper";
import { useRouter } from "expo-router";

export default function MenuProfile() {

    const router = useRouter()

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    return (
        <SafeAreaView
            style={styles.container}
        >
            <SafeAreaView
                style={[styles.container,
                    {height: '60%',
                    borderBottomWidth: 1,
                    borderBottomColor: '#f0f0f0',}]}
            >
                <TouchableOpacity
                    style={styles.button}
                >
                    <Icon
                        source='calendar'
                        size={20}
                        color='white'
                    />
                    <Text
                        style={styles.buttonText}
                        onPress={() => console.log("Eventos")}
                    >
                        Eventos
                    </Text>
                    <Badge
                        size={20} // Tamanho do badge
                        style={styles.badge}
                    >33</Badge>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                >
                    <Icon
                        source='medal-outline'
                        size={20}
                        color='white'
                    />
                    <Text
                        style={styles.buttonText}
                        onPress={() => console.log("Recompensas")}
                    >
                        Recompensas
                    </Text>
                    <Badge
                        size={20} // Tamanho do badge
                        style={styles.badge}
                    >33</Badge>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                >
                    <Icon
                        source='email-send-outline'
                        size={20}
                        color='white'
                    />
                    <Text
                        style={styles.buttonText}
                        onPress={() => console.log("Convide um Amigo")}
                    >
                        Convide um Amigo
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                >
                    <Icon
                        source='lock-outline'
                        size={20}
                        color='white'
                    />
                    <Text
                        style={styles.buttonText}
                        onPress={() => router.navigate("../../settings/privacy")}
                    >
                        Privacidade e Segurança
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                >
                    <Icon
                        source='lightning-bolt-outline'
                        size={20}
                        color='white'
                    />
                    <Text
                        style={styles.buttonText}
                        onPress={() => router.navigate("../../settings/premium")}
                    >
                        Assinatura
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                >
                    <Icon
                        source='tools'
                        size={20}
                        color='white'
                    />
                    <Text
                        style={styles.buttonText}
                        onPress={() => router.navigate("../../settings/config")}
                    >
                        Configurações
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                >
                    <Icon
                        source='handshake'
                        size={20}
                        color='white'
                    />
                    <Text
                        style={styles.buttonText}
                        onPress={() => console.log("Seja um Associado")}
                    >
                        Seja um Associado
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
            <SafeAreaView
                style={styles.optionsContainer}
            >
                <TouchableOpacity
                    style={[styles.options, {gap: 5}]}
                    onPress= {() => router.navigate('faqs/faqsScreen')}
                >
                    <Icon
                        source='help-circle-outline'
                        size={20}
                        color='black'
                    />
                    <Text>FAQ</Text>
                </TouchableOpacity>
                <SafeAreaView
                    style={styles.options}
                >
                    <Icon
                        source='white-balance-sunny'
                        size={20}
                        color='black'
                    />
                    <Switch
                        trackColor={{false: '#81b0ff', true: '#767577'}}
                        thumbColor={isEnabled ? '#f4f3f4' : '#f5dd4b'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                    <Icon
                        source='moon-waxing-crescent'
                        size={20}
                        color='black'
                    />
                </SafeAreaView>
            </SafeAreaView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: '5%',
        alignItems: 'center',
        gap: 20,
        flex: 1,
        width: '100%',
        height: '100%',
    },
    button: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 20,
        backgroundColor: 'black',
        borderRadius: 10,
        height: 50,
        width: '80%',
        gap: 10,
    },
    buttonText: {
        color: 'white',
    },
    badge: {
        marginLeft: 'auto',
        marginRight: '10',
        marginBottom: 15,
        backgroundColor: 'white',
        color: 'black',
        borderRadius: 5,
    },
    optionsContainer: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    options: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    }
})