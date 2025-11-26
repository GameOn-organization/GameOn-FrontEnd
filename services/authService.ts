import { getAuth, signInWithCustomToken, GoogleAuthProvider, signInWithCredential } from 'firebase/auth'
import { auth } from '../config/firebase'
import { api } from '../config/axiosConnection'
import * as AuthSession from 'expo-auth-session'
import * as WebBrowser from 'expo-web-browser'
import { Platform } from 'react-native'
import Constants from 'expo-constants'
import { uploadMultipleImages, uploadSingleImage } from './storageService'

// Configurar WebBrowser para fechar após autenticação
WebBrowser.maybeCompleteAuthSession()

// Configurar WebBrowser para fechar após autenticação
WebBrowser.maybeCompleteAuthSession()

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
    
    // Obter userId atual
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('Usuário não autenticado')
    }

    // Fazer upload das imagens se houver
    let processedImages = profileData.images || []
    if (profileData.images && profileData.images.length > 0) {
      console.log('🔵 [AUTH SERVICE] Fazendo upload das imagens...')
      processedImages = await uploadMultipleImages(
        profileData.images,
        `profiles/${currentUser.uid}`
      )
      console.log('✅ [AUTH SERVICE] Upload de imagens concluído')
    }

    // Fazer upload do wallpaper se houver
    let processedWallpaper = profileData.wallpaper
    if (profileData.wallpaper) {
      console.log('🔵 [AUTH SERVICE] Fazendo upload do wallpaper...')
      processedWallpaper = await uploadSingleImage(
        profileData.wallpaper,
        currentUser.uid,
        'wallpaper'
      )
      console.log('✅ [AUTH SERVICE] Upload de wallpaper concluído')
    }

    // Atualizar profileData com as URLs das imagens
    const updatedProfileData = {
      ...profileData,
      images: processedImages,
      wallpaper: processedWallpaper
    }
    
    const { data } = await api.post('/users', updatedProfileData)
    console.log('✅ [AUTH SERVICE] Perfil criado com sucesso:', data.id)
    return data
  } catch (error: any) {
    console.error('❌ [AUTH SERVICE] Erro ao criar perfil:', error)
    console.error('❌ [AUTH SERVICE] Status:', error.response?.status)
    console.error('❌ [AUTH SERVICE] Dados:', error.response?.data)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error(error.message || 'Erro ao criar perfil')
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

/**
 * Faz login com Google usando Firebase Auth
 * Usa o authDomain do Firebase para gerenciar redirects automaticamente
 */
export const loginWithGoogle = async () => {
  try {
    console.log('🔵 [AUTH SERVICE] Iniciando login com Google...')
    
    // Obter Client ID do Firebase (já configurado no Firebase Console)
    // O Firebase gerencia os redirect URIs automaticamente através do authDomain
    const clientId = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID
    
    if (!clientId) {
      // Tentar obter do Firebase config se disponível
      const firebaseConfig = auth.app.options
      console.log('⚠️  [AUTH SERVICE] Client ID não configurado. Configure EXPO_PUBLIC_GOOGLE_CLIENT_ID')
      console.log('⚠️  [AUTH SERVICE] Ou obtenha do Firebase Console: Authentication > Sign-in method > Google > Web client ID')
      throw new Error('Client ID do Google não configurado. Obtenha do Firebase Console em Authentication > Sign-in method > Google')
    }
    
    // Usar o authDomain do Firebase para gerar o redirect URI automaticamente
    // O Firebase já gerencia isso através do authDomain configurado
    const authDomain = auth.app.options.authDomain || 'tcc-gameon.firebaseapp.com'
    
    // Determinar redirect URI usando o proxy do Expo (formato HTTPS que o Google aceita)
    // O Google Cloud Console só aceita URIs HTTPS, não exp://
    let redirectUri: string
    
    if (Platform.OS === 'web') {
      redirectUri = typeof window !== 'undefined' 
        ? `${window.location.protocol}//${authDomain}/__/auth/handler`
        : `http://${authDomain}/__/auth/handler`
    } else {
      // Para mobile, usar o proxy do Expo que gera URI HTTPS
      // O makeRedirectUri com useProxy: true deve gerar um URI HTTPS
      const generatedUri = AuthSession.makeRedirectUri({
        useProxy: true,
        scheme: 'gameon',
      })
      
      // Se o URI gerado começar com exp://, converter para HTTPS
      // O formato exp:// precisa ser convertido para https://auth.expo.io/...
      if (generatedUri && generatedUri.startsWith('exp://')) {
        // Converter exp:// para https:// usando o proxy do Expo
        // O formato exp://li9zhxi-anonymous-8081.exp.direct vira:
        // https://auth.expo.io/@anonymous/gameon (ou similar)
        const expoUsername = Constants.expoConfig?.owner || 'anonymous'
        const projectSlug = Constants.expoConfig?.slug || 'GameOn'
        redirectUri = `https://auth.expo.io/@${expoUsername}/${projectSlug}`
      } else if (generatedUri && generatedUri.startsWith('https://')) {
        // Se já for HTTPS, usar diretamente
        redirectUri = generatedUri
      } else {
        // Fallback: construir manualmente
        const expoUsername = Constants.expoConfig?.owner || 'anonymous'
        const projectSlug = Constants.expoConfig?.slug || 'GameOn'
        redirectUri = `https://auth.expo.io/@${expoUsername}/${projectSlug}`
      }
    }
    
    console.log('🔵 [AUTH SERVICE] Platform:', Platform.OS)
    console.log('🔵 [AUTH SERVICE] Auth Domain:', authDomain)
    console.log('🔵 [AUTH SERVICE] Redirect URI (HTTPS):', redirectUri)
    
    // IMPORTANTE: Adicione este URI no Google Cloud Console
    console.log('⚠️  [AUTH SERVICE] Adicione este Redirect URI no Google Cloud Console:')
    console.log('⚠️  [AUTH SERVICE]', redirectUri)
    
    // Criar requisição de autenticação usando o endpoint do Firebase
    // O Firebase gerencia os redirects através do authDomain
    const discovery = {
      authorizationEndpoint: `https://${authDomain}/__/auth/handler`,
      tokenEndpoint: `https://${authDomain}/__/auth/handler`,
    }
    
    // Alternativamente, usar o endpoint direto do Google com redirect gerenciado pelo Firebase
    const googleDiscovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    }
    
    // Gerar nonce aleatório (obrigatório para responseType IdToken)
    // O nonce é usado para prevenir ataques de replay
    const nonce = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    
    const request = new AuthSession.AuthRequest({
      clientId: clientId,
      scopes: ['openid', 'profile', 'email'],
      responseType: AuthSession.ResponseType.IdToken,
      redirectUri: redirectUri, // URI HTTPS que o Google aceita
      usePKCE: false,
      // Adicionar nonce como parâmetro extra (obrigatório para IdToken)
      extraParams: {
        nonce: nonce,
      },
    })
    
    console.log('🔵 [AUTH SERVICE] Request criado com nonce, abrindo navegador...')
    
    // Iniciar o fluxo de autenticação
    // O Firebase gerencia os redirects através do authDomain configurado
    const result = await request.promptAsync(googleDiscovery, {
      useProxy: Platform.select({
        web: false,
        default: true, // Usar proxy do Expo no mobile (gera URI HTTPS)
      }),
    })
    
    console.log('🔵 [AUTH SERVICE] Resultado da autenticação:', result.type)
    console.log('🔵 [AUTH SERVICE] Result completo:', JSON.stringify(result, null, 2))
    
    if (result.type !== 'success') {
      if (result.type === 'cancel' || result.type === 'dismiss') {
        throw new Error('Login cancelado pelo usuário')
      }
      
      // Log detalhado do erro
      console.error('❌ [AUTH SERVICE] Erro no resultado:', {
        type: result.type,
        error: result.error,
        params: result.params,
        url: result.url,
      })
      
      if (result.error) {
        const errorMsg = typeof result.error === 'string' ? result.error : result.error.message || JSON.stringify(result.error)
        throw new Error(`Erro na autenticação: ${errorMsg}`)
      }
      
      // Verificar se há erro nos params
      if (result.params && result.params.error) {
        const paramError = result.params.error
        console.error('❌ [AUTH SERVICE] Erro nos params:', paramError)
        if (paramError === 'access_denied') {
          throw new Error('Acesso negado pelo Google. Verifique as permissões.')
        }
        throw new Error(`Erro na autenticação: ${paramError}`)
      }
      
      throw new Error(`Falha ao autenticar com Google: ${result.type}`)
    }
    
    // Verificar se result.params existe
    if (!result.params) {
      console.error('❌ [AUTH SERVICE] Result.params está vazio:', result)
      throw new Error('Resposta do Google não contém parâmetros. Tente novamente.')
    }
    
    console.log('🔵 [AUTH SERVICE] Params recebidos:', Object.keys(result.params))
    
    const { id_token, error, error_description } = result.params
    
    if (error) {
      console.error('❌ [AUTH SERVICE] Erro nos params:', error)
      console.error('❌ [AUTH SERVICE] Descrição do erro:', error_description)
      
      if (error === 'access_denied') {
        throw new Error('Acesso negado pelo Google. Verifique as permissões.')
      }
      
      if (error === 'invalid_request') {
        throw new Error('Requisição inválida. Verifique se o Redirect URI está configurado corretamente no Google Cloud Console.')
      }
      
      throw new Error(`Erro na autenticação: ${error}${error_description ? ` - ${error_description}` : ''}`)
    }
    
    if (!id_token) {
      console.error('❌ [AUTH SERVICE] Token não encontrado nos params')
      console.error('❌ [AUTH SERVICE] Params recebidos:', result.params)
      throw new Error('Token do Google não recebido. Verifique se o Redirect URI está configurado corretamente no Google Cloud Console.')
    }
    
    console.log('✅ [AUTH SERVICE] Token do Google recebido')
    console.log('🔵 [AUTH SERVICE] Token (primeiros 50 chars):', id_token.substring(0, 50) + '...')
    
    try {
      // Criar credencial do Google para Firebase
      console.log('🔵 [AUTH SERVICE] Criando credencial do Firebase...')
      const credential = GoogleAuthProvider.credential(id_token)
      
      if (!credential) {
        throw new Error('Falha ao criar credencial do Firebase')
      }
      
      // Autenticar com Firebase usando a credencial do Google
      console.log('🔵 [AUTH SERVICE] Autenticando com Firebase...')
      const userCredential = await signInWithCredential(auth, credential)
      
      if (!userCredential || !userCredential.user) {
        throw new Error('Falha ao autenticar com Firebase')
      }
      
      console.log('✅ [AUTH SERVICE] Firebase autenticado, UID:', userCredential.user.uid)
      
      const idToken = await userCredential.user.getIdToken()
      console.log('✅ [AUTH SERVICE] ID Token obtido do Firebase')
      console.log('✅ [AUTH SERVICE] Login com Google bem-sucedido, UID:', userCredential.user.uid)
      
      // Enviar token para o backend
      console.log('🔵 [AUTH SERVICE] Enviando token para backend...')
      const { data } = await api.post('/auth/google', {
        idToken: idToken
      })
      
      console.log('✅ [AUTH SERVICE] Backend autenticado:', data.user?.uid)
      
      return {
        user: data.user,
        idToken: idToken
      }
    } catch (firebaseError: any) {
      console.error('❌ [AUTH SERVICE] Erro ao autenticar com Firebase:', firebaseError)
      console.error('❌ [AUTH SERVICE] Código do erro:', firebaseError.code)
      console.error('❌ [AUTH SERVICE] Mensagem:', firebaseError.message)
      
      if (firebaseError.code === 'auth/invalid-credential') {
        throw new Error('Credencial do Google inválida. Tente fazer login novamente.')
      }
      
      if (firebaseError.code === 'auth/credential-already-in-use') {
        throw new Error('Esta conta do Google já está associada a outra conta.')
      }
      
      throw new Error(firebaseError.message || 'Erro ao autenticar com Firebase')
    }
  } catch (error: any) {
    console.error('❌ [AUTH SERVICE] Erro no login com Google:', error)
    console.error('❌ [AUTH SERVICE] Código:', error.code)
    console.error('❌ [AUTH SERVICE] Mensagem:', error.message)
    
    // Erros específicos do Firebase Auth
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
      throw new Error('Login cancelado pelo usuário')
    }
    
    if (error.code === 'auth/network-request-failed' || error.code === 'auth/too-many-requests') {
      throw new Error('Problemas de conectividade com o Google. Tente novamente em alguns instantes.')
    }
    
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Popup bloqueado pelo navegador. Permita popups para este site.')
    }
    
    // Erros de rede/timeout
    if (error.code === 'ECONNREFUSED' || error.message?.includes('Network Error') || error.message?.includes('timeout')) {
      throw new Error('Não foi possível conectar ao servidor. Verifique sua conexão com a internet.')
    }
    
    // Erros do backend
    if (error.response) {
      console.error('❌ [AUTH SERVICE] Status:', error.response.status)
      console.error('❌ [AUTH SERVICE] Dados da resposta:', error.response.data)
      
      if (error.response.status === 503 || error.response.status === 502) {
        throw new Error('Serviço temporariamente indisponível. Tente novamente em alguns instantes.')
      }
      
      if (error.response.data?.message) {
        throw new Error(error.response.data.message)
      }
    } else if (error.request) {
      console.error('❌ [AUTH SERVICE] Requisição feita mas sem resposta')
      throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.')
    }
    
    throw new Error(error.message || 'Erro ao fazer login com Google')
  }
}

