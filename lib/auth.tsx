'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  AuthError
} from 'firebase/auth'
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './firebase'
import { User as UserType } from './firestore-collections'

interface SignUpAdditionalData {
  firstName?: string
  lastName?: string
  phone?: string
  location?: any
  serviceDistricts?: string[]
  categories?: string[]
}

interface AuthContextType {
  user: User | null
  userData: UserType | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, name: string, userType: 'CLIENT' | 'PROFESSIONAL', additionalData?: SignUpAdditionalData) => Promise<void>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  updateUserProfile: (data: Partial<UserType>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      setUser(firebaseUser)
      
      if (firebaseUser) {
        // Fetch user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid))
        if (userDoc.exists()) {
          setUserData({ id: firebaseUser.uid, ...userDoc.data() } as UserType)
        } else {
          // Create user document if it doesn't exist
          const newUserData: Omit<UserType, 'id'> = {
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
            email: firebaseUser.email || '',
            userType: 'CLIENT',
            createdAt: new Date(),
            updatedAt: new Date(),
            profile: {}
          }
          
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...newUserData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          })
          
          setUserData({ id: firebaseUser.uid, ...newUserData } as UserType)
        }
      } else {
        setUserData(null)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password)
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error))
    }
  }

  const signUp = async (email: string, password: string, name: string, userType: 'CLIENT' | 'PROFESSIONAL', additionalData?: SignUpAdditionalData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      
      // Update display name
      await updateProfile(userCredential.user, { displayName: name })
      
      // Create user document in Firestore
      const newUser: Omit<UserType, 'id'> = {
        name,
        email,
        userType,
        createdAt: new Date(),
        updatedAt: new Date(),
        profile: {
          phone: additionalData?.phone || '',
          location: additionalData?.location ? {
            district: additionalData.location.district || '',
            council: additionalData.location.council || '',
            parish: additionalData.location.freguesia || '',
            postalCode: additionalData.location.postalCode || ''
          } : undefined
        }
      }
      
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        ...newUser,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      // If professional, create professional document
      if (userType === 'PROFESSIONAL') {
        await setDoc(doc(db, 'professionals', userCredential.user.uid), {
          userId: userCredential.user.uid,
          bio: '',
          specialties: additionalData?.categories || [],
          verified: false,
          rating: 0,
          totalReviews: 0,
          totalCompletedJobs: 0,
          totalEarnings: 0,
          location: additionalData?.location ? {
            district: additionalData.location.district || '',
            council: additionalData.location.council || '',
            parish: additionalData.location.freguesia || ''
          } : {
            district: '',
            council: '',
            parish: ''
          },
          serviceDistricts: additionalData?.serviceDistricts || [],
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error))
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      setUser(null)
      setUserData(null)
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error))
    }
  }

  const resetPassword = async (email: string) => {
    try {
      // Verificar se email é válido
      if (!email || !email.includes('@')) {
        throw new Error('Email inválido')
      }
      
      await sendPasswordResetEmail(auth, email)
    } catch (error: any) {
      // Firebase Auth não revela se email existe por segurança
      // Sempre retorna sucesso mesmo que email não exista
      // Isso é comportamento padrão do Firebase por questões de privacidade
      throw new Error(getAuthErrorMessage(error))
    }
  }

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid))
      
      if (!userDoc.exists()) {
        // Create new user document
        const newUser: Omit<UserType, 'id'> = {
          name: userCredential.user.displayName || userCredential.user.email?.split('@')[0] || 'Usuário',
          email: userCredential.user.email || '',
          userType: 'CLIENT',
          createdAt: new Date(),
          updatedAt: new Date(),
          profile: {
            avatar: userCredential.user.photoURL || ''
          }
        }
        
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          ...newUser,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
      }
    } catch (error: any) {
      throw new Error(getAuthErrorMessage(error))
    }
  }

  const updateUserProfile = async (data: Partial<UserType>) => {
    if (!user) return
    
    try {
      const userRef = doc(db, 'users', user.uid)
      await setDoc(userRef, {
        ...data,
        updatedAt: serverTimestamp()
      }, { merge: true })
      
      // Update local state
      setUserData(prev => prev ? { ...prev, ...data } : null)
    } catch (error: any) {
      throw new Error('Erro ao atualizar perfil')
    }
  }

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    signInWithGoogle,
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Helper function to get user-friendly error messages
function getAuthErrorMessage(error: AuthError): string {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'Usuário não encontrado'
    case 'auth/wrong-password':
      return 'Senha incorreta'
    case 'auth/invalid-credential':
      return 'Email ou senha incorretos'
    case 'auth/email-already-in-use':
      return 'Este email já está em uso'
    case 'auth/invalid-email':
      return 'Email inválido'
    case 'auth/weak-password':
      return 'Senha muito fraca'
    case 'auth/network-request-failed':
      return 'Erro de conexão. Verifique sua internet'
    case 'auth/too-many-requests':
      return 'Muitas tentativas. Tente novamente mais tarde'
    case 'auth/missing-password':
      return 'Senha é obrigatória'
    case 'auth/invalid-credential':
      return 'Email ou senha incorretos'
    default:
      return error.message || 'Erro ao autenticar'
  }
}

