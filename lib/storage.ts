import { ref, uploadBytes, getDownloadURL, deleteObject, StorageReference } from 'firebase/storage'
import { storage } from './firebase'

/**
 * Upload file to Firebase Storage
 * @param file - File to upload
 * @param path - Storage path (e.g., 'users/{userId}/profile.jpg')
 * @returns Download URL
 */
export async function uploadFile(file: File, path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const url = await getDownloadURL(snapshot.ref)
    return url
  } catch (error: any) {
    console.error('Error uploading file:', error)
    throw new Error(`Erro ao fazer upload do arquivo: ${error.message}`)
  }
}

/**
 * Upload multiple files to Firebase Storage
 * @param files - Array of files to upload
 * @param basePath - Base path for all files (e.g., 'users/{userId}/')
 * @returns Array of download URLs
 */
export async function uploadMultipleFiles(
  files: File[],
  basePath: string
): Promise<string[]> {
  try {
    const uploadPromises = files.map((file, index) => {
      const filePath = `${basePath}${file.name}`
      return uploadFile(file, filePath)
    })
    return await Promise.all(uploadPromises)
  } catch (error: any) {
    console.error('Error uploading multiple files:', error)
    throw new Error(`Erro ao fazer upload dos arquivos: ${error.message}`)
  }
}

/**
 * Delete file from Firebase Storage
 * @param path - Storage path to delete
 */
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  } catch (error: any) {
    console.error('Error deleting file:', error)
    throw new Error(`Erro ao deletar arquivo: ${error.message}`)
  }
}

/**
 * Get download URL from storage path
 * @param path - Storage path
 * @returns Download URL
 */
export async function getFileUrl(path: string): Promise<string> {
  try {
    const storageRef = ref(storage, path)
    const url = await getDownloadURL(storageRef)
    return url
  } catch (error: any) {
    console.error('Error getting file URL:', error)
    throw new Error(`Erro ao obter URL do arquivo: ${error.message}`)
  }
}

/**
 * Upload user profile image
 * @param file - Image file
 * @param userId - User ID
 * @returns Download URL
 */
export async function uploadProfileImage(file: File, userId: string): Promise<string> {
  const timestamp = Date.now()
  const fileName = `profile_${timestamp}.${file.name.split('.').pop()}`
  const path = `users/${userId}/${fileName}`
  return await uploadFile(file, path)
}

/**
 * Upload portfolio image (public)
 * @param file - Image file
 * @param userId - User ID (professional)
 * @returns Download URL
 */
export async function uploadPortfolioImage(file: File, userId: string): Promise<string> {
  const timestamp = Date.now()
  const fileName = `portfolio_${timestamp}.${file.name.split('.').pop()}`
  const path = `portfolio/${userId}/${fileName}`
  return await uploadFile(file, path)
}

/**
 * Upload professional certificate/document
 * @param file - Document file
 * @param userId - User ID
 * @returns Download URL
 */
export async function uploadCertificate(file: File, userId: string): Promise<string> {
  const fileName = file.name
  const path = `professionals/${userId}/${fileName}`
  return await uploadFile(file, path)
}

/**
 * Upload service request attachment
 * @param file - File to attach
 * @param requestId - Service request ID
 * @returns Download URL
 */
export async function uploadServiceAttachment(file: File, requestId: string): Promise<string> {
  const fileName = file.name
  const path = `serviceRequests/${requestId}/${fileName}`
  return await uploadFile(file, path)
}

