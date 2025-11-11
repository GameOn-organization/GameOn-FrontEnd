import axios from 'axios'
import { auth } from './firebase'
import Constants from 'expo-constants'

// Função para determinar a URL base do backend
const getBaseURL = () => {
  // Se estiver em produção, usar a URL de produção
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL
  }
  
  // Para desenvolvimento local:
  // - Se estiver rodando no web, usar localhost
  // - Se estiver rodando no dispositivo/emulador, usar o IP da máquina
  
  // IP da máquina na rede local (ajuste conforme necessário)
  // Você pode descobrir seu IP com: hostname -I ou ipconfig (Windows) / ifconfig (Linux/Mac)
  const LOCAL_IP = '192.168.15.8' //  ATUALIZE ESTE IP COM O IP DA SUA MÁQUINA
  
  // Verifica se está rodando no web
  const isWeb = Constants.platform?.web !== undefined
  
  if (isWeb) {
    return 'http://localhost:3000'
  } else {
    // Para dispositivo físico ou emulador, usar o IP da rede local
    return `http://${LOCAL_IP}:3000`
  }
}

const BASE_URL = getBaseURL()

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para adicionar token automaticamente nas requisições
api.interceptors.request.use(
  async (config) => {
    try {
      console.log(' [AXIOS] Requisição:', config.method?.toUpperCase(), config.url)
      console.log(' [AXIOS] URL completa:', `${config.baseURL}${config.url}`)
      console.log(' [AXIOS] Dados:', config.data ? JSON.stringify(config.data).substring(0, 200) : 'sem dados')
      
      const user = auth.currentUser
      if (user) {
        const idToken = await user.getIdToken()
        config.headers.Authorization = `Bearer ${idToken}`
        console.log(' [AXIOS] Token adicionado ao header')
      } else {
        console.log(' [AXIOS] Usuário não autenticado, requisição sem token')
      }
    } catch (error) {
      console.error(' [AXIOS] Erro ao obter token:', error)
    }
    return config
  },
  (error) => {
    console.error(' [AXIOS] Erro no interceptor de requisição:', error)
    return Promise.reject(error)
  }
)

// Interceptor para tratar erros de resposta
api.interceptors.response.use(
  (response) => {
    console.log(' [AXIOS] Resposta recebida:', response.status, response.config.url)
    return response
  },
  async (error) => {
    console.error(' [AXIOS] Erro na resposta:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      code: error.code
    })
    
    if (error.response?.status === 401) {
      console.log(' [AXIOS] Token inválido ou expirado')
      // Aqui você pode redirecionar para login se necessário
    }
    
    if (!error.response && error.request) {
      console.error(' [AXIOS] Sem resposta do servidor. Verifique se está rodando em:', api.defaults.baseURL)
    }
    
    return Promise.reject(error)
  }
)

console.log(' [AXIOS CONFIG] Axios carregado!')
console.log(' [AXIOS CONFIG] Base URL configurada:', api.defaults.baseURL)
console.log(' [AXIOS CONFIG] Platform:', Constants.platform)
console.log(' [AXIOS CONFIG] Se não conectar, verifique se o IP está correto e se o backend está rodando')



