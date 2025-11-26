import React, { useState, useEffect } from "react";
import { Dimensions, View, StyleSheet, ActivityIndicator, Text } from "react-native";
import { SwipeDeck } from "@/components/SwipeDeck";
import { listUsers, UserProfile } from "@/services/usersService";
import { getCurrentUser } from "@/services/authService";
import { getTagName } from "@/utils/tagsMap";

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

// Função para mapear tags para cores
const getTagColor = (tagId: string): string => {
    // Jogos - azul
    const gamesIds = ["1", "2", "3", "4", "5", "6", "7", "8"];
    if (gamesIds.includes(tagId)) {
        return "#3B36DA";
    }
    // Esportes - laranja
    return "#A93F19";
};

// Função para converter UserProfile do backend para Profile do componente
const convertToProfile = (user: UserProfile): Profile => {
    // Obter imagem (priorizar images[0], depois image, senão placeholder)
    let imageSource: any;
    if (user.images && user.images.length > 0 && user.images[0]) {
        imageSource = { uri: user.images[0] };
    } else if (user.image) {
        imageSource = { uri: user.image };
    } else {
        imageSource = require("../../assets/images/icon.jpeg");
    }

    // Converter tags para formato com label e cor
    const tags: Tag[] = user.tags.map(tagId => ({
        label: getTagName(tagId),
        color: getTagColor(tagId)
    }));

    return {
        id: user.id,
        name: user.name,
        age: user.age,
        image: imageSource,
        tags: tags
    };
};

const Home = () => {
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Função para buscar usuários
    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const currentUser = getCurrentUser();
            const users = await listUsers({ limit: 50 });
            
            // Filtrar o usuário atual da lista
            const filteredUsers = users.filter(user => user.id !== currentUser?.uid);
            
            // Converter para o formato esperado pelo SwipeDeck
            const convertedProfiles = filteredUsers.map(convertToProfile);
            
            setProfiles(convertedProfiles);
            console.log('✅ [HOME] Usuários carregados:', convertedProfiles.length);
        } catch (error: any) {
            console.error('❌ [HOME] Erro ao carregar usuários:', error);
            setError(error.message || 'Erro ao carregar usuários');
        } finally {
            setIsLoading(false);
        }
    };

    // Buscar usuários ao montar o componente
    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSwipeRight = (profile: Profile) => {
        console.log("Gostou de:", profile.name);
        // TODO: Implementar lógica de match/like
    };

    const handleSwipeLeft = (profile: Profile) => {
        console.log("Rejeitou:", profile.name);
        // TODO: Implementar lógica de rejeição
    };

    // Estado de loading
    if (isLoading) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Carregando usuários...</Text>
            </View>
        );
    }

    // Estado de erro
    if (error) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>❌ {error}</Text>
                <Text style={styles.retryText} onPress={fetchUsers}>
                    Tentar novamente
                </Text>
            </View>
        );
    }

    // Estado vazio
    if (profiles.length === 0) {
        return (
            <View style={[styles.container, styles.centerContent]}>
                <Text style={styles.emptyText}>
                    😕 Nenhum usuário disponível no momento
                </Text>
                <Text style={styles.retryText} onPress={fetchUsers}>
                    Atualizar
                </Text>
            </View>
        );
    }

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

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
    container: {
        height: height,
        width: width,
        flex: 1,
        backgroundColor: "#fafafa",
        paddingTop: 50,
    },
    centerContent: {
        justifyContent: "center",
        alignItems: "center",
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: "#666",
    },
    errorText: {
        fontSize: 16,
        color: "#d32f2f",
        textAlign: "center",
        marginHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        color: "#666",
        textAlign: "center",
        marginHorizontal: 40,
    },
    retryText: {
        marginTop: 16,
        fontSize: 16,
        color: "#667eea",
        textDecorationLine: "underline",
    },
});

export default Home;