import { IconButton } from "react-native-paper";
import React, { useState, useEffect } from "react";
import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Alert,
    ActivityIndicator,
    View,
} from "react-native";
import { createPost } from "../services/postsService";
import { getCurrentUser, getMyProfile } from "../services/authService";

const { width, height } = Dimensions.get("window");

interface PostComposerProps {
    onPostCreated?: () => void;
    onClose?: () => void;
}

export default function PostComposer({ onPostCreated, onClose }: PostComposerProps) {
    const [content, setContent] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [userProfile, setUserProfile] = useState<any>(null);
    
    const currentUser = getCurrentUser();
    const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || "Usuário";
    
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
    
    const handlePost = async () => {
        if (!content.trim()) {
            Alert.alert("Atenção", "Digite algo antes de postar");
            return;
        }

        if (content.length > 280) {
            Alert.alert("Atenção", "O post não pode ter mais de 280 caracteres");
            return;
        }

        setIsPosting(true);
        try {
            await createPost({ content: content.trim() });
            Alert.alert("Sucesso", "Post criado com sucesso!");
            setContent("");
            
            if (onPostCreated) {
                onPostCreated();
            }
            
            if (onClose) {
                onClose();
            }
        } catch (error: any) {
            Alert.alert("Erro", error.message || "Erro ao criar post");
        } finally {
            setIsPosting(false);
        }
    };

    const remainingChars = 280 - content.length;
    const isOverLimit = remainingChars < 0;

    return (
        <SafeAreaView style={styles.container}>
            <SafeAreaView style={styles.postContainer}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Criar Post</Text>
                    {onClose && (
                        <IconButton
                            icon="close"
                            size={24}
                            iconColor="#666"
                            onPress={onClose}
                        />
                    )}
                </View>

                {/* User Info */}
                <SafeAreaView style={styles.userContainer}>
                    {userProfile?.images && userProfile.images.length > 0 && userProfile.images[0] ? (
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
                            source={require("../assets/images/icon.jpeg")}
                            style={styles.image}
                        />
                    )}
                    <Text style={styles.userName}>{userName}</Text>
                </SafeAreaView>

                {/* Content Input */}
                <SafeAreaView style={styles.content}>
                    <TextInput
                        style={styles.input}
                        multiline
                        placeholder="O que você está pensando?"
                        placeholderTextColor="#999"
                        value={content}
                        onChangeText={setContent}
                        maxLength={300}
                        editable={!isPosting}
                    />
                    
                    {/* Character Counter */}
                    <Text 
                        style={[
                            styles.charCounter, 
                            isOverLimit && styles.charCounterError
                        ]}
                    >
                        {remainingChars} caracteres restantes
                    </Text>
                </SafeAreaView>

                {/* Actions */}
                <SafeAreaView style={styles.iconContainer}>
                    {/* Botão de anexar (desabilitado por enquanto) */}
                    <IconButton
                        icon="attachment"
                        style={{ transform: [{ rotate: '-45deg' }] }}
                        size={24}
                        iconColor="#ccc"
                        disabled
                    />
                    
                    {/* Botão de postar */}
                    <TouchableOpacity
                        onPress={handlePost}
                        style={[
                            styles.buttonSend, 
                            (isPosting || !content.trim() || isOverLimit) && styles.buttonSendDisabled
                        ]}
                        disabled={isPosting || !content.trim() || isOverLimit}
                    >
                        {isPosting ? (
                            <ActivityIndicator size="small" color="purple" />
                        ) : (
                            <>
                                <Text style={styles.buttonText}>Postar</Text>
                                <IconButton
                                    icon="send"
                                    size={24}
                                    iconColor="purple"
                                />
                            </>
                        )}
                    </TouchableOpacity>
                </SafeAreaView>
            </SafeAreaView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "transparent",
    },
    postContainer: {
        backgroundColor: "white",
        borderRadius: 25,
        padding: 20,
        width: width * 0.95,
        maxHeight: height * 0.6,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#333",
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    userContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 15,
        gap: 15,
    },
    userName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    content: {
        marginBottom: 15,
    },
    iconContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    input: {
        borderColor: "#e0e0e0",
        borderWidth: 1,
        padding: 15,
        width: "100%",
        minHeight: 120,
        borderRadius: 10,
        fontSize: 16,
        textAlignVertical: "top",
        color: "#333",
    },
    charCounter: {
        fontSize: 12,
        color: "#999",
        marginTop: 8,
        textAlign: "right",
    },
    charCounterError: {
        color: "red",
    },
    buttonSend: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#EEEEEE",
        borderRadius: 25,
        paddingLeft: 15,
        minWidth: 120,
    },
    buttonSendDisabled: {
        opacity: 0.5,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: "600",
        color: "purple",
    },
});

