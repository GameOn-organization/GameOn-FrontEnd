import React from "react";
import {
    SafeAreaView,
    Text,
    TouchableOpacity
} from "react-native";

export default function MenuProfile() {
    return (
        <SafeAreaView>
            <TouchableOpacity>
                <Text
                    onPress={() => console.log("Configuração 1")}
                >
                    A
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
