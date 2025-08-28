import { IconButton } from "react-native-paper";
import { LinearGradient } from 'expo-linear-gradient';
import React, {
    forwardRef,
    useImperativeHandle,
    useRef,
} from "react";
import {
    Animated,
    Dimensions,
    Image,
    PanResponder,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

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

export interface SwipeCardRef {
    swipeLeft: () => void;
    swipeRight: () => void;
}

interface SwipeCardProps {
    profile: Profile;
    onSwipeRight: (profile: Profile) => void;
    onSwipeLeft: (profile: Profile) => void;
    disabled?: boolean;
}

const SwipeCard = forwardRef<SwipeCardRef, SwipeCardProps>(
    ({ profile, onSwipeRight, onSwipeLeft, disabled = false }, ref) => {
    const pan = useRef(new Animated.ValueXY()).current;

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => !disabled,
            onPanResponderMove: Animated.event(
                [null, { dx: pan.x, dy: pan.y }],
                { useNativeDriver: false }
            ),
            onPanResponderRelease: (_, gesture) => {
                if (gesture.dx > 120) {
                    Animated.timing(pan, {
                        toValue: { x: 500, y: 0 },
                        duration: 300,
                        useNativeDriver: false,
                    }).start(() => onSwipeRight(profile));
                } else if (gesture.dx < -120) {
                    Animated.timing(pan, {
                        toValue: { x: -500, y: 0 },
                        duration: 300,
                        useNativeDriver: false,
                    }).start(() => onSwipeLeft(profile));
                } else {
                    Animated.spring(pan, {
                        toValue: { x: 0, y: 0 },
                        useNativeDriver: false,
                    }).start();
                }
            },
        })
    ).current;

    const swipe = (direction: "left" | "right") => {
        Animated.timing(pan, {
            toValue: { x: direction === "right" ? 500 : -500, y: 0 },
            duration: 300,
            useNativeDriver: false,
        }).start(() =>
            direction === "right"
                ? onSwipeRight(profile)
                : onSwipeLeft(profile)
        );
    };

    useImperativeHandle(ref, () => ({
        swipeLeft: () => swipe("left"),
        swipeRight: () => swipe("right"),
    }));

    if (!profile) {
        return (
            <View style={styles.container}>
                <Text style={{ color: "red" }}>Erro: perfil indefinido</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Animated.View
                style={[styles.card, { transform: pan.getTranslateTransform() }]}
                {...(!disabled ? panResponder.panHandlers : {})}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.1)', 'transparent', 'rgba(0,0,0,0.3)']}
                    style={styles.gradientOverlay}
                />
                
                <View style={styles.header}>
                    <View style={styles.nameContainer}>
                        <Text style={styles.name}>{profile.name}, {profile.age}</Text>
                        <View style={styles.infoIcon}>
                            <IconButton
                                icon="information-outline"
                                size={30}
                                iconColor="#fff"
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.tags}>
                    {profile.tags.map((tag, index) => (
                        <View key={index} style={[styles.tag, { backgroundColor: tag.color }]}>
                            <Text style={styles.tagText}>{tag.label}</Text>
                        </View>
                    ))}
                </View>

                <Image source={profile.image} style={styles.image} resizeMode="cover" />

                <View style={styles.actions}>                        
                    <IconButton
                        icon="close"
                        size={30}
                        iconColor="#fff"
                        style={styles.actionButton} 
                        containerColor="#ee5a52"
                        onPress={() => swipe("left")}
                    />

                    <IconButton
                        icon="heart"
                        size={30}
                        iconColor="#fff"
                        style={styles.actionButton} 
                        containerColor="#44a08d"
                        onPress={() => swipe("right")}
                    />
                        
                </View>
            </Animated.View>
        </View>
    );
});

const { width, height } = Dimensions.get("window");
const CARD_WIDTH = width - 40;
const CARD_HEIGHT = height * 0.75;

const styles = StyleSheet.create({
    container: {
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        backgroundColor: "#fff",
        borderRadius: 24,
        overflow: "hidden",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 12,
    },
    gradientOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1,
    },
    header: {
        position: 'absolute',
        top: 20,
        left: 20,
        right: 20,
        zIndex: 2,
    },
    nameContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    name: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#fff",
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },
    infoIcon: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 20,
    },
    tags: {
        position: 'absolute',
        top: 80,
        left: 20,
        right: 20,
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
        zIndex: 2,
    },
    tag: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginBottom: 4,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    tagText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 12,
    },
    image: {
        width: "100%",
        height: "100%",
    },
    actions: {
        position: 'absolute',
        bottom: 30,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "space-around",
        paddingHorizontal: 40,
        zIndex: 2,
    },
    actionButton: {
        width: 60,
        height: 60,
        borderRadius: 30,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
    },
});

export default SwipeCard;