/**
 * Obtém o perfil do usuário atual
 */
export const getMyProfile = async () => {
  try {
    console.log('🔵 [AUTH SERVICE] Buscando perfil do usuário...')
    const { data } = await api.get('/users/me')
    console.log('✅ [AUTH SERVICE] Perfil encontrado:', data.id)
    return data
  } catch (error: any) {
    console.error('❌ [AUTH SERVICE] Erro ao buscar perfil:', error)
    
    if (error.response?.status === 404) {
      return null // Usuário não tem perfil ainda
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar perfil')
  }
}

/**
 * Atualiza o perfil do usuário atual
 */
export const updateMyProfile = async (profileData: Partial<ProfileData>) => {
  try {
    console.log('🔵 [AUTH SERVICE] Atualizando perfil...')
    console.log('🔵 [AUTH SERVICE] Dados do perfil:', {
      name: profileData.name,
      age: profileData.age,
      tagsCount: profileData.tags?.length || 0,
      imagesCount: profileData.images?.length || 0
    })
    
    // Obter userId atual
    const currentUser = auth.currentUser
    if (!currentUser) {
      throw new Error('Usuário não autenticado')
    }

    // Fazer upload das imagens se houver
    let processedImages = profileData.images
    if (profileData.images && profileData.images.length > 0) {
      console.log('🔵 [AUTH SERVICE] Fazendo upload das imagens...')
      processedImages = await uploadMultipleImages(
        profileData.images,
        `profiles/${currentUser.uid}`
      )
      console.log('✅ [AUTH SERVICE] Upload de imagens concluído')
    }

    // Fazer upload do wallpaper se houver
    let processedWallpaper = profileData.wallpaper
    if (profileData.wallpaper !== undefined) {
      console.log('🔵 [AUTH SERVICE] Fazendo upload do wallpaper...')
      processedWallpaper = await uploadSingleImage(
        profileData.wallpaper,
        currentUser.uid,
        'wallpaper'
      )
      console.log('✅ [AUTH SERVICE] Upload de wallpaper concluído')
    }

    // Atualizar profileData com as URLs das imagens
    const updatedProfileData = {
      ...profileData,
      ...(processedImages !== undefined && { images: processedImages }),
      ...(processedWallpaper !== undefined && { wallpaper: processedWallpaper })
    }
    
    const { data } = await api.patch('/users/me', updatedProfileData)
    console.log('✅ [AUTH SERVICE] Perfil atualizado com sucesso:', data.id)
    return data
  } catch (error: any) {
    console.error('❌ [AUTH SERVICE] Erro ao atualizar perfil:', error)
    console.error('❌ [AUTH SERVICE] Status:', error.response?.status)
    console.error('❌ [AUTH SERVICE] Dados:', error.response?.data)
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error(error.message || 'Erro ao atualizar perfil')
  }
}

/**
 * Verifica se o usuário tem perfil completo
 * Um perfil completo deve ter pelo menos: nome, idade, e tags
 */
export const hasCompleteProfile = (profile: any): boolean => {
  if (!profile) return false
  
  // Verificar se tem campos essenciais preenchidos
  const hasName = profile.name && profile.name.trim() !== ''
  const hasAge = profile.age && profile.age > 0
  const hasTags = profile.tags && profile.tags.length > 0
  
  // Considerar completo se tiver nome, idade e pelo menos uma tag
  return hasName && hasAge && hasTags
}


