import { api } from '../config/axiosConnection'
import { FirestoreTimestamp } from '../utils/firestoreUtils'

export interface EventLocation {
  latitude: number
  longitude: number
  cep?: string
  rua?: string
  numero?: string
  bairro?: string
  cidade?: string
  estado?: string
  // Campo combinado para retrocompatibilidade
  address?: string
}

export interface Event {
  id: string
  title: string
  description: string
  price: string
  rating: number
  distance?: string
  image?: string
  imagePlaceholderText?: string
  imagePlaceholderSubtext?: string
  location: EventLocation
  eventType: 'physical' | 'digital'
  category: string
  date: Date | string | FirestoreTimestamp
  endDate?: Date | string | FirestoreTimestamp
  maxParticipants?: number
  participants: string[]
  creatorId: string
  creatorName: string
  createdAt: Date | string | FirestoreTimestamp
  updatedAt: Date | string | FirestoreTimestamp
  isActive: boolean
  markerColor?: string
}

export interface CreateEventData {
  title: string
  description: string
  price: string
  image?: string
  imagePlaceholderText?: string
  imagePlaceholderSubtext?: string
  location: EventLocation
  eventType?: 'physical' | 'digital'
  category?: string
  date: Date | string
  endDate?: Date | string
  maxParticipants?: number
  markerColor?: string
}

export interface UpdateEventData {
  title?: string
  description?: string
  price?: string
  image?: string
  imagePlaceholderText?: string
  imagePlaceholderSubtext?: string
  location?: EventLocation
  eventType?: 'physical' | 'digital'
  category?: string
  date?: Date | string
  endDate?: Date | string
  maxParticipants?: number
  markerColor?: string
}

