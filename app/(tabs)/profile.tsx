import { Icon, IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { Drawer } from "expo-router/drawer";
import Formulario from "../../components/Formulario";
import MenuProfile from "../../components/MenuProfile";
import { Switch } from "../../components/Switch";

export default function Profile() {
    const router = useRouter();

    const [modalTransparent, setModalTransparent] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [settingsVisible, setSettingsVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<"posts" | "info">("posts");

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
                                <SafeAreaView key={post.id} style={styles.postItem}>
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
                                <SafeAreaView key={index} style={styles.infoItem}>
                                    <Text style={styles.infoText}>{info}</Text>
                                </SafeAreaView>
                            ))}
                        </SafeAreaView>
                    )}
                </SafeAreaView>

                {/* Footer para garantir espaço extra */}
                <SafeAreaView style={styles.footer}>
                    <Text style={styles.footerText}>Fim do conteúdo</Text>
                </SafeAreaView>
            </ScrollView>

            {/* Profile Image - Posicionada de forma absoluta sobre o ScrollView */}
            <SafeAreaView style={styles.imageContainer}>
                <Image
                    source={require("../../assets/images/icon.jpeg")}
                    style={styles.image}
                />
            </SafeAreaView>
        </SafeAreaView>
    );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollSafeAreaView: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    scrollContent: {
        // CHAVE: Sem minHeight ou flexGrow - deixa o conteúdo determinar
        paddingBottom: 100, // Espaço extra no final para garantir scroll
    },
    topSection: {
        height: 200, // Altura fixa
        backgroundColor: "#000",
        width: width,
    },
    topHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: 20,
        paddingTop: 50, // Espaço para status bar
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
        // IMPORTANTE: Sem altura fixa - deixa o conteúdo crescer
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
    footer: {
        backgroundColor: "#f5f5f5",
        padding: 30,
        alignItems: "center",
    },
    footerText: {
        fontSize: 14,
        color: "#999",
        fontStyle: "italic",
    },
    imageContainer: {
        position: "absolute",
        top: 120, // Posição fixa no topo
        left: width * 0.5 - 75, // Centraliza horizontalmente
        width: 150,
        height: 150,
        borderRadius: 75,
        overflow: "hidden",
        backgroundColor: "#fff",
        borderWidth: 5,
        borderColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Z-index muito alto
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
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
