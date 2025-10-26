// Server-side Firebase Admin configuration
import { initializeApp, cert, getApps, App } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

// Initialize Firebase Admin
let adminApp: App | undefined

if (!getApps().length) {
  try {
    adminApp = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      }),
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET,
    })
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error)
    // Fallback for development
    if (process.env.NODE_ENV === 'development') {
      console.log('Firebase Admin not configured. Using client SDK fallback.')
    }
  }
} else {
  adminApp = getApps()[0]
}

// Initialize Admin services
export const adminAuth = adminApp ? getAuth(adminApp) : null
export const adminDb = adminApp ? getFirestore(adminApp) : null
export const adminStorage = adminApp ? getStorage(adminApp) : null

export default adminApp

