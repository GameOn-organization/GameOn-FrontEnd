import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
} from "react-native";
import { IconButton } from "react-native-paper";
import Formulario from "../../components/Formulario";
import MenuProfile from "../../components/MenuProfile";
import { Switch } from "../../components/Switch";

export default function Profile() {
    const router = useRouter();

    const [modalTransparent, setModalTransparent] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("posts");
    
    // Estado para controlar o estilo do statusbar
    const [statusBarStyle, setStatusBarStyle] = useState("light");

    // Função para lidar com o scroll
    const handleScroll = (event) => {
        const scrollY = event.nativeEvent.contentOffset.y;
        
        // Se o scroll passou da seção preta (200px), muda para dark
        if (scrollY > 150) {
            setStatusBarStyle("dark");
        } else {
            setStatusBarStyle("light");
        }
    };

    // Dados de exemplo para demonstrar o scroll
    const examplePosts = Array.from({ length: 30 }, (_, i) => ({
        id: i + 1,
        title: `Post ${i + 1}`,
        content: `Este é o conteúdo do post ${i + 1}.`,
    }));

    const userInfo = [
        "Email: usuario@exemplo.com",
        "Telefone: (11) 99999-9999",
        "Localização: São Paulo - SP - Brasil",
        "Data de nascimento: 01/01/1990",
        "Disponibilidade: Imediata",
        "Idiomas: Português, Inglês, Espanhol",
    ];

    return (
        <SafeAreaView style={styles.container}>
            {/* StatusBar com estilo dinâmico */}
            <StatusBar style={statusBarStyle} />
            
            {/* Formulário de Editar Perfil - Trocar por Drawer*/}
            <Modal
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
                    style={{ backgroundColor: "#667eea" }}
                    onPress={() => {
                        setEditVisible(!editVisible),
                            setModalTransparent(!modalTransparent);
                    }}
                />
                <Formulario />
            </Modal>

            {/* Modal de Configurações - Trocar por Drawer */}
            <Modal
                animationType="slide"
                transparent={modalTransparent}
                visible={settingsVisible}
                onRequestClose={() => {
                    setSettingsVisible(!settingsVisible),
                        setModalTransparent(!modalTransparent);
                }}
            >
                <SafeAreaView
                    style={{
                        flexDirection: "column",
                        alignItems: "flex-start",
                        justifyContent: "center",
                    }}
                >
                    <IconButton
                        icon="arrow-left"
                        size={24}
                        iconColor="black"
                        onPress={() => {
                            setSettingsVisible(!settingsVisible),
                                setModalTransparent(!modalTransparent);
                        }}
                    />
                    <MenuProfile />
                </SafeAreaView>
            </Modal>

            {/* ScrollView Principal */}
            <ScrollView
                style={styles.scrollSafeAreaView}
                contentContainerStyle={styles.scrollContent}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {/* Top Section - Seção Superior */}
                <SafeAreaView style={styles.topSection}>
                    <SafeAreaView style={styles.topHeader}>
                        <TouchableOpacity
                            onPress={() => {
                                setSettingsVisible(true),
                                    setModalTransparent(false);
                            }}
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

                {/* Profile Image - Posicionada de forma absoluta sobre o ScrollView */}
                <SafeAreaView style={styles.imageContainer}>
                    <Image
                        source={require("../../assets/images/icon.jpeg")}
                        style={styles.image}
                    />
                </SafeAreaView>

                {/* Profile Section - Seção do Perfil */}
                <SafeAreaView style={styles.profileSection}>
                    <SafeAreaView style={styles.actionRow}>
                        <IconButton
                            icon="plus"
                            size={30}
                            color="black"
                            onPress={() => console.log("Add pressed")}
                        />
                        <IconButton
                            icon="pencil-outline"
                            size={30}
                            color="black"
                            onPress={() => {
                                setEditVisible(true),
                                    setModalTransparent(false);
                            }}
                        />
                    </SafeAreaView>

                    <Text style={styles.userName}>Nome do Usuário</Text>
                    <Text style={styles.description}>Descrição do perfil</Text>

                    <Switch activeTab={activeTab} onChangeTab={setActiveTab} />
                </SafeAreaView>

                {/* Content Section - AQUI É ONDE O SCROLL SERÁ DETERMINADO */}
                <SafeAreaView style={styles.contentSection}>
                    {activeTab === "posts" ? (
                        <SafeAreaView>
                            {examplePosts.map((post) => (
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
                                    <Text style={styles.postDate}>
                                        {new Date().toLocaleDateString("pt-BR")}
                                    </Text>
                                </SafeAreaView>
                            ))}
                        </SafeAreaView>
                    ) : (
                        <SafeAreaView>
                            {userInfo.map((info, index) => (
                                <SafeAreaView
                                    key={index}
                                    style={styles.infoItem}
                                >
                                    <Text style={styles.infoText}>{info}</Text>
                                </SafeAreaView>
                            ))}
                        </SafeAreaView>
                    )}
                </SafeAreaView>
            </ScrollView>
        </SafeAreaView>
    );
}

// Seus estilos permanecem os mesmos...
const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollSafeAreaView: {
        flex: 1,
        backgroundColor: "#fff",
    },
    scrollContent: {
        alignItems: 'center',
        paddingBottom: 100,
    },
    topSection: {
        height: 200,
        backgroundColor: "#000",
        width: width,
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
        width: width,
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
        textAlign: "center",
        marginBottom: 10,
        color: "#333",
    },
    description: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 30,
    },
    contentSection: {
        backgroundColor: "#fff",
        width: width,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    postItem: {
        backgroundColor: "#f9f9f9",
        padding: 20,
        marginBottom: 15,
        borderRadius: 12,
        borderLeftWidth: 4,
        borderLeftColor: "#667eea",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 8,
        color: "#333",
    },
    postContent: {
        fontSize: 14,
        color: "#666",
        lineHeight: 22,
        marginBottom: 8,
    },
    postDate: {
        fontSize: 12,
        color: "#999",
        textAlign: "right",
    },
    infoItem: {
        backgroundColor: "#f9f9f9",
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderLeftWidth: 3,
        borderLeftColor: "#667eea",
    },
    infoText: {
        fontSize: 16,
        color: "#333",
    },
    imageContainer: {
        marginTop: -75,
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: "hidden",
        backgroundColor: "#fff",
        borderWidth: 5,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: "100%",
        borderRadius: 75,
    },
    button: {
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 15,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
        marginLeft: 10,
    },
});