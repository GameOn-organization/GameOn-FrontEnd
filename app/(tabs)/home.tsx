import React, { useState, useEffect } from "react";
import { Dimensions, View, StyleSheet, ActivityIndicator, Text, Modal, TouchableOpacity, Image, Alert } from "react-native";
import { SwipeDeck } from "@/components/SwipeDeck";
import { listUsers, UserProfile } from "@/services/usersService";
import { getCurrentUser } from "@/services/authService";
import { getTagName } from "@/utils/tagsMap";
import { likeUser } from "@/services/likesService";
import { useRouter } from "expo-router";

type Tag = {
    label: string;
    color: string;
};

type Profile = {
    id: string;
    name: string;
    age: number;
    image: any;
    tags: Tag[];
};

// Função para mapear tags para cores
const getTagColor = (tagId: string): string => {
    // Jogos - azul
    const gamesIds = ["1", "2", "3", "4", "5", "6", "7", "8"];
    if (gamesIds.includes(tagId)) {
        return "#3B36DA";
    }
    // Esportes - laranja
    return "#A93F19";
};

// Função para converter UserProfile do backend para Profile do componente
const convertToProfile = (user: UserProfile): Profile => {
    // Obter imagem (priorizar images[0], depois image, senão placeholder)
    let imageSource: any;
    if (user.images && user.images.length > 0 && user.images[0]) {
        imageSource = { uri: user.images[0] };
    } else if (user.image) {
        imageSource = { uri: user.image };
    } else {
        imageSource = require("../../assets/images/icon.jpeg");
    }

    // Converter tags para formato com label e cor
    const tags: Tag[] = user.tags.map(tagId => ({
        label: getTagName(tagId),
        color: getTagColor(tagId)
    }));

    return {
        id: user.id,
        name: user.name,
        age: user.age,
        image: imageSource,
        tags: tags
    };
};

