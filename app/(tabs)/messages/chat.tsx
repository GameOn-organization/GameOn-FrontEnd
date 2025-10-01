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
} from "react-native";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";

export default function App() {
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "This is the main chat template",
            sender: "bot",
            timestamp: "9:41 PM, 8/14/24",
        },
        {
            id: 2,
            text: "Oh?",
            sender: "user",
            timestamp: "9:41 PM, 8/14/24",
        },
        {
            id: 3,
            text: "Cool",
            sender: "user",
            timestamp: "9:41 PM, 8/14/24",
        },
        {
            id: 4,
            text: "How does it work?",
            sender: "bot",
            timestamp: "9:41 PM, 8/14/24",
        },
        {
            id: 5,
            text: "You just edit any text to type in the conversation you want to show, and then you can save it to use.",
            sender: "bot",
            timestamp: "9:41 PM, 8/14/24",
        },
        {
            id: 6,
            text: "Hmm",
            sender: "user",
            timestamp: "9:41 PM, 8/14/24",
        },
        {
            id: 7,
            text: "I think I get it",
            sender: "user",
            timestamp: "9:41 PM, 8/14/24",
        },
        {
            id: 8,
            text: "Will head to the Help Center if I have more questions tho",
            sender: "user",
            timestamp: "9:41 PM, 8/14/24",
        },
        {
            id: 9,
            text: "Will head to the Help Center if I have more questions tho",
            sender: "user",
            timestamp: "9:41 PM, 8/14/24",
        },
        {
            id: 10,
            text: "Will head to the Help Center if I have more questions tho",
            sender: "user",
            timestamp: "9:41 PM, 8/14/24",
        },
        {
            id: 11,
            text: "Will head to the Help Center if I have more questions tho",
            sender: "user",
            timestamp: "9:41 PM, 8/14/24",
        },
        {
            id: 12,
            text: "Will head to the Help Center if I have more questions tho",
            sender: "user",
            timestamp: "9:41 PM, 8/14/24",
        },
        {
            id: 13,
            text: "Will head to the Help Center if I have more questions tho",
            sender: "user",
            timestamp: "9:41 PM, 8/14/24",
        },
    ]);

    const scrollViewRef = useRef();

    const sendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                id: messages.length + 1,
                text: message,
                sender: "user",
                timestamp: new Date().toLocaleString(),
            };
            setMessages([...messages, newMessage]);
            setMessage("");
        }
    };

    const renderMessage = (msg) => {
        const isUser = msg.sender === "user";
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

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark" />

            {/* Mensagens */}
            <KeyboardAvoidingView
                style={styles.chatContainer}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 20 : keyboardHeight} // Ajuste conforme necessário
            >
                <ScrollView
                    ref={scrollViewRef}
                    style={styles.messagesContainer}
                    contentContainerStyle={styles.messagesContent}
                    showsVerticalScrollIndicator={false}
                >
                    {messages.map(renderMessage)}
                </ScrollView>

                {/* Input */}
                <SafeAreaView style={styles.inputContainer}>
                    <View style={styles.inputWrapper}>
                        <TextInput
                            style={styles.textInput}
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Mensagem..."
                            placeholderTextColor="#999"
                            multiline
                        />
                        <TouchableOpacity style={styles.attachButton}>
                            <Text style={styles.attachButtonText}>📎</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.sendButton}
                        onPress={sendMessage}
                    >
                        <Text style={styles.sendButtonText}>➤</Text>
                    </TouchableOpacity>
                </SafeAreaView>
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
    inputContainer: {
        flexDirection: "row",
        alignItems: "flex-end",
        paddingHorizontal: 16,
        paddingVertical: 12,
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
});
