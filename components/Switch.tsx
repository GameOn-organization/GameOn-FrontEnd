import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef } from "react";
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

interface Props {
    activeTab: "posts" | "info";
    onChangeTab: (tab: "posts" | "info") => void;
}

export const Switch = ({ activeTab, onChangeTab }: Props) => {
    const animation = useRef(new Animated.Value(activeTab === "posts" ? 0 : 1)).current;

    useEffect(() => {
        Animated.timing(animation, {
            toValue: activeTab === "posts" ? 0 : 1,
            duration: 300,
            useNativeDriver: false,
        }).start();
    }, [activeTab]);

    const translateX = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <View style={styles.switchWrapper}>
            <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.backgroundGradient}
            />
            <Animated.View
                style={[styles.animatedBackground, {transform: [{ translateX }]}]}
            />
            <TouchableOpacity
                onPress={() => onChangeTab("posts")}
                style={styles.switchButton}
            >
                <Text style={activeTab === "posts" ? styles.activeText : styles.inactiveText}>
                    Posts
                </Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => onChangeTab("info")}
                style={styles.switchButton}
            >
                <Text style={activeTab === "info" ? styles.activeText : styles.inactiveText}>
                    Informações
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    switchWrapper: {
        width: "80%",
        height: 56,
        borderRadius: 28,
        flexDirection: "row",
        position: "relative",
        overflow: "hidden",
        marginBottom: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 8,
        elevation: 6,
    },
    backgroundGradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 28,
    },
    animatedBackground: {
        position: "absolute",
        width: "50%",
        height: "100%",
        backgroundColor: "white",
        borderRadius: 28,
        zIndex: 0,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    switchButton: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1,
    },
    activeText: {
        color: "#333",
        fontWeight: "bold",
        fontSize: 16,
    },
    inactiveText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
    },
});

// Exemplo de uso:
// <Switch
//   activeTab={activeTab}
//   onChangeTab={setActiveTab}
// />