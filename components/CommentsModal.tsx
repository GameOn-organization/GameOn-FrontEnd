import React, { useState, useEffect } from "react";
import {
    Modal,
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    Image,
} from "react-native";
import { IconButton } from "react-native-paper";
import {
    Comment,
    createComment,
    listComments,
    deleteComment,
    likeComment,
} from "../services/commentsService";
import { getCurrentUser, getMyProfile } from "../services/authService";
import { formatRelativeDate } from "../utils/firestoreUtils";

interface CommentsModalProps {
    visible: boolean;
    postId: string;
    onClose: () => void;
    onCommentCountChange?: (count: number) => void;
}

export default function CommentsModal({
    visible,
    postId,
    onClose,
    onCommentCountChange,
}: CommentsModalProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);

    const currentUser = getCurrentUser();

    // Buscar perfil do usuário ao montar o componente
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const profile = await getMyProfile();
                if (profile) {
                    setUserProfile(profile);
                }
            } catch (error) {
                console.error("Erro ao buscar perfil:", error);
                // Silencioso, o usuário pode não ter foto ainda
            }
        };
        
        fetchUserProfile();
    }, []);

    // Buscar comentários ao abrir o modal
    useEffect(() => {
        if (visible) {
            fetchComments();
        }
    }, [visible, postId]);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const fetchedComments = await listComments(postId);
            setComments(fetchedComments);
            
            if (onCommentCountChange) {
                onCommentCountChange(fetchedComments.length);
            }
        } catch (error: any) {
            console.error("Erro ao buscar comentários:", error);
            Alert.alert("Erro", error.message || "Erro ao buscar comentários");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePostComment = async () => {
        if (!newComment.trim()) {
            Alert.alert("Atenção", "Digite um comentário");
            return;
        }

        if (newComment.length > 500) {
            Alert.alert("Atenção", "O comentário não pode ter mais de 500 caracteres");
            return;
        }

        setIsPosting(true);
        try {
            const createdComment = await createComment({
                postId,
                content: newComment.trim(),
            });
            
            setComments([createdComment, ...comments]);
            setNewComment("");
            
            if (onCommentCountChange) {
                onCommentCountChange(comments.length + 1);
            }
        } catch (error: any) {
            Alert.alert("Erro", error.message || "Erro ao criar comentário");
        } finally {
            setIsPosting(false);
        }
    };

    const handleDeleteComment = (commentId: string) => {
        Alert.alert(
            "Deletar Comentário",
            "Tem certeza que deseja deletar este comentário?",
            [
                {
                    text: "Cancelar",
                    style: "cancel",
                },
                {
                    text: "Deletar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteComment(commentId);
                            const updatedComments = comments.filter((c) => c.id !== commentId);
                            setComments(updatedComments);
                            
                            if (onCommentCountChange) {
                                onCommentCountChange(updatedComments.length);
                            }
                            
                            Alert.alert("Sucesso", "Comentário deletado");
                        } catch (error: any) {
                            Alert.alert("Erro", error.message || "Erro ao deletar comentário");
                        }
                    },
                },
            ]
        );
    };

    const handleLikeComment = async (commentId: string) => {
        try {
            const updatedComment = await likeComment(commentId);
            setComments(
                comments.map((c) => (c.id === commentId ? updatedComment : c))
            );
        } catch (error: any) {
            Alert.alert("Erro", error.message || "Erro ao curtir comentário");
        }
    };

    const renderComment = ({ item }: { item: Comment }) => {
        const isMyComment = userProfile?.id === item.authorId;
        const isThereAvatar = userProfile?.image != null;
        const avatarSource = isMyComment && isThereAvatar ? userProfile?.image : null;
        const isLiked = item.likedBy?.includes(userProfile?.id || "");

        return (
            <View style={styles.commentItem}>
                <View style={styles.commentHeader}>
                    <View style={styles.commentUser}>
                        <Image
                            source={avatarSource ? { uri: avatarSource } : require("../assets/images/icon.jpeg")}
                            style={styles.avatar}
                        />
                        <View>
                            <Text style={styles.commentAuthor}>{item.authorName}</Text>
                            <Text style={styles.commentDate}>
                                {formatRelativeDate(item.createdAt)}
                            </Text>
                        </View>
                    </View>
                    {isMyComment && (
                        <IconButton
                            icon="delete-outline"
                            size={18}
                            iconColor="#999"
                            onPress={() => handleDeleteComment(item.id)}
                        />
                    )}
                </View>
                <Text style={styles.commentContent}>{item.content}</Text>
                <View style={styles.commentActions}>
                    <TouchableOpacity
                        onPress={() => handleLikeComment(item.id)}
                        style={styles.likeButton}
                    >
                        <IconButton
                            icon={isLiked ? "cards-heart" : "cards-heart-outline"}
                            size={18}
                            iconColor={isLiked ? "red" : "#666"}
                        />
                        {item.likes > 0 && (
                            <Text style={styles.likeCount}>{item.likes}</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent={false}
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Comentários</Text>
                    <IconButton icon="close" size={24} onPress={onClose} />
                </View>

                {/* Lista de comentários */}
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#667eea" />
                        <Text style={styles.loadingText}>Carregando...</Text>
                    </View>
                ) : comments.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <IconButton icon="comment-outline" size={60} iconColor="#ccc" />
                        <Text style={styles.emptyText}>Nenhum comentário ainda</Text>
                        <Text style={styles.emptySubText}>Seja o primeiro a comentar!</Text>
                    </View>
                ) : (
                    <FlatList
                        data={comments}
                        renderItem={renderComment}
                        keyExtractor={(item) => item.id}
                        contentContainerStyle={styles.commentsList}
                    />
                )}

                {/* Input de novo comentário */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Escreva um comentário..."
                        placeholderTextColor="#999"
                        value={newComment}
                        onChangeText={setNewComment}
                        maxLength={500}
                        multiline
                        editable={!isPosting}
                    />
                    <TouchableOpacity
                        onPress={handlePostComment}
                        style={[
                            styles.sendButton,
                            (!newComment.trim() || isPosting) && styles.sendButtonDisabled,
                        ]}
                        disabled={!newComment.trim() || isPosting}
                    >
                        {isPosting ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <IconButton icon="send" size={24} iconColor="#fff" />
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingTop: 50,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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
        paddingHorizontal: 40,
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
    },
    commentsList: {
        padding: 16,
    },
    commentItem: {
        marginBottom: 16,
        padding: 12,
        backgroundColor: "#f9f9f9",
        borderRadius: 8,
    },
    commentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },
    commentUser: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 8,
    },
    commentAuthor: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
    commentDate: {
        fontSize: 12,
        color: "#999",
    },
    commentContent: {
        fontSize: 14,
        color: "#333",
        lineHeight: 20,
        marginBottom: 8,
    },
    commentActions: {
        flexDirection: "row",
        alignItems: "center",
    },
    likeButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    likeCount: {
        fontSize: 14,
        color: "#666",
        marginLeft: -8,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 10,
        fontSize: 14,
        maxHeight: 100,
        marginRight: 8,
    },
    sendButton: {
        backgroundColor: "#667eea",
        borderRadius: 24,
        width: 48,
        height: 48,
        justifyContent: "center",
        alignItems: "center",
    },
    sendButtonDisabled: {
        backgroundColor: "#ccc",
    },
});

