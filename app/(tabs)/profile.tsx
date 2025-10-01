import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { IconButton } from "react-native-paper";

import { CustomSwitch } from "@/components/CustomSwitch";
import Formulario from "@/components/Formulario";

import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();

const { width } = Dimensions.get("window");

type RootDrawerParamList = {
    Profile: undefined;
    // Outras rotas do seu Drawer, se houver
};

type SettingsScreenNavigationProp = DrawerNavigationProp<RootDrawerParamList>;

/* ------------------ Tela de Perfil ------------------ */
function ProfileScreen({ navigation }: any) {
    const router = useRouter();

    const [modalTransparent, setModalTransparent] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("posts");
    const [statusBarStyle, setStatusBarStyle] = useState<"light" | "dark">(
        "light"
    );

    const handleScroll = (event: any) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        setStatusBarStyle(scrollY > 150 ? "dark" : "light");
    };

    const examplePosts = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        title: `Post ${i + 1}`,
        content: `Este é o conteúdo do post ${i + 1}.`,
    }));

    const userInfo = [
        "Email: usuario@exemplo.com",
        "Telefone: (11) 99999-9999",
        "Localização: São Paulo - SP",
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style={statusBarStyle} />

            {/* Modal editar perfil */}
            <Modal
                animationType="slide"
                transparent={modalTransparent}
                visible={editVisible}
                onRequestClose={() => {
                    setEditVisible(false);
                    setModalTransparent(false);
                }}
            >
                <IconButton
                    icon="arrow-left"
                    size={24}
                    iconColor="white"
                    style={{ backgroundColor: "#667eea" }}
                    onPress={() => {
                        setEditVisible(false);
                        setModalTransparent(false);
                    }}
                />
                <Formulario />
            </Modal>

            {/* ScrollView principal */}
            <ScrollView
                style={styles.scrollSafeAreaView}
                contentContainerStyle={styles.scrollContent}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {/* Header com botão Drawer */}
                <SafeAreaView style={styles.topSection}>
                    <SafeAreaView style={styles.topHeader}>
                        <TouchableOpacity
                            onPress={() => navigation.openDrawer()}
                        >
                            <IconButton
                                icon="dots-vertical-circle-outline"
                                size={30}
                                iconColor="white"
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => router.navigate("/")}>
                            <IconButton
                                icon="logout"
                                size={24}
                                iconColor="white"
                            />
                        </TouchableOpacity>
                    </SafeAreaView>
                </SafeAreaView>

                {/* Imagem de perfil */}
                <SafeAreaView style={styles.imageContainer}>
                    <Image
                        source={require("@/assets/images/icon.jpeg")}
                        style={styles.image}
                    />
                </SafeAreaView>

                {/* Seção do usuário */}
                <SafeAreaView style={styles.profileSection}>
                    <SafeAreaView style={styles.actionRow}>
                        <IconButton
                            icon="plus"
                            size={30}
                            color="black"
                            onPress={() => Alert.alert("Adicionar algo")}
                        />
                        <IconButton
                            icon="pencil-outline"
                            size={30}
                            color="black"
                            onPress={() => {
                                setEditVisible(true);
                                setModalTransparent(false);
                            }}
                        />
                    </SafeAreaView>

                    <Text style={styles.userName}>Nome do Usuário</Text>
                    <Text style={styles.description}>Descrição do perfil</Text>

                    <CustomSwitch
                        activeTab={activeTab}
                        onChangeTab={setActiveTab}
                    />
                </SafeAreaView>

                {/* Conteúdo */}
                <SafeAreaView style={styles.contentSection}>
                    {activeTab === "posts"
                        ? examplePosts.map((post) => (
                              <SafeAreaView
                                  key={post.id}
                                  style={styles.postItem}
                              >
                                  <Text style={styles.postTitle}>
                                      {post.title}
                                  </Text>
                                  <Text style={styles.postContent}>
                                      {post.content}
                                  </Text>
                              </SafeAreaView>
                          ))
                        : userInfo.map((info, i) => (
                              <SafeAreaView key={i} style={styles.infoItem}>
                                  <Text style={styles.infoText}>{info}</Text>
                              </SafeAreaView>
                          ))}
                </SafeAreaView>
            </ScrollView>
        </SafeAreaView>
    );
}

