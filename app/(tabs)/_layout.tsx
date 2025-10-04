import React, { useState, useRef, useEffect } from "react";
import { SafeAreaView, Dimensions, Platform } from "react-native";
import { Icon, IconButton, Badge } from "react-native-paper";
import { Tabs, useRouter, useSegments } from "expo-router";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    runOnJS,
    interpolate,
    Extrapolate,
} from "react-native-reanimated";

import { HapticTab } from "@/components/examples/HapticTab";
import TabBarBackground from "@/components/ui/TabBarBackground";

const { width: screenWidth } = Dimensions.get("window");

// Array com as rotas das tabs na ordem
const TAB_ROUTES = [
    { name: "home", path: "/(tabs)/home" },
    { name: "community", path: "/(tabs)/community" },
    { name: "events", path: "/(tabs)/events" },
    { name: "notification", path: "/(tabs)/notification" },
    { name: "profile", path: "/(tabs)/profile"},
    { name: "faqsScreen", path: "faqs/faqsScreen", disableSwipe: true },
    { name: "message", path: "messages/message", disableSwipe: true },
    { name: "chat", path: "messages/chat", disableSwipe: true },
];

const INVALID_ROUTES = 3

export default function SwipeTabsLayoutWithVisualFeedback() {
    const router = useRouter();
    const [currentTabIndex, setCurrentTabIndex] = useState(0);
    const translateX = useSharedValue(0);
    const isGestureActive = useSharedValue(false);

    const segments = useSegments();
    const lastSegment = segments[segments.length - 1];
    // Atualiza currentTabIndex com base na rota atual do Expo Router
    useEffect(() => {
        const index = TAB_ROUTES.findIndex((tab) => tab.name === lastSegment);
        if (
            index !== -1 &&
            index !== currentTabIndex
        ) {
            setCurrentTabIndex(index);
        }
    }, [lastSegment]);

    // Função para navegar para uma tab específica
    const navigateToTab = (index: number) => {
        if (
            index >= 0 &&
            index < TAB_ROUTES.length - INVALID_ROUTES &&
            index !== currentTabIndex
        ) {
            // console.log(`Navegando para a tab: ${TAB_ROUTES[index].name}`);
            router.navigate(TAB_ROUTES[index].path);
        }
    };

    // Gesto de pan (deslizar) com feedback visual melhorado
    const panGesture = Gesture.Pan()
        .minDistance(20)
        .enabled(!TAB_ROUTES[currentTabIndex]?.disableSwipe)
        .onBegin(() => {
            isGestureActive.value = true;
        })
        .onUpdate((event) => {
            // Limita o movimento para não ultrapassar os limites
            const maxTranslation = screenWidth * 0.25;
            translateX.value = Math.max(
                -maxTranslation,
                Math.min(maxTranslation, event.translationX)
            );
        })
        .onEnd((event) => {
            isGestureActive.value = false;
            const threshold = screenWidth * 0.5; // 20% da largura da tela
            const velocity = event.velocityX;

            // Considera tanto a distância quanto a velocidade do gesto
            const shouldNavigate =
                Math.abs(event.translationX) > threshold ||
                Math.abs(velocity) > 1000;

            if (shouldNavigate) {
                if (event.translationX > 0 && currentTabIndex > 0) {
                    // Deslizar para a direita - tab anterior
                    runOnJS(navigateToTab)(currentTabIndex - 1);
                } else if (
                    event.translationX < 0 &&
                    currentTabIndex < TAB_ROUTES.length - 1
                    && segments[segments.length - 1] !== "chat"
                    && segments[segments.length - 1] !== "message"
                ) {
                    // Deslizar para a esquerda - próxima tab
                    runOnJS(navigateToTab)(currentTabIndex + 1);
                }
            }

            // Reset da posição com animação
            translateX.value = withSpring(0, {
                damping: 20,
                stiffness: 300,
            });
        });

    // Estilo animado para o feedback visual
    const animatedStyle = useAnimatedStyle(() => {
        const scale = interpolate(
            Math.abs(translateX.value),
            [0, screenWidth * 0.2],
            [1, 0.98],
            Extrapolate.CLAMP
        );

        const opacity = interpolate(
            Math.abs(translateX.value),
            [0, screenWidth * 0.3],
            [1, 0.8],
            Extrapolate.CLAMP
        );

        return {
            transform: [
                { translateX: translateX.value * 0.4 }, // Movimento sutil
                { scale },
            ],
            opacity,
        };
    });

    return (
        <GestureDetector gesture={panGesture}>
            <SafeAreaView style={{ flex: 1 }}>
                <Animated.View style={[{ flex: 1 }, animatedStyle]}>
                    <Tabs
                        screenOptions={{
                            tabBarActiveTintColor: "black",
                            tabBarInactiveTintColor: "gray",
                            animation: "shift",
                            headerShown: false,
                            tabBarButton: HapticTab,
                            tabBarBackground: TabBarBackground,
                            tabBarStyle: Platform.select({
                                ios: {
                                    position: "absolute",
                                },
                                default: {},
                            }),
                        }}
                    >
                        <Tabs.Screen
                            name="home"
                            options={{
                                name: "home",
                                title: "Perto de Você",
                                tabBarLabel: "Home",
                                headerTitleAlign: "center",
                                headerTitleStyle: {
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    textDecorationLine: "underline",
                                },
                                headerShown: true,
                                headerStyle: {
                                    backgroundColor: "#fafafa",
                                    borderBottomWidth: 0,
                                    shadowOpacity: 0,
                                    elevation: 0,
                                },
                                headerRight: () => (
                                    <>
                                        <IconButton
                                            icon="chat"
                                            size={40}
                                            onPress={() => {
                                                router.navigate(
                                                    "/(tabs)/messages/message"
                                                );
                                            }}
                                        />
                                        <Badge
                                            size={22} // Tamanho do badge
                                            style={{
                                                position: "absolute",
                                                top: 6,
                                                right: 10,
                                            }}
                                        >33</Badge>
                                    </>
                                ),
                                tabBarIcon: ({ focused }) => (
                                    <Icon
                                        size={28}
                                        source="home"
                                        color={focused ? "black" : "gray"}
                                    />
                                ),
                            }}
                        />

                        <Tabs.Screen
                            name="community"
                            options={{
                                title: "Comunidade",
                                tabBarIcon: ({ focused }) => (
                                    <Icon
                                        size={28}
                                        source="map-search"
                                        color={focused ? "black" : "gray"}
                                    />
                                ),
                            }}
                        />

                        <Tabs.Screen
                            name="events"
                            options={{
                                title: "Eventos",
                                tabBarIcon: ({ focused }) => (
                                    <Icon
                                        size={28}
                                        source="calendar-plus"
                                        color={focused ? "black" : "gray"}
                                    />
                                ),
                            }}
                        />

                        <Tabs.Screen
                            name="notification"
                            options={{
                                title: "Notificações",
                                tabBarBadgeStyle: {
                                    color: "white",
                                    backgroundColor: "red",
                                },
                                tabBarBadge: 4,
                                tabBarIcon: ({ focused }) => (
                                    <Icon
                                        size={28}
                                        source="bell"
                                        color={focused ? "black" : "gray"}
                                    />
                                ),
                            }}
                        />

                        <Tabs.Screen
                            name="profile"
                            options={{
                                title: "Perfil",
                                tabBarIcon: ({ focused }) => (
                                    <Icon
                                        size={28}
                                        source="account"
                                        color={focused ? "black" : "gray"}
                                    />
                                ),
                            }}
                        />

                        {/* EXCLUIDOS: */}
                        <Tabs.Screen
                            name="messages"
                            options={{
                                href: null, // Esconde o Botão da tab bar
                                tabBarStyle: { display: "none" }, //Esconde a Tab Bar
                            }}
                        />
                        <Tabs.Screen
                            name="faqs"
                            options={{
                                href: null, // Esconde o Botão da tab bar
                                tabBarStyle: { display: "none" }, //Esconde a Tab Bar
                            }}
                        />
                        <Tabs.Screen
                            name="settings"
                            options={{
                                href: null, // Esconde o Botão da tab bar
                                tabBarStyle: { display: "none" }, //Esconde a Tab Bar
                            }}
                        />
                        <Tabs.Screen
                            name="admin"
                            options={{
                                href: null, // Esconde o Botão da tab bar
                                tabBarStyle: { display: "none" }, //Esconde a Tab Bar
                            }}
                        />
                    </Tabs>
                </Animated.View>
            </SafeAreaView>
        </GestureDetector>
    );
}
