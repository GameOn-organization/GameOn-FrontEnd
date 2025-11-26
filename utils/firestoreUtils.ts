/**
 * Utilitários para trabalhar com dados do Firestore
 */

export interface FirestoreTimestamp {
  _seconds: number
  _nanoseconds: number
}

/**
 * Converte uma data do Firestore para Date JavaScript
 * @param date - Pode ser Date, string ISO, ou Firestore Timestamp
 * @returns Date JavaScript válido
 */
export function convertFirestoreDate(date: Date | string | FirestoreTimestamp | any): Date {
  // Já é um objeto Date
  if (date instanceof Date) {
    return date;
  }
  
  // É um Timestamp do Firestore
  if (date && typeof date === 'object' && '_seconds' in date) {
    return new Date(date._seconds * 1000);
  }
  
  // É uma string (ISO date)
  if (typeof date === 'string') {
    return new Date(date);
  }
  
  // Fallback: retorna data atual se formato desconhecido
  console.warn('Formato de data desconhecido:', date);
  return new Date();
}

/**
 * Formata uma data em formato relativo (agora, 5m, 2h, 3d, etc)
 * @param date - Data a ser formatada
 * @returns String formatada em português
 */
export function formatRelativeDate(date: Date | string | FirestoreTimestamp | any): string {
  const postDate = convertFirestoreDate(date);
  const now = new Date();
  const diffInMs = now.getTime() - postDate.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (diffInMinutes < 1) return "agora";
  if (diffInMinutes < 60) return `${diffInMinutes}m`;
  if (diffInHours < 24) return `${diffInHours}h`;
  if (diffInDays < 7) return `${diffInDays}d`;
  
  return postDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

/**
 * Formata uma data em formato completo
 * @param date - Data a ser formatada
 * @returns String formatada (ex: "20 de nov. de 2025, 18:30")
 */
export function formatFullDate(date: Date | string | FirestoreTimestamp | any): string {
  const postDate = convertFirestoreDate(date);
  
  return postDate.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formata uma data em formato curto
 * @param date - Data a ser formatada
 * @returns String formatada (ex: "20/11/2025")
 */
export function formatShortDate(date: Date | string | FirestoreTimestamp | any): string {
  const postDate = convertFirestoreDate(date);
  
  return postDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

