import React from "react";
import { View, StyleSheet } from "react-native";
import { SwipeDeck } from "@/components/SwipeDeck";

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

const profiles: Profile[] = [
    {
        id: "1",
        name: "Alice",
        age: 25,
        image: require("../../assets/images/icon.jpeg"),
        tags: [
            { label: "Esportes", color: "#A93F19" },
            { label: "Jogos", color: "#3B36DA" },
        ],
    },
    {
        id: "2",
        name: "Bruno",
        age: 30,
        image: require("../../assets/images/icon.jpeg"),
        tags: [
            { label: "Esportes", color: "#A93F19" },
            { label: "Esportes", color: "#A93F19" },
        ],
    },
    {
        id: "3",
        name: "Carla",
        age: 28,
        image: require("../../assets/images/icon.jpeg"),
        tags: [
            { label: "Jogos", color: "#3B36DA" },
            { label: "Jogos", color: "#3B36DA" },
        ],
    },
];

const Home = () => {
    const handleSwipeRight = (profile: Profile) => {
        console.log("Gostou de:", profile.name);
    };

    const handleSwipeLeft = (profile: Profile) => {
        console.log("Rejeitou:", profile.name);
    };

    return (
        <View style={styles.container}>
            <SwipeDeck
                data={profiles}
                onSwipeRight={handleSwipeRight}
                onSwipeLeft={handleSwipeLeft}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fafafa",
        paddingTop: 50,
    },
});

export default Home;