import { IconButton } from "react-native-paper";
import React, { useState } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Post as PostType, likePost, deleteMyPost } from "../services/postsService";
import { getCurrentUser } from "../services/authService";
import { formatRelativeDate } from "../utils/firestoreUtils";
import CommentsModal from "./CommentsModal";

const { width } = Dimensions.get("window");

interface PostProps {
    post: PostType;
    onPostDeleted?: (postId: string) => void;
    onPostLiked?: (updatedPost: PostType) => void;
}

export default function Post({ post, onPostDeleted, onPostLiked }: PostProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes);
    const [isLiking, setIsLiking] = useState(false);
    const [commentsCount, setCommentsCount] = useState(post.comments);
    const [commentsModalVisible, setCommentsModalVisible] = useState(false);

    const currentUser = getCurrentUser();
    const isMyPost = currentUser?.uid === post.authorId;

    // Verificar se o usuário atual já deu like
    React.useEffect(() => {
        if (currentUser && post.likedBy?.includes(currentUser.uid)) {
            setIsLiked(true);
        }
    }, [currentUser, post.likedBy]);

    const handleLike = async () => {
        if (isLiking) return;
        
        setIsLiking(true);
        try {
            const updatedPost = await likePost(post.id);
            setIsLiked(!isLiked);
            setLikesCount(updatedPost.likes);
            
            if (onPostLiked) {
                onPostLiked(updatedPost);
            }
        } catch (error: any) {
            Alert.alert("Erro", error.message || "Erro ao curtir post");
        } finally {
            setIsLiking(false);
        }
    };

    const handleDelete = () => {
        Alert.alert(
            "Deletar Post",
            "Tem certeza que deseja deletar este post?",
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
                            await deleteMyPost(post.id);
                            
                            if (onPostDeleted) {
                                onPostDeleted(post.id);
                            }
                            
                            Alert.alert("Sucesso", "Post deletado com sucesso");
                        } catch (error: any) {
                            Alert.alert("Erro", error.message || "Erro ao deletar post");
                        }
                    },
                },
            ]
        );
    };


    return (
        <View style={styles.container}>
            <View style={styles.postContainer}>
                {/* Header do Post */}
                <View style={styles.header}>
                    <View style={styles.userContainer}>
                        {post.authorImage ? (
                            <Image
                                source={{ uri: post.authorImage }}
                                style={styles.image}
                            />
                        ) : (
                            <Image
                                source={require("../assets/images/icon.jpeg")}
                                style={styles.image}
                            />
                        )}
                        <View style={styles.userInfo}>
                            <Text style={styles.userName}>{post.authorName}</Text>
                            <Text style={styles.postDate}>{formatRelativeDate(post.createdAt)}</Text>
                        </View>
                    </View>
                    
                    {/* Botão de deletar se for post do usuário */}
                    {isMyPost && (
                        <IconButton
                            icon="delete-outline"
                            size={20}
                            iconColor="#999"
                            onPress={handleDelete}
                        />
                    )}
                </View>

                {/* Conteúdo do Post */}
                <View style={styles.content}>
                    <Text style={styles.postContent}>{post.content}</Text>
                </View>

                {/* Footer com ações */}
                <View style={styles.footer}>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity 
                            onPress={handleLike}
                            disabled={isLiking}
                            style={styles.actionButton}
                        >
                            <IconButton
                                icon={isLiked ? "cards-heart" : "cards-heart-outline"}
                                size={24}
                                iconColor={isLiked ? "red" : "#666"}
                            />
                            {likesCount > 0 && (
                                <Text style={styles.actionText}>{likesCount}</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity 
                            style={styles.actionButton}
                            onPress={() => setCommentsModalVisible(true)}
                        >
                            <IconButton
                                icon="comment-outline"
                                size={24}
                                iconColor="#666"
                            />
                            {commentsCount > 0 && (
                                <Text style={styles.actionText}>{commentsCount}</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.actionButton}>
                            <IconButton
                                icon="share-variant-outline"
                                size={24}
                                iconColor="#666"
                            />
                            {post.shares > 0 && (
                                <Text style={styles.actionText}>{post.shares}</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Modal de Comentários */}
            <CommentsModal
                visible={commentsModalVisible}
                postId={post.id}
                onClose={() => setCommentsModalVisible(false)}
                onCommentCountChange={(count) => setCommentsCount(count)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: width * 0.95,
        marginVertical: 8,
    },
    postContainer: {
        backgroundColor: "white",
        borderRadius: 12,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    userContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        marginRight: 10,
    },
    userInfo: {
        flexDirection: "column",
    },
    userName: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    postDate: {
        fontSize: 12,
        color: "#999",
        marginTop: 2,
    },
    content: {
        marginBottom: 12,
    },
    postContent: {
        fontSize: 15,
        color: "#333",
        lineHeight: 22,
    },
    footer: {
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
        paddingTop: 10,
    },
    iconContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
    },
    actionButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
    },
    actionText: {
        fontSize: 14,
        color: "#666",
        marginLeft: -8,
    },
});
