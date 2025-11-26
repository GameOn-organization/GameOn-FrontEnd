import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    ActivityIndicator,
    Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { useLocalSearchParams, useRouter } from "expo-router";
import { getMessagesByConversation, sendMessage as sendMessageAPI, Message } from "../../../services/messagesService";
import { getConversationById } from "../../../services/conversationsService";
import { getCurrentUser } from "../../../services/authService";
import { getUserById } from "../../../services/usersService";
import { convertFirestoreObject } from "../../../utils/firestoreUtils";
import { formatRelativeDate } from "../../../utils/firestoreUtils";

export default function Chat() {
    const params = useLocalSearchParams();
    const router = useRouter();
    const conversationId = params.id as string;
    const otherUserName = params.name as string;
    const otherUserImage = params.image as string;

    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    const scrollViewRef = useRef<ScrollView>(null);

    // Carregar dados iniciais
    useEffect(() => {
        loadMessages();
    }, [conversationId]);

    const loadMessages = async () => {
        try {
            setLoading(true);
            console.log('🔵 [CHAT] Buscando mensagens da conversa:', conversationId);
            
            // Buscar usuário atual
            const user = await getCurrentUser();
            setCurrentUserId(user.uid);

            // Buscar mensagens
            const rawMessages = await getMessagesByConversation(conversationId);
            const convertedMessages = rawMessages.map(msg => convertFirestoreObject(msg));
            
            console.log('✅ [CHAT] Mensagens carregadas:', convertedMessages.length);
            setMessages(convertedMessages);
        } catch (error: any) {
            console.error('❌ [CHAT] Erro ao carregar mensagens:', error);
            Alert.alert('Erro', 'Não foi possível carregar as mensagens');
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (message.trim() && currentUserId) {
            try {
                setSending(true);
                console.log('🔵 [CHAT] Enviando mensagem...');
                
                // Enviar mensagem
                const sentMessage = await sendMessageAPI({
                    conversationId,
                    senderId: currentUserId,
                    text: message.trim(),
                });

                console.log('✅ [CHAT] Mensagem enviada:', sentMessage.id);
                
                // Adicionar à lista local
                const converted = convertFirestoreObject(sentMessage);
                setMessages([...messages, converted]);
                setMessage("");
                
                // Scroll para baixo
                setTimeout(() => {
                    if (scrollViewRef.current) {
                        scrollViewRef.current.scrollToEnd({ animated: true });
                    }
                }, 100);
            } catch (error: any) {
                console.error('❌ [CHAT] Erro ao enviar mensagem:', error);
                Alert.alert('Erro', 'Não foi possível enviar a mensagem');
            } finally {
                setSending(false);
            }
        }
    };

    const renderMessage = (msg: Message) => {
        const isUser = msg.senderId === currentUserId;
        return (
            <View
                key={msg.id}
                style={[
                    styles.messageContainer,
                    isUser ? styles.userMessage : styles.botMessage,
                ]}
            >
                <View
                    style={[
                        styles.messageBubble,
                        isUser ? styles.userBubble : styles.botBubble,
                    ]}
                >
                    <Text
                        style={[
                            styles.messageText,
                            isUser ? styles.userText : styles.botText,
                        ]}
                    >
                        {msg.text}
                    </Text>
                    <Text
                        style={[
                            styles.timestampText,
                            isUser ? styles.userTimestamp : styles.botTimestamp,
                        ]}
                    >
                        {formatRelativeDate(msg.timeStamp)}
                    </Text>
                </View>
            </View>
        );
    };

    useEffect(() => {
        // Define comportamento imersivo (gestos trazem barra de volta, mas some de novo)
        NavigationBar.setBehaviorAsync("overlay-swipe");
        // Esconde barra de navegação
        NavigationBar.setVisibilityAsync("hidden");

        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            (e) => {
                setKeyboardHeight(e.endCoordinates.height - 190); // Ajuste conforme necessário
                setKeyboardVisible(true);
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollToEnd({ animated: true });
                }
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                setKeyboardHeight(0);
                setKeyboardVisible(false);
                if (scrollViewRef.current) {
                    scrollViewRef.current.scrollToEnd({ animated: true });
                }
            }
        );

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, []);

    useEffect(() => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    // Loading state
    if (loading) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar style="dark" />
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#007AFF" />
                    <Text style={styles.loadingText}>Carregando mensagens...</Text>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Mensagens */}
            <KeyboardAvoidingView
                style={styles.chatContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 20 : keyboardHeight}
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.length === 0 ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhuma mensagem ainda</Text>
                            <Text style={styles.emptySubtext}>Envie a primeira mensagem!</Text>
                        </View>
                    ) : (
                        messages.map(renderMessage)
                    )}
                </ScrollView>

                {/* Input - Ajustado com marginBottom */}
                <View style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Mensagem..."
                            placeholderTextColor="#999"
                            multiline
                            editable={!sending}
                        />
                        <TouchableOpacity style={styles.attachButton}>
                            <Text style={styles.attachButtonText}>📎</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={[styles.sendButton, sending && styles.sendButtonDisabled]}
                        onPress={sendMessage}
                        disabled={sending || !message.trim()}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.sendButtonText}>➤</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#8B4513",
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    avatarText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    headerName: {
        fontSize: 16,
        fontWeight: "600",
        color: "#000",
    },
    headerStatus: {
        fontSize: 12,
        color: "#666",
        marginTop: 2,
    },
    callButton: {
        padding: 8,
    },
    callButtonText: {
        fontSize: 20,
    },
    chatContainer: {
        flex: 1,
    },
    messagesContainer: {
        flex: 1,
        paddingHorizontal: 16,
    },
    messagesContent: {
        paddingVertical: 16,
    },
    messageContainer: {
        marginVertical: 4,
    },
    userMessage: {
        alignItems: "flex-end",
    },
    botMessage: {
        alignItems: "flex-start",
    },
    messageBubble: {
        maxWidth: "80%",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 20,
    },
    userBubble: {
        backgroundColor: "#007AFF",
        borderBottomRightRadius: 4,
    },
    botBubble: {
        backgroundColor: "#000",
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 20,
    },
    userText: {
        color: "#fff",
    },
    botText: {
        color: "#fff",
    },
    timestampText: {
        fontSize: 10,
        marginTop: 4,
        opacity: 0.7,
    },
    userTimestamp: {
        color: "#fff",
        textAlign: "right",
    },
    botTimestamp: {
        color: "#fff",
        textAlign: "left",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 20, // Aumentado de 12 para 20
        marginBottom: 10, // Adicionado margin bottom
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
    },
    inputWrapper: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end",
        backgroundColor: "#f8f8f8",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginRight: 8,
    },
    textInput: {
        flex: 1,
        fontSize: 16,
        maxHeight: 100,
        paddingVertical: 4,
    },
    attachButton: {
        padding: 4,
        marginLeft: 8,
    },
    attachButtonText: {
        fontSize: 18,
    },
    sendButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#007AFF",
        alignItems: "center",
        justifyContent: "center",
    },
    sendButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#666",
    },
    emptyContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: "#666",
    },
});
