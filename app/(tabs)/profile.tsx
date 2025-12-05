import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useRef, useState, useEffect } from "react";
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
    ActivityIndicator,
    RefreshControl,
    Alert,
    ImageBackground,
} from "react-native";
import { IconButton } from "react-native-paper";
import Formulario from "../../components/Formulario";
import Post from "../../components/Post";
import PostComposer from "../../components/PostComposer";
import MenuProfile from "../../components/MenuProfile";
import { Switch } from "../../components/Switch";
import { getMyPosts, Post as PostType } from "../../services/postsService";
import { getMyProfile, updateMyProfile } from "../../services/authService";
import { getTagNames } from "../../utils/tagsMap";

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

    // Estados para posts
    const [posts, setPosts] = useState<PostType[]>([]);
    const [isLoadingPosts, setIsLoadingPosts] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Estados para perfil do usuário
    const [userProfile, setUserProfile] = useState<any>(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);

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

    // Função para buscar posts
    const fetchPosts = async () => {
        setIsLoadingPosts(true);
        try {
            const userPosts = await getMyPosts({
                orderBy: "createdAt",
                orderDirection: "desc"
                // limit: 50,
            });
            setPosts(userPosts);
        } catch (error: any) {
            console.error("Erro ao buscar posts:", error);
        } finally {
            setIsLoadingPosts(false);
        }
    };

    // Função para buscar perfil do usuário
    const fetchProfile = async () => {
        try {
            const profile = await getMyProfile();
            if (profile) {
                setUserProfile(profile);
            } else {
                console.warn("Perfil não encontrado");
            }
        } catch (error: any) {
            console.error("Erro ao buscar perfil:", error);
            // Não mostrar alerta, apenas logar o erro
            // O usuário pode não ter perfil ainda
        } finally {
            setIsLoadingProfile(false);
        }
    };

    // Função para atualizar posts (pull to refresh)
    const handleRefresh = async () => {
        setIsRefreshing(true);
        await Promise.all([fetchPosts(), fetchProfile()]);
        setIsRefreshing(false);
    };

    // Função chamada após criar um novo post
    const handlePostCreated = () => {
        fetchPosts();
    };

    // Função chamada após deletar um post
    const handlePostDeleted = (postId: string) => {
        setPosts(posts.filter(post => post.id !== postId));
    };

    // Função chamada após dar like em um post
    const handlePostLiked = (updatedPost: PostType) => {
        setPosts(posts.map(post => 
            post.id === updatedPost.id ? updatedPost : post
        ));
    };

    // Função para salvar edição do perfil
    const handleProfileEdit = async (formData: any) => {
        setIsSavingProfile(true);
        try {
            await updateMyProfile({
                name: formData.nome,
                age: formData.idade,
                descricao: formData.descricao,
                sexo: formData.sexo as 'm' | 'f' | 'nb' | undefined,
                localizacao: formData.localizacao,
                images: formData.images || [],
                wallpaper: formData.wallpaper || null,
                tags: [...(formData.selected1 || []), ...(formData.selected2 || [])]
            });
            
            // Atualizar perfil localmente
            await fetchProfile();
            
            // Fechar modal
            setEditVisible(false);
            setModalTransparent(false);
            
            Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
        } catch (error: any) {
            console.error("Erro ao atualizar perfil:", error);
            Alert.alert("Erro", error.message || "Erro ao atualizar perfil");
        } finally {
            setIsSavingProfile(false);
        }
    };

    // Buscar posts e perfil ao montar o componente
    useEffect(() => {
        fetchPosts();
        fetchProfile();
    }, []);

    // Função para formatar as informações do usuário
    const getUserInfo = () => {
        if (!userProfile) return [];
        
        const info = [];
        
        if (userProfile.email) {
            info.push(`Email: ${userProfile.email}`);
        }
        
        if (userProfile.phone) {
            info.push(`Telefone: ${userProfile.phone}`);
        }
        
        if (userProfile.localizacao) {
            info.push(`Localização: ${userProfile.localizacao}`);
        }
        
        if (userProfile.age) {
            info.push(`Idade: ${userProfile.age} anos`);
        }
        
        if (userProfile.sexo) {
            const sexoMap = {
                'm': 'Masculino',
                'f': 'Feminino',
                'nb': 'Não-binário'
            };
            info.push(`Gênero: ${sexoMap[userProfile.sexo] || userProfile.sexo}`);
        }
        
        if (userProfile.descricao) {
            info.push(`Sobre: ${userProfile.descricao}`);
        }
        
        if (userProfile.tags && userProfile.tags.length > 0) {
            const tagNames = getTagNames(userProfile.tags);
            info.push(`Interesses: ${tagNames.join(', ')}`);
        }
        
        return info;
    };

    const userInfo = getUserInfo();

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
                <Formulario 
                    styleProp={{backgroundColor: '#667eea'}}
                    colorProp={['#667eea', '#667eea']}
                    onSubmit={handleProfileEdit}
                    initialData={userProfile ? {
                        nome: userProfile.name,
                        idade: userProfile.age,
                        descricao: userProfile.descricao,
                        sexo: userProfile.sexo,
                        localizacao: userProfile.localizacao,
                        images: userProfile.images || [],
                        wallpaper: userProfile.wallpaper,
                        selected1: userProfile.tags ? userProfile.tags.slice(0, Math.ceil(userProfile.tags.length / 2)) : [],
                        selected2: userProfile.tags ? userProfile.tags.slice(Math.ceil(userProfile.tags.length / 2)) : []
                    } : undefined}
                />
                {isSavingProfile && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={styles.loadingOverlayText}>Salvando...</Text>
                    </View>
                )}
            </Modal>
            
            {/* Formulário de Publicar Post*/}
            <Modal
                animationType="fade"
                transparent={true}
                visible={postVisible}
                onRequestClose={() => {
                    setPostVisible(false);
                    setPostTransparent(false);
                }}
            >
                <Pressable
                    style={{flex: 1, backgroundColor: 'rgba(0,0,0,0.5)'}}
                    onPress={() => {
                        setPostVisible(false);
                        setPostTransparent(false);
                    }}
                />
                <View style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', pointerEvents: 'box-none'}}>
                    <PostComposer 
                        onPostCreated={handlePostCreated}
                        onClose={() => {
                            setPostVisible(false);
                            setPostTransparent(false);
                        }}
                    />
                </View>
            </Modal>

            {/* ScrollView Principal */}
            <ScrollView
                style={styles.scrollSafeAreaView}
                contentContainerStyle={styles.scrollContent}
                scrollEnabled={true}
                nestedScrollEnabled={true}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={["#667eea"]}
                        tintColor="#667eea"
                    />
                }
            >
                {/* Top Section - Seção Superior */}
                <ImageBackground
                    source={
                        { uri: userProfile.wallpaper }
                    }
                    style={styles.topSection}
                    resizeMode="cover"
                >
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
                </ImageBackground>


                {/* Profile Image - Posicionada de forma absoluta sobre o ScrollView */}
                <SafeAreaView style={styles.imageContainer}>
                    {isLoadingProfile ? (
                        <ActivityIndicator size="large" color="#667eea" />
                    ) : userProfile?.images && userProfile.images.length > 0 && userProfile.images[0] ? (
                        <Image
                            source={{ uri: userProfile.images[0] }}
                            style={styles.image}
                        />
                    ) : userProfile?.image ? (
                        <Image
                            source={{ uri: userProfile.image }}
                            style={styles.image}
                        />
                    ) : (
                        <Image
                            source={require("../../assets/images/icon.jpeg")}
                            style={styles.image}
                        />
                    )}
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

                    <Text style={styles.userName}>
                        {isLoadingProfile ? "Carregando..." : (userProfile?.name || "Nome do Usuário")}
                    </Text>
                    <Text style={styles.description}>
                        {isLoadingProfile ? "" : (userProfile?.descricao || "Descrição do perfil")}
                    </Text>

                    <Switch activeTab={activeTab} onChangeTab={setActiveTab} />
                </SafeAreaView>

                {/* Content Section - AQUI É ONDE O SCROLL SERÁ DETERMINADO */}
                <SafeAreaView style={styles.contentSection}>
                    {activeTab === "posts" ? (
                        <SafeAreaView style={{alignItems: 'center'}}>
                            {isLoadingPosts ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#667eea" />
                                    <Text style={styles.loadingText}>Carregando posts...</Text>
                                </View>
                            ) : posts.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <IconButton
                                        icon="post-outline"
                                        size={60}
                                        iconColor="#ccc"
                                    />
                                    <Text style={styles.emptyText}>
                                        Nenhum post ainda
                                    </Text>
                                    <Text style={styles.emptySubText}>
                                        Crie seu primeiro post clicando no botão +
                                    </Text>
                                </View>
                            ) : (
                                posts.map((post) => (
                                    <Post
                                        key={post.id}
                                        post={post}
                                        onPostDeleted={handlePostDeleted}
                                        onPostLiked={handlePostLiked}
                                    />
                                ))
                            )}
                        </SafeAreaView>
                    ) : (
                        <SafeAreaView>
                            {isLoadingProfile ? (
                                <View style={styles.loadingContainer}>
                                    <ActivityIndicator size="large" color="#667eea" />
                                    <Text style={styles.loadingText}>Carregando informações...</Text>
                                </View>
                            ) : userInfo.length === 0 ? (
                                <View style={styles.emptyContainer}>
                                    <IconButton
                                        icon="information-outline"
                                        size={60}
                                        iconColor="#ccc"
                                    />
                                    <Text style={styles.emptyText}>
                                        Nenhuma informação disponível
                                    </Text>
                                    <Text style={styles.emptySubText}>
                                        Complete seu perfil clicando no botão de editar
                                    </Text>
                                </View>
                            ) : (
                                userInfo.map((info, index) => (
                                    <SafeAreaView
                                        key={index}
                                        style={styles.infoItem}
                                    >
                                        <Text style={styles.infoText}>{info}</Text>
                                    </SafeAreaView>
                                ))
                            )}
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
                                    {userProfile?.images && userProfile.images.length > 0 && userProfile.images[0] ? (
                                        <Image
                                            source={{ uri: userProfile.images[0] }}
                                            style={[styles.image, styles.imageIcon]}
                                        />
                                    ) : userProfile?.image ? (
                                        <Image
                                            source={{ uri: userProfile.image }}
                                            style={[styles.image, styles.imageIcon]}
                                        />
                                    ) : (
                                        <Image
                                            source={require("../../assets/images/icon.jpeg")}
                                            style={[styles.image, styles.imageIcon]}
                                        />
                                    )}
                                    <View>
                                        <Text
                                            style={{fontWeight: 'bold'}}
                                        >{userProfile?.name || "Nome do Usuário"}</Text>
                                        <Text
                                            style={{fontStyle: 'italic'}}
                                        >{userProfile?.email || "email@dominio.com"}</Text>
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
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: "#666",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#666",
        marginTop: 10,
    },
    emptySubText: {
        fontSize: 14,
        color: "#999",
        marginTop: 5,
        textAlign: "center",
        paddingHorizontal: 40,
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
    loadingOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loadingOverlayText: {
        color: '#fff',
        marginTop: 10,
        fontSize: 16,
    },
});