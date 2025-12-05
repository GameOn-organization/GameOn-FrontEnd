import { api } from '../config/axiosConnection'
import { UserProfile } from './usersService'

export interface LikeResponse {
  liked: boolean
  match: boolean
  conversation?: {
    id: string
    participants: string[]
    lastMessage: {
      text: string
      senderId: string
      timestamp: Date | string
    }
    createdAt: Date | string
  }
}

/**
 * Dá like em um usuário
 */
export const likeUser = async (targetUserId: string): Promise<LikeResponse> => {
  try {
    console.log('💚 [LIKES SERVICE] Dando like no usuário:', targetUserId)
    
    const { data } = await api.post(`/users/${targetUserId}/like`)
    
    if (data.match) {
      console.log('🎉 [LIKES SERVICE] É UM MATCH!', data)
    } else {
      console.log('✅ [LIKES SERVICE] Like enviado com sucesso')
    }
    
    return data
  } catch (error: any) {
    console.error('❌ [LIKES SERVICE] Erro ao dar like:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao dar like no usuário')
  }
}

/**
 * Retorna os matches do usuário
 */
export const getMyMatches = async (): Promise<UserProfile[]> => {
  try {
    console.log('🔵 [LIKES SERVICE] Buscando matches...')
    
    const { data } = await api.get('/users/me/matches')
    console.log('✅ [LIKES SERVICE] Matches encontrados:', data.length)
    return data
  } catch (error: any) {
    console.error('❌ [LIKES SERVICE] Erro ao buscar matches:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar matches')
  }
}

/**
 * Retorna os usuários que o usuário deu like
 */
export const getMyLikes = async (): Promise<UserProfile[]> => {
  try {
    console.log('🔵 [LIKES SERVICE] Buscando likes...')
    
    const { data } = await api.get('/users/me/likes')
    console.log('✅ [LIKES SERVICE] Likes encontrados:', data.length)
    return data
  } catch (error: any) {
    console.error('❌ [LIKES SERVICE] Erro ao buscar likes:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar likes')
  }
}