const Home = () => {
    const router = useRouter();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estado do modal de match
    const [showMatchModal, setShowMatchModal] = useState(false);
    const [matchedUser, setMatchedUser] = useState<Profile | null>(null);
    const [matchConversationId, setMatchConversationId] = useState<string | null>(null);

    // Função para buscar usuários
    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const currentUser = getCurrentUser();
            const users = await listUsers({ limit: 50 });
            
            // Filtrar o usuário atual da lista
            const filteredUsers = users.filter(user => user.id !== currentUser?.uid);
            
            // Converter para o formato esperado pelo SwipeDeck
            const convertedProfiles = filteredUsers.map(convertToProfile);
            
            setProfiles(convertedProfiles);
            console.log('✅ [HOME] Usuários carregados:', convertedProfiles.length);
        } catch (error: any) {
            console.error('❌ [HOME] Erro ao carregar usuários:', error);
            setError(error.message || 'Erro ao carregar usuários');
        } finally {
            setIsLoading(false);
        }
    };

    // Buscar usuários ao montar o componente
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSwipeRight = async (profile: Profile) => {
        console.log("💚 Gostou de:", profile.name);
        
        try {
            // Dar like no usuário
            const result = await likeUser(profile.id);
            console.log("📊 [HOME] Resultado do like:", result);
            
            if (result.match) {
                // É um match! Mostrar modal
                console.log("🎉 É UM MATCH COM:", profile.name);
                console.log("💬 [HOME] Conversation ID:", result.conversation?.id);
                console.log("💬 [HOME] Conversation completa:", result.conversation);
                
                // Verificar se tem conversation ID
                if (!result.conversation?.id) {
                    console.error("❌ [HOME] ERRO: Match sem conversation ID!");
                    console.error("❌ [HOME] Result completo:", JSON.stringify(result, null, 2));
                    Alert.alert(
                        "Match! 🎉", 
                        `Você e ${profile.name} deram match! Mas houve um erro ao criar a conversa. Por favor, verifique a aba de mensagens.`,
                        [{ text: "OK" }]
                    );
                } else {
                    setMatchedUser(profile);
                    setMatchConversationId(result.conversation.id);
                    setShowMatchModal(true);
                }
            } else {
                console.log("✅ Like enviado para:", profile.name);
            }
        } catch (error: any) {
            console.error("❌ Erro ao dar like:", error);
            Alert.alert("Erro", error.message || "Erro ao dar like no usuário");
        }
    };

    const handleSwipeLeft = (profile: Profile) => {
        console.log("👎 Rejeitou:", profile.name);
        // Não precisa fazer nada no backend para rejeição
    };

    const handleCloseMatchModal = () => {
        setShowMatchModal(false);
        setMatchedUser(null);
        setMatchConversationId(null);
    };

    const handleGoToChat = () => {
        console.log("🔵 [HOME] handleGoToChat chamado");
        console.log("🔵 [HOME] matchConversationId:", matchConversationId);
        console.log("🔵 [HOME] matchedUser:", matchedUser);
        
        if (matchConversationId && matchedUser) {
            // Extrair URI da imagem
            const imageUri = typeof matchedUser.image === 'object' && matchedUser.image.uri 
                ? matchedUser.image.uri 
                : '';
                
            console.log("✅ [HOME] Navegando para chat com:", {
                id: matchConversationId,
                name: matchedUser.name,
                image: imageUri
            });
            
            handleCloseMatchModal();
            
            router.push({
                pathname: "/(tabs)/messages/chat",
                params: {
                    id: matchConversationId,
                    name: matchedUser.name,
                    image: imageUri,
                },
            });
        } else {
            console.log("❌ [HOME] Não pode navegar - faltam dados:", {
                hasConversationId: !!matchConversationId,
                hasMatchedUser: !!matchedUser
            });
            Alert.alert("Erro", "Não foi possível abrir a conversa. Por favor, tente novamente.");
        }
    };

    // Estado de loading
    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Carregando usuários...</Text>
            </View>
        );
    }

    // Estado de erro
    if (error) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>❌ {error}</Text>
                <Text style={styles.retryText} onPress={fetchUsers}>
                    Tentar novamente
                </Text>
            </View>
        );
    }

    // Estado vazio
    if (profiles.length === 0) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.emptyText}>
                    😕 Nenhum usuário disponível no momento
                </Text>
                <Text style={styles.retryText} onPress={fetchUsers}>
                    Atualizar
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <SwipeDeck
                data={profiles}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
            />

            {/* Modal de Match */}
            <Modal
                visible={showMatchModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCloseMatchModal}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.matchTitle}>🎉 É um Match! 🎉</Text>
                        
                        {matchedUser && (
                            <>
                                <Image 
                                    source={matchedUser.image}
                                    style={styles.matchImage}
                                />
                                <Text style={styles.matchName}>{matchedUser.name}</Text>
                                <Text style={styles.matchSubtitle}>
                                    Vocês deram like um no outro!
                                </Text>
                            </>
                        )}

                        <View style={styles.modalButtons}>
                            <TouchableOpacity 
                                style={[styles.modalButton, styles.chatButton]}
                                onPress={() => {
                                    console.log("🔵 [MODAL] Botão 'Enviar Mensagem' pressionado");
                                    handleGoToChat();
                                }}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.chatButtonText}>💬 Enviar Mensagem</Text>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={[styles.modalButton, styles.continueButton]}
                                onPress={() => {
                                    console.log("🔵 [MODAL] Botão 'Continuar Navegando' pressionado");
                                    handleCloseMatchModal();
                                }}
                                activeOpacity={0.7}
                            >
                                <Text style={styles.continueButtonText}>Continuar Navegando</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        flex: 1,
        backgroundColor: "#fafafa",
        paddingTop: 50,
    },
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#666",
    },
    errorText: {
        fontSize: 16,
        color: "#d32f2f",
        textAlign: "center",
        marginHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        color: "#666",
        textAlign: "center",
        marginHorizontal: 40,
    },
    retryText: {
        marginTop: 16,
        fontSize: 16,
        color: "#667eea",
        textDecorationLine: "underline",
    },
    // Estilos do Modal de Match
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 20,
        padding: 30,
        alignItems: "center",
        width: width * 0.85,
        maxWidth: 400,
    },
    matchTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#44a08d",
        marginBottom: 20,
        textAlign: "center",
    },
    matchImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginBottom: 20,
        borderWidth: 3,
        borderColor: "#44a08d",
    },
    matchName: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 10,
    },
    matchSubtitle: {
        fontSize: 16,
        color: "#666",
        textAlign: "center",
        marginBottom: 30,
    },
    modalButtons: {
        width: "100%",
        gap: 12,
    },
    modalButton: {
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    chatButton: {
        backgroundColor: "#44a08d",
    },
    chatButtonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    continueButton: {
        backgroundColor: "#f0f0f0",
    },
    continueButtonText: {
        color: "#666",
        fontSize: 16,
        fontWeight: "600",
    },
});

export default Home;