/* ------------------ Tela de Configurações ------------------ */
function SettingsScreen() {
    const navigation = useNavigation<SettingsScreenNavigationProp>();
    const [notificationsEnabled, setNotificationsEnabled] =
        useState<boolean>(true);
    const [darkModeEnabled, setDarkModeEnabled] = useState<boolean>(false);
    const [language, setLanguage] = useState<string>("Português"); // Exemplo simples

    const toggleNotifications = () =>
        setNotificationsEnabled((previousState) => !previousState);
    const toggleDarkMode = () =>
        setDarkModeEnabled((previousState) => !previousState);

    const handleLogout = () => {
        Alert.alert("Sair", "Tem certeza que deseja sair?", [
            { text: "Cancelar", style: "cancel" },
            { text: "Sair", onPress: () => console.log("Usuário saiu") }, // Implementar lógica de logout real aqui
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <IconButton
                    icon="arrow-left"
                    size={24}
                    onPress={() => navigation.goBack()} // Fecha o drawer
                />
                <Text style={styles.headerTitle}>Configurações</Text>
            </View>

            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Notificações</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={toggleNotifications}
                />
            </View>

            <View style={styles.settingItem}>
                <Text style={styles.settingText}>Tema Escuro</Text>
                <Switch
                    value={darkModeEnabled}
                    onValueChange={toggleDarkMode}
                />
            </View>

            <TouchableOpacity
                style={styles.settingItem}
                onPress={() =>
                    Alert.alert(
                        "Idioma",
                        "Funcionalidade de seleção de idioma."
                    )
                }
            >
                <Text style={styles.settingText}>Idioma</Text>
                <Text style={styles.settingValue}>{language}</Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.settingItem}
                onPress={() =>
                    Alert.alert(
                        "Ajuda",
                        "Redirecionar para a tela de ajuda/FAQ."
                    )
                }
            >
                <Text style={styles.settingText}>Ajuda</Text>
                <IconButton icon="chevron-right" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.settingItem, styles.logoutButton]}
                onPress={handleLogout}
            >
                <Text style={[styles.settingText, styles.logoutText]}>
                    Sair
                </Text>
            </TouchableOpacity>
        </View>
    );
}

/* ------------------ Drawer direto ------------------ */
export default function Profile() {
    return (
        <Drawer.Navigator
            initialRouteName="ProfileScreen"
            screenOptions={{ headerShown: false, drawerPosition: "left" }}
        >
            <Drawer.Screen
                name="ProfileScreen"
                component={ProfileScreen}
                options={{ title: "Meu Perfil" }}
            />
            <Drawer.Screen
                name="Settings"
                component={SettingsScreen}
                options={{ title: "Configurações" }}
            />
        </Drawer.Navigator>
    );
}

/* ------------------ Estilos ------------------ */
const styles = StyleSheet.create({
    scrollSafeAreaView: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContent: { 
        alignItems: "center", 
        paddingBottom: 100 
    },
    topSection: { 
        height: 200, 
        backgroundColor: "#000", 
        width 
    },
    topHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 20,
        paddingTop: 50,
    },
    profileSection: {
        backgroundColor: "#fff",
        width,
        alignItems: "center",
    },
    actionRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    userName: { 
        fontSize: 24, 
        fontWeight: "bold", 
        marginBottom: 10 
    },
    description: { 
        fontSize: 16, 
        color: "#666", 
        marginBottom: 30 
    },
    contentSection: { 
        width, 
        padding: 20 
    },
    postItem: {
        backgroundColor: "#f9f9f9",
        padding: 20,
        marginBottom: 15,
        borderRadius: 12,
    },
    postTitle: { 
        fontSize: 18, 
        fontWeight: "bold" 
    },
    postContent: { 
        fontSize: 14, 
        color: "#666", 
        marginTop: 5 
    },
    infoItem: {
        backgroundColor: "#f9f9f9",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
    },
    infoText: { 
        fontSize: 16, 
        color: "#333" 
    },
    imageContainer: {
        marginTop: -75,
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: "hidden",
        borderWidth: 5,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    image: { 
        width: "100%", 
        height: "100%", 
        borderRadius: 75 
    },
    center: { 
        flex: 1, 
        justifyContent: "center", 
        alignItems: "center" 
    },
    container: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        paddingTop: 50, // Para evitar a barra de status em iOS
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        paddingBottom: 15,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e0e0e0",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginLeft: 10,
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#eee",
    },
    settingText: {
        fontSize: 16,
        color: "#333",
    },
    settingValue: {
        fontSize: 16,
        color: "#666",
    },
    logoutButton: {
        justifyContent: "center",
        backgroundColor: "#ff4d4d",
        marginTop: 20,
    },
    logoutText: {
        color: "#fff",
        fontWeight: "bold",
    },
});
