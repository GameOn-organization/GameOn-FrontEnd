import React from "react";
import { StyleSheet, Text, SafeAreaView, Image, View, Dimensions, TouchableOpacity } from "react-native";
import { Icon } from "react-native-paper";

interface ChatButtonProps {
    onPress: () => void;
    idProfile?: string;
    pfp?: any;
    name?: string;
    idChat?: string;
    lastMsg?: string;
    time?: string;
}

export default function ChatButton({
    onPress, 
    idProfile, 
    pfp, 
    name = "Nome", 
    idChat, 
    lastMsg = "Última Mensagem", 
    time = "Agora"
}: ChatButtonProps) {
    // Se pfp não for fornecido, usar placeholder
    const imageSource = pfp || require("../assets/images/icon.jpeg");
    console.log("🖼️ URL final da imagem:", imageSource);

    return (
        <TouchableOpacity style={styles.chatContainer} onPress={onPress}>
            <View style={styles.items}>
                <View style={styles.imageContainer}>
                    <Image
                        source={imageSource}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                    />
                </View>
                <View style={styles.info}>
                    <Text style={styles.name} numberOfLines={1}>{name}</Text>
                    <Text style={styles.lastMsg} numberOfLines={1}>{lastMsg}</Text>
                </View>
                <View style={{ marginLeft: "auto", alignItems: 'flex-end'}}>
                    <Icon source="check" color="blue" size={20} />
                    <Text style={styles.time}>{time}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    chatContainer: {
        maxHeight: height * 0.12,
        width: "100%",
        padding: 16,
        borderRadius: 8,
        backgroundColor: "#f1f1f1",
        justifyContent: 'center',
    },
    items: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        padding: 8,
    },
    info: {
        marginLeft: 12,
        flex: 1,
        marginRight: 8,
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        overflow: "hidden",
        backgroundColor: "#ccc",
        alignItems: "center",
        justifyContent: "center",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },
    lastMsg: {
        fontSize: 14,
        color: "#666",
    },
    time: {
        fontSize: 12,
        color: "#999",
    },
});
