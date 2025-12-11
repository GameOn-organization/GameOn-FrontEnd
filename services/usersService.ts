import { api } from '../config/axiosConnection'

export interface UserProfile {
  id: string
  name: string
  age: number
  email: string
  phone?: string
  image?: string | null
  images?: (string | null)[]
  descricao?: string
  sexo?: 'm' | 'f' | 'nb'
  localizacao?: string
  wallpaper?: string | null
  tags: string[]
  matches?: string[]
}

export interface ListUsersQuery {
  tag?: string
  minAge?: number
  maxAge?: number
  limit?: number
  offset?: number
}

/**
 * Lista todos os usuários com filtros opcionais
 */
export const listUsers = async (query?: ListUsersQuery): Promise<UserProfile[]> => {
  try {
    console.log('🔵 [USERS SERVICE] Buscando usuários...')
    console.log('🔵 [USERS SERVICE] Query:', query)
    
    const { data } = await api.get('/users', { params: query })
    console.log('✅ [USERS SERVICE] Usuários encontrados:', data.length)
    return data
  } catch (error: any) {
    console.error('❌ [USERS SERVICE] Erro ao listar usuários:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao listar usuários')
  }
}

/**
 * Busca um usuário específico por ID
 */
export const getUserById = async (id: string): Promise<UserProfile> => {
  try {
    console.log('🔵 [USERS SERVICE] Buscando usuário:', id)
    
    const { data } = await api.get(`/users/${id}`)
    console.log('✅ [USERS SERVICE] Usuário encontrado:', data.id)
    return data
  } catch (error: any) {
    console.error('❌ [USERS SERVICE] Erro ao buscar usuário:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar usuário')
  }
}

/**
 * Busca usuários por tag específica
 */
export const getUsersByTag = async (tag: string): Promise<UserProfile[]> => {
  try {
    console.log('🔵 [USERS SERVICE] Buscando usuários por tag:', tag)
    
    const { data } = await api.get(`/users/by-tag/${tag}`)
    console.log('✅ [USERS SERVICE] Usuários encontrados:', data.length)
    return data
  } catch (error: any) {
    console.error('❌ [USERS SERVICE] Erro ao buscar usuários por tag:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar usuários por tag')
  }
}

