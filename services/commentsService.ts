import { api } from '../config/axiosConnection'
import { FirestoreTimestamp } from '../utils/firestoreUtils'

export interface Comment {
  id: string
  postId: string
  content: string
  authorId: string
  authorName: string
  createdAt: Date | string | FirestoreTimestamp
  updatedAt: Date | string | FirestoreTimestamp
  likes: number
  likedBy: string[]
}

export interface CreateCommentData {
  postId: string
  content: string
}

/**
 * Cria um novo comentário
 */
export const createComment = async (commentData: CreateCommentData): Promise<Comment> => {
  try {
    console.log('🔵 [COMMENTS SERVICE] Criando comentário...')
    console.log('🔵 [COMMENTS SERVICE] Post ID:', commentData.postId)
    
    const { data } = await api.post('/comments', commentData)
    console.log('✅ [COMMENTS SERVICE] Comentário criado com sucesso:', data.id)
    return data
  } catch (error: any) {
    console.error('❌ [COMMENTS SERVICE] Erro ao criar comentário:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao criar comentário')
  }
}

/**
 * Lista comentários de um post
 */
export const listComments = async (postId: string): Promise<Comment[]> => {
  try {
    console.log('🔵 [COMMENTS SERVICE] Buscando comentários do post:', postId)
    
    const { data } = await api.get('/comments', { params: { postId } })
    console.log('✅ [COMMENTS SERVICE] Comentários encontrados:', data.length)
    return data
  } catch (error: any) {
    console.error('❌ [COMMENTS SERVICE] Erro ao listar comentários:', error)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao listar comentários')
  }
}

/**
 * Busca um comentário específico por ID
 */
export const getCommentById = async (id: string): Promise<Comment> => {
  try {
    console.log('🔵 [COMMENTS SERVICE] Buscando comentário:', id)
    
    const { data } = await api.get(`/comments/${id}`)
    console.log('✅ [COMMENTS SERVICE] Comentário encontrado')
    return data
  } catch (error: any) {
    console.error('❌ [COMMENTS SERVICE] Erro ao buscar comentário:', error)
    
    if (error.response?.status === 404) {
      throw new Error('Comentário não encontrado')
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar comentário')
  }
}

/**
 * Atualiza um comentário
 */
export const updateComment = async (id: string, content: string): Promise<Comment> => {
  try {
    console.log('🔵 [COMMENTS SERVICE] Atualizando comentário:', id)
    
    const { data } = await api.patch(`/comments/${id}`, { content })
    console.log('✅ [COMMENTS SERVICE] Comentário atualizado com sucesso')
    return data
  } catch (error: any) {
    console.error('❌ [COMMENTS SERVICE] Erro ao atualizar comentário:', error)
    
    if (error.response?.status === 403) {
      throw new Error('Você só pode atualizar seus próprios comentários')
    }
    
    if (error.response?.status === 404) {
      throw new Error('Comentário não encontrado')
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao atualizar comentário')
  }
}

/**
 * Deleta um comentário
 */
export const deleteComment = async (id: string): Promise<void> => {
  try {
    console.log('🔵 [COMMENTS SERVICE] Deletando comentário:', id)
    
    await api.delete(`/comments/${id}`)
    console.log('✅ [COMMENTS SERVICE] Comentário deletado com sucesso')
  } catch (error: any) {
    console.error('❌ [COMMENTS SERVICE] Erro ao deletar comentário:', error)
    
    if (error.response?.status === 403) {
      throw new Error('Você só pode deletar seus próprios comentários')
    }
    
    if (error.response?.status === 404) {
      throw new Error('Comentário não encontrado')
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao deletar comentário')
  }
}

/**
 * Dá like ou remove like de um comentário
 */
export const likeComment = async (id: string): Promise<Comment> => {
  try {
    console.log('🔵 [COMMENTS SERVICE] Toggle like no comentário:', id)
    
    const { data } = await api.post(`/comments/${id}/like`)
    console.log('✅ [COMMENTS SERVICE] Like atualizado com sucesso')
    return data
  } catch (error: any) {
    console.error('❌ [COMMENTS SERVICE] Erro ao dar like no comentário:', error)
    
    if (error.response?.status === 404) {
      throw new Error('Comentário não encontrado')
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao dar like no comentário')
  }
}

