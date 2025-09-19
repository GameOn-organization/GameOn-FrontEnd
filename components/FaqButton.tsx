import React from "react";
import { StyleSheet, Text, SafeAreaView, Image, View, Dimensions, TouchableOpacity } from "react-native";
import { Icon, IconButton } from "react-native-paper";

export default function FaqButton({onPress}) {
    return (
        <TouchableOpacity style={styles.chatContainer} onPress={onPress}>
            <View style={styles.items}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require("../assets/images/icon.jpeg")}
                        style={{ width: 50, height: 50, borderRadius: 25 }}
                    />
                </View>
                <View style={styles.info}>
                    <Text style={styles.name}>Nome da FAQ</Text>
                </View>
                <View style={{
                    flexDirection: 'row',
                    marginLeft: "auto",
                    alignItems: 'flex-end',
                }}>
                    {/* If User == Player or User == Associate ( */}
                    <Icon source="chevron-right" color="blue" size={24} />
                    {/* ) Else ( */}
                    <IconButton
                        icon="pencil"
                        iconColor="black"
                        size={24}
                        onPress={() => console.log('Editar FAQ')}
                        />
                    <IconButton
                        icon="trash-can-outline"
                        iconColor="black"
                        size={24}
                        onPress={() => console.log('Excluir FAQ')}
                    />
                    {/* ) && FaqButton onPress == disabled*/}
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
});
