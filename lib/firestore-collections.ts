// Firestore collections and document types
// This file defines the structure of our Firestore database

export interface User {
  id: string
  name: string
  email: string
  userType: 'CLIENT' | 'PROFESSIONAL'
  createdAt: Date
  updatedAt: Date
  profile?: {
    phone?: string
    avatar?: string
    bio?: string
    location?: {
      district: string
      council: string
      parish: string
      postalCode?: string
    }
  }
}

export interface Professional {
  userId: string
  bio: string
  specialties: string[]
  serviceDistricts: string[] // Districts where professional is willing to serve
  verified: boolean
  rating: number
  totalReviews: number
  totalCompletedJobs: number
  totalEarnings: number
  subscription?: {
    plan: 'BASIC' | 'PREMIUM' | 'PRO'
    status: 'ACTIVE' | 'CANCELLED' | 'EXPIRED'
    currentPeriodEnd: Date
  }
  location: {
    district: string
    council: string
    parish: string
  }
  certifications?: {
    name: string
    issuer: string
    issueDate: Date
    expiryDate?: Date
    fileUrl?: string
  }[]
  portfolio?: {
    title: string
    description: string
    images: string[]
    category: string
    completedDate: Date
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface ServiceRequest {
  id: string
  clientId: string
  title: string
  description: string
  category: string
  budgetMin?: number
  budgetMax?: number
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  location: {
    district: string
    council: string
    parish: string
    postalCode?: string
  }
  images?: string[]
  urgency: 'LOW' | 'MEDIUM' | 'HIGH'
  deadline?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Proposal {
  id: string
  requestId: string
  professionalId: string
  professionalName: string
  price: number
  description: string
  estimatedTime: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
  attachments?: string[]
  createdAt: Date
  updatedAt: Date
}

export interface Message {
  id: string
  roomId: string
  senderId: string
  senderName: string
  text: string
  read: boolean
  attachments?: string[]
  createdAt: Date
}

export interface ChatRoom {
  id: string
  participants: {
    userId: string
    name: string
    type: 'CLIENT' | 'PROFESSIONAL'
  }[]
  requestId?: string
  lastMessage?: {
    text: string
    timestamp: Date
    senderId: string
  }
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'MESSAGE' | 'PROPOSAL' | 'REQUEST_ACCEPTED' | 'PAYMENT' | 'SYSTEM'
  title: string
  body: string
  read: boolean
  data?: Record<string, any>
  createdAt: Date
}

export interface SubscriptionPlan {
  id: 'BASIC' | 'PREMIUM' | 'PRO'
  name: string
  price: number
  features: string[]
  stripePriceId: string
}

// Collection names
export const COLLECTIONS = {
  USERS: 'users',
  PROFESSIONALS: 'professionals',
  SERVICE_REQUESTS: 'serviceRequests',
  PROPOSALS: 'proposals',
  MESSAGES: 'messages',
  CHAT_ROOMS: 'chatRooms',
  NOTIFICATIONS: 'notifications',
  SUBSCRIPTION_PLANS: 'subscriptionPlans',
} as const

