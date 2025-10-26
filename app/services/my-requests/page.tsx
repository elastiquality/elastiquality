'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Loader2, Calendar, DollarSign, MapPin, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface ServiceRequest {
  id: string
  title: string
  description: string
  category: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  location: {
    district: string
    council: string
    parish: string
  }
  budgetMin: number | null
  budgetMax: number | null
  urgency: 'LOW' | 'MEDIUM' | 'HIGH'
  deadline: string | null
  createdAt: string
  updatedAt: string
}

export default function MyRequestsPage() {
  const { user, userData, loading: authLoading } = useAuth()
  const router = useRouter()
  const [requests, setRequests] = useState<ServiceRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
      return
    }

    if (user) {
      loadMyRequests()
    }
  }, [user, authLoading, router])

  const loadMyRequests = async () => {
    if (!user) return

    try {
      setLoading(true)
      const serviceRequestsRef = collection(db, 'serviceRequests')
      const q = query(
        serviceRequestsRef,
        where('clientId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(q)
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate().toISOString() || '',
        updatedAt: doc.data().updatedAt?.toDate().toISOString() || '',
        deadline: doc.data().deadline?.toDate().toISOString() || null
      })) as ServiceRequest[]

      setRequests(requestsData)
    } catch (err: any) {
      console.error('Error loading requests:', err)
      setError('Erro ao carregar seus pedidos')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não disponível'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { text: 'Pendente', bg: 'bg-yellow-100 text-yellow-800', icon: Clock },
      IN_PROGRESS: { text: 'Em Andamento', bg: 'bg-blue-100 text-blue-800', icon: AlertCircle },
      COMPLETED: { text: 'Concluído', bg: 'bg-green-100 text-green-800', icon: CheckCircle },
      CANCELLED: { text: 'Cancelado', bg: 'bg-red-100 text-red-800', icon: AlertCircle }
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    const Icon = config.icon

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg}`}>
        <Icon className="w-4 h-4 mr-1" />
        {config.text}
      </span>
    )
  }

  const getUrgencyBadge = (urgency: string) => {
    const urgencyConfig = {
      LOW: { text: 'Baixa', color: 'text-green-600' },
      MEDIUM: { text: 'Média', color: 'text-yellow-600' },
      HIGH: { text: 'Alta', color: 'text-red-600' }
    }

    const config = urgencyConfig[urgency as keyof typeof urgencyConfig] || urgencyConfig.MEDIUM

    return (
      <span className={`text-sm font-medium ${config.color}`}>
        Urgência: {config.text}
      </span>
    )
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
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Meus Pedidos
            </h1>
            <p className="text-gray-600">
              Gerencie todas as suas solicitações de serviço
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          )}

          {requests.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nenhum pedido ainda</h3>
              <p className="text-gray-600 mb-6">Você ainda não criou nenhuma solicitação de serviço.</p>
              <button
                onClick={() => router.push('/services/create')}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Criar Primeiro Pedido
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {request.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{request.description}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{request.location.district}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span>
                            {request.budgetMin && request.budgetMax
                              ? `€${request.budgetMin} - €${request.budgetMax}`
                              : request.budgetMin
                              ? `A partir de €${request.budgetMin}`
                              : 'Orçamento a combinar'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(request.createdAt)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end space-y-2">
                      {getStatusBadge(request.status)}
                      {getUrgencyBadge(request.urgency)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <span className="text-sm text-gray-500">
                      Categoria: <span className="font-medium text-gray-900">{request.category}</span>
                    </span>
                    <button
                      onClick={() => router.push(`/services/${request.id}`)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                    >
                      Ver Detalhes →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

