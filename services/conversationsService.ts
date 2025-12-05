import { api } from '../config/axiosConnection'

export interface Conversation {
  id: string
  participants: string[]
  lastMessage: {
    text: string
    senderId: string
    timestamp: Date | string
  }
  createdAt: Date | string
}

export interface CreateConversationDto {
  participants: string[]
}

/**
 * Cria uma nova conversa
 */
export const createConversation = async (dto: CreateConversationDto): Promise<Conversation> => {
  try {
    console.log('🔵 [CONVERSATIONS] Criando conversa...')
    console.log('🔵 [CONVERSATIONS] Participantes:', dto.participants)
    
    const { data } = await api.post('/conversations', dto)
    console.log('✅ [CONVERSATIONS] Conversa criada:', data.id)
    return data
  } catch (error: any) {
    console.error('❌ [CONVERSATIONS] Erro ao criar conversa:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao criar conversa')
  }
}

/**
 * Lista todas as conversas do usuário
 */
export const getMyConversations = async (participantId: string): Promise<Conversation[]> => {
  try {
    console.log('🔵 [CONVERSATIONS] Buscando conversas do usuário:', participantId)
    
    const { data } = await api.get('/conversations', {
      params: { participantId }
    })
    console.log('✅ [CONVERSATIONS] Conversas encontradas:', data.length)
    return data
  } catch (error: any) {
    console.error('❌ [CONVERSATIONS] Erro ao buscar conversas:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar conversas')
  }
}

/**
 * Busca uma conversa específica por ID
 */
export const getConversationById = async (id: string): Promise<Conversation> => {
  try {
    console.log('🔵 [CONVERSATIONS] Buscando conversa:', id)
    
    const { data } = await api.get(`/conversations/${id}`)
    console.log('✅ [CONVERSATIONS] Conversa encontrada:', data.id)
    return data
  } catch (error: any) {
    console.error('❌ [CONVERSATIONS] Erro ao buscar conversa:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar conversa')
  }
}

/**
 * Deleta uma conversa
 */
export const deleteConversation = async (id: string): Promise<void> => {
  try {
    console.log('🔵 [CONVERSATIONS] Deletando conversa:', id)
    
    await api.delete(`/conversations/${id}`)
    console.log('✅ [CONVERSATIONS] Conversa deletada')
  } catch (error: any) {
    console.error('❌ [CONVERSATIONS] Erro ao deletar conversa:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao deletar conversa')
  }
}

/**
 * Busca ou cria uma conversa entre dois usuários
 */
export const getOrCreateConversation = async (otherUserId: string, currentUserId: string): Promise<Conversation> => {
  try {
    console.log('🔵 [CONVERSATIONS] Buscando conversa com usuário:', otherUserId)
    
    // Primeiro, busca conversas do usuário atual
    const conversations = await getMyConversations(currentUserId)
    
    // Procura uma conversa que inclua ambos os participantes
    const existingConversation = conversations.find(conv => 
      conv.participants.includes(otherUserId) && 
      conv.participants.includes(currentUserId)
    )
    
    if (existingConversation) {
      console.log('✅ [CONVERSATIONS] Conversa existente encontrada:', existingConversation.id)
      return existingConversation
    }
    
    // Se não existe, cria uma nova
    console.log('🔵 [CONVERSATIONS] Criando nova conversa...')
    const newConversation = await createConversation({
      participants: [currentUserId, otherUserId]
    })
    
    return newConversation
  } catch (error: any) {
    console.error('❌ [CONVERSATIONS] Erro ao buscar/criar conversa:', error)
    throw error
  }
}

