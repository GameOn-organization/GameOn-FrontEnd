import { getAuth, signInWithCustomToken } from 'firebase/auth'
import { auth } from '../config/firebase'
import { api } from '../config/axiosConnection'

export interface SignupData {
  email: string
  password: string
  name: string
  age?: number
  phone?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface ProfileData {
  name: string
  age?: number
  email: string
  phone?: string
  descricao?: string
  sexo?: 'm' | 'f' | 'nb'
  localizacao?: string
  images?: (string | null)[]
  wallpaper?: string | null
  tags?: string[]
}

/**
 * Faz signup no backend e autentica o usuário
 */
export const signup = async (signupData: SignupData) => {
  try {
    console.log('🔵 [AUTH SERVICE] Iniciando signup...')
    console.log('🔵 [AUTH SERVICE] URL base:', api.defaults.baseURL)
    console.log('🔵 [AUTH SERVICE] Dados do signup:', {
      email: signupData.email,
      name: signupData.name,
      age: signupData.age,
      phone: signupData.phone ? '***' : undefined,
      password: '***'
    })

    // 1. Criar conta no backend (Firebase Auth)
    console.log('🔵 [AUTH SERVICE] Fazendo POST para /auth/signup...')
    const { data } = await api.post('/auth/signup', {
      email: signupData.email,
      password: signupData.password,
      name: signupData.name,
      age: signupData.age,
      phone: signupData.phone
    })

    console.log('✅ [AUTH SERVICE] Resposta do signup recebida:', {
      hasUser: !!data.user,
      hasCustomToken: !!data.customToken,
      userId: data.user?.uid
    })

    // 2. Trocar customToken por idToken usando Firebase SDK
    console.log('🔵 [AUTH SERVICE] Autenticando com Firebase...')
    await signInWithCustomToken(auth, data.customToken)
    console.log('✅ [AUTH SERVICE] Autenticação Firebase concluída')

    return {
      user: data.user,
      customToken: data.customToken
    }
  } catch (error: any) {
    console.error('❌ [AUTH SERVICE] Erro no signup:', error)
    console.error('❌ [AUTH SERVICE] Tipo do erro:', error.constructor.name)
    console.error('❌ [AUTH SERVICE] Mensagem:', error.message)
    console.error('❌ [AUTH SERVICE] Stack:', error.stack)
    
    if (error.code) {
      console.error('❌ [AUTH SERVICE] Código do erro:', error.code)
    }
    
    if (error.response) {
      console.error('❌ [AUTH SERVICE] Status:', error.response.status)
      console.error('❌ [AUTH SERVICE] Dados da resposta:', error.response.data)
    } else if (error.request) {
      console.error('❌ [AUTH SERVICE] Requisição feita mas sem resposta')
      console.error('❌ [AUTH SERVICE] Request:', error.request)
      console.error('❌ [AUTH SERVICE] Verifique se o backend está rodando em:', api.defaults.baseURL)
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      throw new Error(`Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${api.defaults.baseURL}`)
    }
    
    throw new Error(error.message || 'Erro ao criar conta')
  }
}

/**
 * Faz login no backend e autentica o usuário
 */
export const login = async (loginData: LoginData) => {
  try {
    console.log('🔵 [AUTH SERVICE] Iniciando login...')
    console.log('🔵 [AUTH SERVICE] URL base:', api.defaults.baseURL)
    console.log('🔵 [AUTH SERVICE] Email:', loginData.email)

    // 1. Login no backend
    console.log('🔵 [AUTH SERVICE] Fazendo POST para /auth/login...')
    const { data } = await api.post('/auth/login', {
      email: loginData.email,
      password: loginData.password
    })

    console.log('✅ [AUTH SERVICE] Resposta do login recebida:', {
      hasUser: !!data.user,
      hasCustomToken: !!data.customToken
    })

    // 2. Trocar customToken por idToken usando Firebase SDK
    console.log('🔵 [AUTH SERVICE] Autenticando com Firebase...')
    await signInWithCustomToken(auth, data.customToken)
    console.log('✅ [AUTH SERVICE] Autenticação Firebase concluída')

    return {
      user: data.user,
      customToken: data.customToken
    }
  } catch (error: any) {
    console.error('❌ [AUTH SERVICE] Erro no login:', error)
    console.error('❌ [AUTH SERVICE] Tipo do erro:', error.constructor.name)
    console.error('❌ [AUTH SERVICE] Mensagem:', error.message)
    
    if (error.code) {
      console.error('❌ [AUTH SERVICE] Código do erro:', error.code)
    }
    
    if (error.response) {
      console.error('❌ [AUTH SERVICE] Status:', error.response.status)
      console.error('❌ [AUTH SERVICE] Dados da resposta:', error.response.data)
    } else if (error.request) {
      console.error('❌ [AUTH SERVICE] Requisição feita mas sem resposta')
      console.error('❌ [AUTH SERVICE] Verifique se o backend está rodando em:', api.defaults.baseURL)
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error')) {
      throw new Error(`Não foi possível conectar ao servidor. Verifique se o backend está rodando em ${api.defaults.baseURL}`)
    }
    
    throw new Error(error.message || 'Email ou senha inválidos')
  }
}

/**
 * Cria ou atualiza o perfil do usuário
 */
export const createProfile = async (profileData: ProfileData) => {
  try {
    console.log('🔵 [AUTH SERVICE] Criando perfil...')
    console.log('🔵 [AUTH SERVICE] Dados do perfil:', {
      name: profileData.name,
      age: profileData.age,
      email: profileData.email,
      tagsCount: profileData.tags?.length || 0,
      imagesCount: profileData.images?.length || 0
    })
    
    const { data } = await api.post('/users', profileData)
    console.log('✅ [AUTH SERVICE] Perfil criado com sucesso:', data.id)
    return data
  } catch (error: any) {
    console.error('❌ [AUTH SERVICE] Erro ao criar perfil:', error)
    console.error('❌ [AUTH SERVICE] Status:', error.response?.status)
    console.error('❌ [AUTH SERVICE] Dados:', error.response?.data)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao criar perfil')
  }
}

/**
 * Faz logout
 */
export const logout = async () => {
  try {
    await auth.signOut()
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    throw error
  }
}

/**
 * Verifica se o usuário está autenticado
 */
export const isAuthenticated = () => {
  return auth.currentUser !== null
}

/**
 * Obtém o usuário atual
 */
export const getCurrentUser = () => {
  return auth.currentUser
}