export interface ListEventsQuery {
  creatorId?: string
  eventType?: 'physical' | 'digital'
  category?: string
  minDate?: Date | string
  maxDate?: Date | string
  isActive?: boolean
  lat?: number
  lng?: number
  radius?: number
  orderBy?: 'createdAt' | 'date' | 'rating' | 'participants'
  orderDirection?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

/**
 * Cria um novo evento
 */
export const createEvent = async (eventData: CreateEventData): Promise<Event> => {
  try {
    console.log('[EVENTS SERVICE] Criando evento...')
    console.log('[EVENTS SERVICE] Titulo:', eventData.title)
    console.log('[EVENTS SERVICE] Imagem URL:', eventData.image || 'SEM IMAGEM')
    console.log('[EVENTS SERVICE] Dados completos:', JSON.stringify(eventData, null, 2))

    const { data } = await api.post('/events', eventData)
    console.log('[EVENTS SERVICE] Evento criado com sucesso:', data.id)
    console.log('[EVENTS SERVICE] Evento retornado tem imagem?', data.image ? 'SIM' : 'NÃO')
    if (data.image) {
      console.log('[EVENTS SERVICE] URL da imagem no evento:', data.image)
    }
    return data
  } catch (error: any) {
    console.error('[EVENTS SERVICE] Erro ao criar evento:', error)

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao criar evento')
  }
}

/**
 * Lista todos os eventos com filtros opcionais
 */
export const listEvents = async (query?: ListEventsQuery): Promise<Event[]> => {
  try {
    console.log('[EVENTS SERVICE] Buscando eventos...')

    const { data } = await api.get('/events', { params: query })
    console.log('[EVENTS SERVICE] Eventos encontrados:', data.length)
    return data
  } catch (error: any) {
    console.error('[EVENTS SERVICE] Erro ao listar eventos:', error)

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao listar eventos')
  }
}

/**
 * Lista os eventos criados pelo usuário atual
 */
export const getMyEvents = async (query?: ListEventsQuery): Promise<Event[]> => {
  try {
    console.log('[EVENTS SERVICE] Buscando meus eventos...')

    const { data } = await api.get('/events/my-events', { params: query })
    console.log('[EVENTS SERVICE] Meus eventos encontrados:', data.length)
    return data
  } catch (error: any) {
    console.error('[EVENTS SERVICE] Erro ao buscar meus eventos:', error)

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar meus eventos')
  }
}

/**
 * Lista os eventos em que o usuário está inscrito
 */
export const getSubscribedEvents = async (): Promise<Event[]> => {
  try {
    console.log('[EVENTS SERVICE] Buscando eventos inscritos...')

    const { data } = await api.get('/events/subscribed')
    console.log('[EVENTS SERVICE] Eventos inscritos encontrados:', data.length)
    return data
  } catch (error: any) {
    console.error('[EVENTS SERVICE] Erro ao buscar eventos inscritos:', error)

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar eventos inscritos')
  }
}

/**
 * Busca um evento específico por ID
 */
export const getEventById = async (id: string): Promise<Event> => {
  try {
    console.log('[EVENTS SERVICE] Buscando evento:', id)

    const { data } = await api.get(`/events/${id}`)
    console.log('[EVENTS SERVICE] Evento encontrado')
    return data
  } catch (error: any) {
    console.error('[EVENTS SERVICE] Erro ao buscar evento:', error)

    if (error.response?.status === 404) {
      throw new Error('Evento nao encontrado')
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar evento')
  }
}

/**
 * Atualiza um evento
 */
export const updateEvent = async (id: string, eventData: UpdateEventData): Promise<Event> => {
  try {
    console.log('[EVENTS SERVICE] Atualizando evento:', id)

    const { data } = await api.patch(`/events/${id}`, eventData)
    console.log('[EVENTS SERVICE] Evento atualizado com sucesso')
    return data
  } catch (error: any) {
    console.error('[EVENTS SERVICE] Erro ao atualizar evento:', error)

    if (error.response?.status === 404) {
      throw new Error('Evento nao encontrado')
    }

    if (error.response?.status === 403) {
      throw new Error('Voce so pode editar eventos que voce criou')
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao atualizar evento')
  }
}

/**
 * Deleta um evento
 */
export const deleteEvent = async (id: string): Promise<void> => {
  try {
    console.log('[EVENTS SERVICE] Deletando evento:', id)

    await api.delete(`/events/${id}`)
    console.log('[EVENTS SERVICE] Evento deletado com sucesso')
  } catch (error: any) {
    console.error('[EVENTS SERVICE] Erro ao deletar evento:', error)

    if (error.response?.status === 404) {
      throw new Error('Evento nao encontrado')
    }

    if (error.response?.status === 403) {
      throw new Error('Voce so pode deletar eventos que voce criou')
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao deletar evento')
  }
}

/**
 * Inscreve o usuário em um evento
 */
export const subscribeToEvent = async (id: string): Promise<Event> => {
  try {
    console.log('[EVENTS SERVICE] Inscrevendo no evento:', id)

    const { data } = await api.post(`/events/${id}/subscribe`)
    console.log('[EVENTS SERVICE] Inscrito com sucesso')
    return data
  } catch (error: any) {
    console.error('[EVENTS SERVICE] Erro ao se inscrever no evento:', error)

    if (error.response?.status === 404) {
      throw new Error('Evento nao encontrado')
    }

    if (error.response?.status === 403) {
      throw new Error(error.response.data.message || 'Nao foi possivel se inscrever no evento')
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao se inscrever no evento')
  }
}

/**
 * Remove inscrição do usuário de um evento
 */
export const unsubscribeFromEvent = async (id: string): Promise<Event> => {
  try {
    console.log('[EVENTS SERVICE] Removendo inscricao do evento:', id)

    const { data } = await api.post(`/events/${id}/unsubscribe`)
    console.log('[EVENTS SERVICE] Inscricao removida com sucesso')
    return data
  } catch (error: any) {
    console.error('[EVENTS SERVICE] Erro ao remover inscricao:', error)

    if (error.response?.status === 404) {
      throw new Error('Evento nao encontrado')
    }

    if (error.response?.status === 403) {
      throw new Error('Voce nao esta inscrito neste evento')
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao remover inscricao')
  }
}

/**
 * Avalia um evento
 */
export const rateEvent = async (id: string, rating: number): Promise<Event> => {
  try {
    console.log('[EVENTS SERVICE] Avaliando evento:', id, 'com nota:', rating)

    const { data } = await api.post(`/events/${id}/rate`, { rating })
    console.log('[EVENTS SERVICE] Evento avaliado com sucesso')
    return data
  } catch (error: any) {
    console.error('[EVENTS SERVICE] Erro ao avaliar evento:', error)

    if (error.response?.status === 404) {
      throw new Error('Evento nao encontrado')
    }

    if (error.response?.status === 403) {
      throw new Error('Voce precisa estar inscrito no evento para avalia-lo')
    }

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao avaliar evento')
  }
}

/**
 * Busca eventos por localização (dentro de um raio)
 */
export const getEventsByLocation = async (
  lat: number,
  lng: number,
  radiusKm: number = 10
): Promise<Event[]> => {
  try {
    console.log('[EVENTS SERVICE] Buscando eventos por localizacao:', lat, lng, 'raio:', radiusKm, 'km')

    const { data } = await api.get('/events', {
      params: {
        lat,
        lng,
        radius: radiusKm,
        isActive: true,
        orderBy: 'date',
        orderDirection: 'asc'
      }
    })
    console.log('[EVENTS SERVICE] Eventos encontrados na area:', data.length)
    return data
  } catch (error: any) {
    console.error('[EVENTS SERVICE] Erro ao buscar eventos por localizacao:', error)

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar eventos por localizacao')
  }
}

/**
 * Busca eventos físicos (para mostrar no mapa)
 */
export const getPhysicalEvents = async (): Promise<Event[]> => {
  try {
    console.log('[EVENTS SERVICE] Buscando eventos fisicos...')

    const { data } = await api.get('/events', {
      params: {
        eventType: 'physical',
        isActive: true,
        orderBy: 'date',
        orderDirection: 'asc'
      }
    })
    console.log('[EVENTS SERVICE] Eventos fisicos encontrados:', data.length)
    return data
  } catch (error: any) {
    console.error('[EVENTS SERVICE] Erro ao buscar eventos fisicos:', error)

    if (error.response?.data?.message) {
      throw new Error(error.response.data.message)
    }
    throw new Error('Erro ao buscar eventos fisicos')
  }
}