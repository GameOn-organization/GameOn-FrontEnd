import { api } from '../config/axiosConnection'
import { FirestoreTimestamp } from '../utils/firestoreUtils'

export interface Post {
  id: string
  content: string
  authorId: string
  authorName: string
  authorImage?: string | null
  createdAt: Date | string | FirestoreTimestamp
  updatedAt: Date | string | FirestoreTimestamp
  likes: number
  likedBy: string[]
  comments: number
  shares: number
}

export interface CreatePostData {
  content: string
}

export interface ListPostsQuery {
  authorId?: string
  minDate?: Date
  maxDate?: Date
  orderBy?: 'createdAt' | 'likes' | 'comments'
  orderDirection?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

/**
 * Cria um novo post
 */
export const createPost = async (postData: CreatePostData): Promise<Post> => {
  try {
    console.log('🔵 [POSTS SERVICE] Criando post...')
    console.log('🔵 [POSTS SERVICE] Conteúdo:', postData.content.substring(0, 50))
    
    const { data } = await api.post('/posts', postData)
    console.log('✅ [POSTS SERVICE] Post criado com sucesso:', data.id)
    return data
  } catch (error: any) {
    console.error('❌ [POSTS SERVICE] Erro ao criar post:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao criar post')
  }
}

/**
 * Lista todos os posts com filtros opcionais
 */
export const listPosts = async (query?: ListPostsQuery): Promise<Post[]> => {
  try {
    console.log('🔵 [POSTS SERVICE] Buscando posts...')
    
    const { data } = await api.get('/posts', { params: query })
    console.log('✅ [POSTS SERVICE] Posts encontrados:', data.length)
    return data
  } catch (error: any) {
    console.error('❌ [POSTS SERVICE] Erro ao listar posts:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao listar posts')
  }
}

/**
 * Lista os posts do usuário atual
 */
export const getMyPosts = async (query?: ListPostsQuery): Promise<Post[]> => {
  try {
    console.log('🔵 [POSTS SERVICE] Buscando meus posts...')
    
    const { data } = await api.get('/posts/my-posts', { params: query })
    console.log('✅ [POSTS SERVICE] Meus posts encontrados:', data.length)
    return data
  } catch (error: any) {
    console.error('❌ [POSTS SERVICE] Erro ao buscar meus posts:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar meus posts')
  }
}

/**
 * Busca um post específico por ID
 */
export const getPostById = async (id: string): Promise<Post> => {
  try {
    console.log('🔵 [POSTS SERVICE] Buscando post:', id)
    
    const { data } = await api.get(`/posts/${id}`)
    console.log('✅ [POSTS SERVICE] Post encontrado')
    return data
  } catch (error: any) {
    console.error('❌ [POSTS SERVICE] Erro ao buscar post:', error)
    
    if (error.response?.status === 404) {
      throw new Error('Post não encontrado')
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar post')
  }
}

/**
 * Atualiza um post
 */
export const updatePost = async (id: string, content: string): Promise<Post> => {
  try {
    console.log('🔵 [POSTS SERVICE] Atualizando post:', id)
    
    const { data } = await api.patch(`/posts/${id}`, { content })
    console.log('✅ [POSTS SERVICE] Post atualizado com sucesso')
    return data
  } catch (error: any) {
    console.error('❌ [POSTS SERVICE] Erro ao atualizar post:', error)
    
    if (error.response?.status === 404) {
      throw new Error('Post não encontrado')
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao atualizar post')
  }
}

/**
 * Deleta um post
 */
export const deletePost = async (id: string): Promise<void> => {
  try {
    console.log('🔵 [POSTS SERVICE] Deletando post:', id)
    
    await api.delete(`/posts/${id}`)
    console.log('✅ [POSTS SERVICE] Post deletado com sucesso')
  } catch (error: any) {
    console.error('❌ [POSTS SERVICE] Erro ao deletar post:', error)
    
    if (error.response?.status === 404) {
      throw new Error('Post não encontrado')
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao deletar post')
  }
}

/**
 * Deleta um post do usuário atual (com verificação de propriedade)
 */
export const deleteMyPost = async (id: string): Promise<void> => {
  try {
    console.log('🔵 [POSTS SERVICE] Deletando meu post:', id)
    
    await api.delete(`/posts/my-posts/${id}`)
    console.log('✅ [POSTS SERVICE] Meu post deletado com sucesso')
  } catch (error: any) {
    console.error('❌ [POSTS SERVICE] Erro ao deletar meu post:', error)
    
    if (error.response?.status === 403) {
      throw new Error('Você só pode deletar seus próprios posts')
    }
    
    if (error.response?.status === 404) {
      throw new Error('Post não encontrado')
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao deletar post')
  }
}

/**
 * Dá like ou remove like de um post
 */
export const likePost = async (id: string): Promise<Post> => {
  try {
    console.log('🔵 [POSTS SERVICE] Toggle like no post:', id)
    
    const { data } = await api.post(`/posts/${id}/like`)
    console.log('✅ [POSTS SERVICE] Like atualizado com sucesso')
    return data
  } catch (error: any) {
    console.error('❌ [POSTS SERVICE] Erro ao dar like no post:', error)
    
    if (error.response?.status === 404) {
      throw new Error('Post não encontrado')
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao dar like no post')
  }
}

