import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    Image,
    Modal,
    PanResponder,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Pressable,
} from "react-native";
import { IconButton } from "react-native-paper";
import Formulario from "../../components/Formulario";
import Post from "../../components/Post";
import MenuProfile from "../../components/MenuProfile";
import { Switch } from "../../components/Switch";

const { width, height } = Dimensions.get("window");
const DRAWER_WIDTH = width * 0.8;

export default function Profile() {
    const router = useRouter();

    const [modalTransparent, setModalTransparent] = useState(false);
    const [editVisible, setEditVisible] = useState(false);
    const [postTransparent, setPostTransparent] = useState(false);
    const [postVisible, setPostVisible] = useState(false);
    const [activeTab, setActiveTab] = useState("posts");
    
    // Estado para controlar o estilo do statusbar
    const [statusBarStyle, setStatusBarStyle] = useState("light");

    // Estados para o Drawer
    const [drawerVisible, setDrawerVisible] = useState(false);
    const drawerTranslateX = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
    const overlayOpacity = useRef(new Animated.Value(0)).current;

    // Função para abrir o drawer
    const openDrawer = () => {
        setDrawerVisible(true);
        Animated.parallel([
            Animated.timing(drawerTranslateX, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start();
    };

    // Função para fechar o drawer
    const closeDrawer = () => {
        Animated.parallel([
            Animated.timing(drawerTranslateX, {
                toValue: -DRAWER_WIDTH,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.timing(overlayOpacity, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => {
            setDrawerVisible(false);
        });
    };

    // PanResponder para gestos de arrastar
    const panResponder = PanResponder.create({
        onMoveShouldSetPanResponder: (evt, gestureState) => {
            return Math.abs(gestureState.dx) > Math.abs(gestureState.dy) && Math.abs(gestureState.dx) > 20;
        },
        onPanResponderMove: (evt, gestureState) => {
            if (gestureState.dx < 0) {
                const newTranslateX = Math.max(-DRAWER_WIDTH, gestureState.dx);
                drawerTranslateX.setValue(newTranslateX);
                overlayOpacity.setValue(1 + (newTranslateX / DRAWER_WIDTH));
            }
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dx < -DRAWER_WIDTH / 3) {
                closeDrawer();
            } else {
                openDrawer();
            }
        },
    });

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
            
            {/* Formulário de Editar Perfil*/}
            <Modal
                backdropColor='#667eea'
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
            
            {/* Formulário de Publicar Post*/}
            <Modal
                backdropColor='rgba(0,0,0,0.5)'
                animationType="fade"
                transparent={postTransparent}
                visible={postVisible}
                onRequestClose={() => {
                    setPostVisible(!postVisible),
                    setPostTransparent(!postTransparent);
                }}
            >
                <Pressable
                    style={{flex: 0.1, height: '100%', position: 'absolute', top: 0, left: 0, right: 0, bottom: 0}}
                    onPress={() => {
                        setPostVisible(!postVisible),
                        setPostTransparent(!postTransparent);
                    }}
                />
                <Post />
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
                        <TouchableOpacity onPress={openDrawer}>
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
                            onPress={() => {
                                setPostVisible(true),
                                setPostTransparent(false);
                            }}
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

            {/* Drawer Implementation */}
            {drawerVisible && (
                <>
                    {/* Overlay */}
                    <Animated.View
                        style={[
                            styles.overlay,
                            {
                                opacity: overlayOpacity,
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={styles.overlayTouchable}
                            onPress={closeDrawer}
                            activeOpacity={1}
                        />
                    </Animated.View>

                    {/* Drawer */}
                    <Animated.View
                        style={[
                            styles.drawer,
                            {
                                transform: [{ translateX: drawerTranslateX }],
                            }
                        ]}
                        {...panResponder.panHandlers}
                    >
                        <SafeAreaView style={styles.drawerContent}>
                            <View style={styles.drawerHeader}>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        gap: 10,
                                    }}
                                >
                                    <Image
                                        source={require("../../assets/images/icon.jpeg")}
                                        style={[styles.image, styles.imageIcon]}
                                    />
                                    <View>
                                        <Text
                                            style={{fontWeight: 'bold'}}
                                        >Nome do Usuário</Text>
                                        <Text
                                            style={{fontStyle: 'italic'}}
                                        >email@dominio.com</Text>
                                    </View>
                                </View>
                                <IconButton
                                    icon="arrow-left"
                                    size={24}
                                    iconColor="black"
                                    onPress={closeDrawer}
                                />
                            </View>
                            <MenuProfile closeDrawer={closeDrawer} />
                        </SafeAreaView>
                    </Animated.View>
                </>
            )}
        </SafeAreaView>
    );
}

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
    imageIcon: {
        width: 50,
        height: 50,
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
    // Estilos do Drawer
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 998,
    },
    overlayTouchable: {
        flex: 1,
    },
    drawer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        width: DRAWER_WIDTH,
        backgroundColor: '#fff',
        zIndex: 999,
        elevation: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 0,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
    drawerContent: {
        flex: 1,
        flexDirection: 'column',
    },
    drawerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        paddingTop: '40',
        paddingHorizontal: 10,
    },
});