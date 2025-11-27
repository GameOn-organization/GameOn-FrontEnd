import React, { useState, useEffect } from 'react'
import {
    StyleSheet,
    Text,
    SafeAreaView,
    View,
    ScrollView,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
} from 'react-native'
import { useRouter } from 'expo-router'
import { IconButton } from 'react-native-paper'
import ChatButton from '../../../components/ChatButton'
import { getMyConversations, Conversation } from '../../../services/conversationsService'
import { getCurrentUser } from '../../../services/authService'
import { getUserById } from '../../../services/usersService'
import { convertFirestoreObject } from '../../../utils/firestoreUtils'

interface ConversationWithUser extends Conversation {
    otherUser?: {
        id: string
        name: string
        image?: string | null
        images?: (string | null)[]
    }
}

export default function Message() {
    const router = useRouter()
    const [conversations, setConversations] = useState<ConversationWithUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Função para buscar conversas
    const fetchConversations = async () => {
        try {
            const currentUser = getCurrentUser()
            if (!currentUser) {
                throw new Error('Usuário não autenticado')
            }

            console.log('🔵 [MESSAGES] Buscando conversas...')
            const rawConvs = await getMyConversations(currentUser.uid)
            
            // Converter timestamps do Firestore
            const convs = rawConvs.map(conv => convertFirestoreObject(conv))
            
            // Buscar dados dos outros participantes
            const convsWithUsers = await Promise.all(
                convs.map(async (conv) => {
                    // Encontrar o outro usuário (não é o usuário atual)
                    const otherUserId = conv.participants.find(p => p !== currentUser.uid)
                    
                    if (otherUserId) {
                        try {
                            const otherUser = await getUserById(otherUserId)
                            return {
                                ...conv,
                                otherUser: {
                                    id: otherUser.id,
                                    name: otherUser.name,
                                    image: otherUser.image,
                                    images: otherUser.images
                                }
                            }
                        } catch (error) {
                            console.error('Erro ao buscar usuário:', otherUserId, error)
                            return conv
                        }
                    }
                    
                    return conv
                })
            )
            
            setConversations(convsWithUsers)
            console.log('✅ [MESSAGES] Conversas carregadas:', convsWithUsers.length)
        } catch (error: any) {
            console.error('❌ [MESSAGES] Erro ao carregar conversas:', error)
            setError(error.message || 'Erro ao carregar conversas')
        } finally {
            setIsLoading(false)
            setIsRefreshing(false)
        }
    }

    // Buscar conversas ao montar
    useEffect(() => {
        fetchConversations()
    }, [])

    // Pull to refresh
    const handleRefresh = () => {
        setIsRefreshing(true)
        fetchConversations()
    }

    // Formatar timestamp
    const formatTime = (timestamp: Date | string) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        
        if (hours < 1) {
            const minutes = Math.floor(diff / (1000 * 60))
            return `${minutes}m`
        } else if (hours < 24) {
            return `${hours}h`
        } else {
            const days = Math.floor(hours / 24)
            return `${days}d`
        }
    }

    // Estado de loading
    if (isLoading) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <ActivityIndicator size="large" color="#667eea" />
                <Text style={styles.loadingText}>Carregando conversas...</Text>
            </SafeAreaView>
        )
    }

    // Estado de erro
    if (error) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <Text style={styles.errorText}>❌ {error}</Text>
                <Text style={styles.retryText} onPress={fetchConversations}>
                    Tentar novamente
                </Text>
            </SafeAreaView>
        )
    }

    // Estado vazio
    if (conversations.length === 0) {
        return (
            <SafeAreaView style={[styles.container, styles.centerContent]}>
                <IconButton
                    icon="message-outline"
                    size={60}
                    iconColor="#ccc"
                />
                <Text style={styles.emptyText}>
                    Nenhuma conversa ainda
                </Text>
                <Text style={styles.emptySubText}>
                    Comece dando match com outros usuários na aba Home
                </Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView
                style={styles.scroll}
                contentContainerStyle={{ alignItems: 'center', paddingVertical: 10 }}
                refreshControl={
                    <RefreshControl
                        refreshing={isRefreshing}
                        onRefresh={handleRefresh}
                        colors={["#667eea"]}
                        tintColor="#667eea"
                    />
                }
            >
                {conversations.map((conv) => {
                    // Obter foto do outro usuário
                    let imageSource: any
                    if (conv.otherUser?.images && conv.otherUser.images.length > 0 && conv.otherUser.images[0]) {
                        imageSource = { uri: conv.otherUser.images[0] }
                    } else if (conv.otherUser?.image) {
                        imageSource = { uri: conv.otherUser.image }
                    } else {
                        imageSource = require("../../../assets/images/icon.jpeg")
                    }

                    // URL da foto do outro usuário
                    const otherUserImage = conv.otherUser?.images?.[0] || conv.otherUser?.image || null

                    return (
                        <ChatButton
                            key={conv.id}
                            pfp={imageSource}
                            name={conv.otherUser?.name || 'Usuário'}
                            lastMsg={conv.lastMessage?.text || 'Sem mensagens'}
                            time={formatTime(conv.lastMessage?.timestamp || conv.createdAt)}
                            onPress={() => router.push({
                                pathname: '/(tabs)/messages/chat',
                                params: {
                                    id: conv.id,
                                    name: conv.otherUser?.name || 'Usuário',
                                    image: otherUserImage || ''
                                }
                            })}
                        />
                    )
                })}
            </ScrollView>
        </SafeAreaView>
    )
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        width: width,
        height: height,
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroll: { width: '100%' },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    errorText: {
        fontSize: 16,
        color: '#d32f2f',
        textAlign: 'center',
        marginHorizontal: 40,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        textAlign: 'center',
        marginHorizontal: 40,
        marginTop: 16,
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
        marginHorizontal: 40,
        marginTop: 8,
    },
    retryText: {
        marginTop: 16,
        fontSize: 16,
        color: '#667eea',
        textDecorationLine: 'underline',
    },
})