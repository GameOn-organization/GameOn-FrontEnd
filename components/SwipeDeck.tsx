import React, { useState, useRef } from "react";
import { View, StyleSheet } from "react-native";
import SwipeCard, { SwipeCardRef } from "./SwipeCard";

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

interface SwipeDeckProps {
    data: Profile[];
    onSwipeRight?: (profile: Profile) => void;
    onSwipeLeft?: (profile: Profile) => void;
}

export const SwipeDeck = ({ data, onSwipeRight, onSwipeLeft }: SwipeDeckProps) => {
    const [index, setIndex] = useState(0);
    const cardRef = useRef<SwipeCardRef>(null);

    const handleSwipe = (direction: "left" | "right") => {
        const currentProfile = data[index];
        if (!currentProfile) return;

        direction === "left"
            ? onSwipeLeft?.(currentProfile)
            : onSwipeRight?.(currentProfile);

        setIndex((prev) => prev + 1);
    };

    return (
        <View style={styles.container}>
            {data.slice(index).map((profile, i) => {
                const isTop = i === 0;
                return (
                    <View
                        key={profile.id}
                        style={{
                            position: "absolute",
                            width: '100%', // Adjust the vertical spacing between cards
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <SwipeCard
                            key={profile.id}
                            ref={isTop ? cardRef : null}
                            profile={profile}
                            onSwipeLeft={() => handleSwipe("left")}
                            onSwipeRight={() => handleSwipe("right")}
                            disabled={!isTop}
                        />
                    </View>
                );
            }).reverse()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: "relative",
    },
});

export default SwipeDeck;
