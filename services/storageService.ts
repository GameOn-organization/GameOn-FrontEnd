import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import app from '../config/firebase'

const storage = getStorage(app)

/**
 * Faz upload de uma imagem para o Firebase Storage
 * @param uri - URI local da imagem (file://...)
 * @param path - Caminho no Storage (ex: "profiles/userId/image.jpg")
 * @returns URL pública da imagem
 */
export const uploadImage = async (uri: string, path: string): Promise<string> => {
  try {
    console.log('🔵 [STORAGE] Iniciando upload da imagem...')
    console.log('🔵 [STORAGE] URI local:', uri)
    console.log('🔵 [STORAGE] Caminho no Storage:', path)

    // Converter URI local para Blob
    const response = await fetch(uri)
    const blob = await response.blob()
    
    console.log('🔵 [STORAGE] Blob criado:', blob.type, blob.size, 'bytes')

    // Fazer upload para o Firebase Storage
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, blob)
    
    console.log('✅ [STORAGE] Upload concluído')

    // Obter URL pública
    const downloadURL = await getDownloadURL(snapshot.ref)
    console.log('✅ [STORAGE] URL pública obtida:', downloadURL)

    return downloadURL
  } catch (error: any) {
    console.error('❌ [STORAGE] Erro ao fazer upload:', error)
    throw new Error(error.message || 'Erro ao fazer upload da imagem')
  }
}

/**
 * Faz upload de múltiplas imagens
 * @param uris - Array de URIs locais
 * @param basePath - Caminho base no Storage (ex: "profiles/userId")
 * @returns Array de URLs públicas
 */
export const uploadMultipleImages = async (
  uris: (string | null)[],
  basePath: string
): Promise<(string | null)[]> => {
  try {
    console.log('🔵 [STORAGE] Upload de múltiplas imagens...')
    console.log('🔵 [STORAGE] Quantidade:', uris.filter(u => u !== null).length)

    const uploadPromises = uris.map(async (uri, index) => {
      if (!uri) return null
      
      // Se já for uma URL (https://), não precisa fazer upload
      if (uri.startsWith('https://') || uri.startsWith('http://')) {
        console.log('🔵 [STORAGE] Imagem', index, 'já é uma URL pública')
        return uri
      }

      // Gerar nome único para a imagem
      const timestamp = Date.now()
      const fileName = `image_${index}_${timestamp}.jpg`
      const path = `${basePath}/${fileName}`

      return await uploadImage(uri, path)
    })

    const urls = await Promise.all(uploadPromises)
    console.log('✅ [STORAGE] Todas as imagens foram processadas')
    
    return urls
  } catch (error: any) {
    console.error('❌ [STORAGE] Erro ao fazer upload de múltiplas imagens:', error)
    throw new Error(error.message || 'Erro ao fazer upload das imagens')
  }
}

/**
 * Faz upload de uma única imagem (wallpaper, perfil, etc)
 * @param uri - URI local da imagem
 * @param userId - ID do usuário
 * @param imageType - Tipo da imagem (profile, wallpaper, etc)
 * @returns URL pública da imagem ou null se uri for null
 */
export const uploadSingleImage = async (
  uri: string | null,
  userId: string,
  imageType: string
): Promise<string | null> => {
  if (!uri) return null

  // Se já for uma URL (https://), não precisa fazer upload
  if (uri.startsWith('https://') || uri.startsWith('http://')) {
    console.log('🔵 [STORAGE] Imagem já é uma URL pública')
    return uri
  }

  const timestamp = Date.now()
  const fileName = `${imageType}_${timestamp}.jpg`
  const path = `profiles/${userId}/${fileName}`

  return await uploadImage(uri, path)
}

