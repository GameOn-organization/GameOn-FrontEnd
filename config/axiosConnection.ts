import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://api-m2z4unnk3a-uc.a.run.app/',
  timeout: 10000,
})

// api.defaults.headers.common['Authorization'] = AUTH_TOKEN;


console.log('Axios carregado!')
console.log('Base URL: ', api.defaults.baseURL)



