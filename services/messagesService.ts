import { api } from '../config/axiosConnection'

export interface Message {
  id: string
  conversationId: string
  senderId: string
  text: string
  timeStamp: Date | string
  read: boolean
}

export interface CreateMessageDto {
  conversationId: string
  senderId: string
  text: string
}

/**
 * Envia uma mensagem
 */
export const sendMessage = async (dto: CreateMessageDto): Promise<Message> => {
  try {
    console.log('🔵 [MESSAGES] Enviando mensagem...')
    console.log('🔵 [MESSAGES] Conversa:', dto.conversationId)
    console.log('🔵 [MESSAGES] Texto:', dto.text.substring(0, 50))
    
    const { data } = await api.post('/messages', dto)
    console.log('✅ [MESSAGES] Mensagem enviada:', data.id)
    return data
  } catch (error: any) {
    console.error('❌ [MESSAGES] Erro ao enviar mensagem:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao enviar mensagem')
  }
}

/**
 * Lista mensagens de uma conversa
 */
export const getMessagesByConversation = async (conversationId: string): Promise<Message[]> => {
  try {
    console.log('🔵 [MESSAGES] Buscando mensagens da conversa:', conversationId)
    
    const { data } = await api.get('/messages', {
      params: { conversationId, orderBy: 'timeStamp', orderDirection: 'asc' }
    })
    console.log('✅ [MESSAGES] Mensagens encontradas:', data.length)
    return data
  } catch (error: any) {
    console.error('❌ [MESSAGES] Erro ao buscar mensagens:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar mensagens')
  }
}

/**
 * Marca uma mensagem como lida
 */
export const markMessageAsRead = async (messageId: string): Promise<Message> => {
  try {
    console.log('🔵 [MESSAGES] Marcando mensagem como lida:', messageId)
    
    const { data } = await api.patch(`/messages/${messageId}/read`)
    console.log('✅ [MESSAGES] Mensagem marcada como lida')
    return data
  } catch (error: any) {
    console.error('❌ [MESSAGES] Erro ao marcar mensagem como lida:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao marcar mensagem como lida')
  }
}

/**
 * Deleta uma mensagem
 */
export const deleteMessage = async (messageId: string): Promise<void> => {
  try {
    console.log('🔵 [MESSAGES] Deletando mensagem:', messageId)
    
    await api.delete(`/messages/${messageId}`)
    console.log('✅ [MESSAGES] Mensagem deletada')
  } catch (error: any) {
    console.error('❌ [MESSAGES] Erro ao deletar mensagem:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao deletar mensagem')
  }
}

