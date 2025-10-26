'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Send, MessageCircle, User, Loader2 } from 'lucide-react'

interface Message {
  id: string
  roomId: string
  senderId: string
  senderName: string
  text: string
  read: boolean
  createdAt: string
}

interface ChatRoom {
  id: string
  participants: any[]
  requestId?: string
  updatedAt: string
}

export default function ChatListPage() {
  const { user, userData, loading: authLoading } = useAuth()
  const router = useRouter()
  const [rooms, setRooms] = useState<ChatRoom[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
      return
    }

    if (user) {
      loadChatRooms()
    }
  }, [user, authLoading, router])

  const loadChatRooms = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch(`/api/chat?action=rooms&userId=${user.uid}`)
      const data = await response.json()
      
      if (response.ok) {
        setRooms(data.rooms || [])
      }
    } catch (error) {
      console.error('Error loading chat rooms:', error)
    } finally {
      setLoading(false)
    }
  }

  const getOtherParticipant = (room: ChatRoom) => {
    if (!user || !room.participants) return null
    const other = room.participants.find((p: any) => p.userId !== user.uid)
    return other || null
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Conversas</h1>
            <p className="text-gray-600">Suas conversas com clientes e profissionais</p>
          </div>

          {rooms.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhuma conversa</h3>
              <p className="text-gray-600 mb-6">Você ainda não tem conversas iniciadas</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rooms.map((room) => {
                const other = getOtherParticipant(room)
                const lastMessage = (room as any).lastMessage
                
                return (
                  <button
                    key={room.id}
                    onClick={() => router.push(`/chat/${room.id}`)}
                    className="w-full bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-all text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="w-6 h-6 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {other?.name || 'Usuário'}
                          </h3>
                          {lastMessage && (
                            <p className="text-sm text-gray-600 truncate w-64">
                              {lastMessage.text}
                            </p>
                          )}
                        </div>
                      </div>
                      {lastMessage && (
                        <span className="text-xs text-gray-500">
                          {new Date(lastMessage.createdAt).toLocaleDateString('pt-PT')}
                        </span>
                      )}
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

