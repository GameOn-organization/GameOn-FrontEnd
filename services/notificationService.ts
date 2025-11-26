import { api } from '../config/axiosConnection';

export interface Notification {
  id: string;
  userId: string;
  fromUserId: string;
  fromUsername: string;
  fromUserAvatar?: string;
  action: string;
  category: 'MATCH' | 'Equipes' | 'Eventos' | 'Comunidade';
  thumbnail?: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  relatedPostId?: string;
  relatedCommentId?: string;
}

export interface CreateNotificationDto {
  userId: string;
  fromUserId: string;
  fromUsername: string;
  fromUserAvatar?: string;
  action: string;
  category: 'MATCH' | 'Equipes' | 'Eventos' | 'Comunidade';
  thumbnail?: string;
  relatedPostId?: string;
  relatedCommentId?: string;
}

export interface ListNotificationsQuery {
  userId?: string;
  category?: 'MATCH' | 'Equipes' | 'Eventos' | 'Comunidade';
  read?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Busca todas as notificações do usuário autenticado
 */
export const getNotifications = async (query?: ListNotificationsQuery): Promise<Notification[]> => {
  try {
    console.log('🔔 [NOTIFICATION SERVICE] Buscando notificações...');
    console.log('🔔 [NOTIFICATION SERVICE] Query objeto:', query);
    console.log('🔔 [NOTIFICATION SERVICE] Query JSON:', JSON.stringify(query, null, 2));
    console.log('🔔 [NOTIFICATION SERVICE] Query category:', query?.category);
    console.log('🔔 [NOTIFICATION SERVICE] Query category type:', typeof query?.category);
    
    // Garantir que apenas campos definidos sejam enviados
    const params: any = {};
    if (query?.userId) params.userId = query.userId;
    if (query?.category) params.category = query.category;
    if (query?.read !== undefined) params.read = query.read;
    if (query?.limit) params.limit = query.limit;
    if (query?.offset) params.offset = query.offset;
    
    console.log('🔔 [NOTIFICATION SERVICE] Params que serão enviados:', JSON.stringify(params, null, 2));
    
    const response = await api.get('/notifications', { params });
    console.log('🔔 [NOTIFICATION SERVICE] Notificações recebidas:', response.data.length);
    console.log('🔔 [NOTIFICATION SERVICE] Categorias recebidas:', response.data.map((n: Notification) => n.category));
    return response.data;
  } catch (error: any) {
    console.error('🔔 [NOTIFICATION SERVICE] Erro ao buscar notificações:', error);
    if (error.response) {
      console.error('🔔 [NOTIFICATION SERVICE] Erro response:', error.response.data);
    }
    throw error;
  }
};

/**
 * Busca uma notificação específica por ID
 */
export const getNotification = async (id: string): Promise<Notification> => {
  try {
    console.log('🔔 [NOTIFICATION SERVICE] Buscando notificação:', id);
    const response = await api.get(`/notifications/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('🔔 [NOTIFICATION SERVICE] Erro ao buscar notificação:', error);
    throw error;
  }
};

/**
 * Cria uma nova notificação
 */
export const createNotification = async (data: CreateNotificationDto): Promise<Notification> => {
  try {
    console.log('🔔 [NOTIFICATION SERVICE] Criando notificação...', data);
    const response = await api.post('/notifications', data);
    console.log('🔔 [NOTIFICATION SERVICE] Notificação criada:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('🔔 [NOTIFICATION SERVICE] Erro ao criar notificação:', error);
    throw error;
  }
};

/**
 * Marca uma notificação como lida
 */
export const markAsRead = async (id: string): Promise<Notification> => {
  try {
    console.log('🔔 [NOTIFICATION SERVICE] Marcando notificação como lida:', id);
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  } catch (error: any) {
    console.error('🔔 [NOTIFICATION SERVICE] Erro ao marcar como lida:', error);
    throw error;
  }
};

/**
 * Marca todas as notificações do usuário como lidas
 */
export const markAllAsRead = async (): Promise<void> => {
  try {
    console.log('🔔 [NOTIFICATION SERVICE] Marcando todas as notificações como lidas');
    await api.patch('/notifications/mark-all-read');
  } catch (error: any) {
    console.error('🔔 [NOTIFICATION SERVICE] Erro ao marcar todas como lidas:', error);
    throw error;
  }
};

/**
 * Busca a contagem de notificações não lidas
 */
export const getUnreadCount = async (): Promise<number> => {
  try {
    console.log('🔔 [NOTIFICATION SERVICE] Buscando contagem de não lidas');
    const response = await api.get('/notifications/unread-count');
    return response.data;
  } catch (error: any) {
    console.error('🔔 [NOTIFICATION SERVICE] Erro ao buscar contagem:', error);
    throw error;
  }
};

/**
 * Deleta uma notificação
 */
export const deleteNotification = async (id: string): Promise<void> => {
  try {
    console.log('🔔 [NOTIFICATION SERVICE] Deletando notificação:', id);
    await api.delete(`/notifications/${id}`);
  } catch (error: any) {
    console.error('🔔 [NOTIFICATION SERVICE] Erro ao deletar notificação:', error);
    throw error;
  }
};

