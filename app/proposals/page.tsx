'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Loader2, DollarSign, Calendar, User, CheckCircle, XCircle, Clock } from 'lucide-react'

interface Proposal {
  id: string
  requestId: string
  professionalId: string
  professionalName: string
  price: number
  description: string
  estimatedTime: string
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN'
  createdAt: string
  updatedAt: string
}

interface ServiceRequest {
  id: string
  title: string
  category: string
  status: string
}

export default function ProposalsPage() {
  const { user, userData, loading: authLoading } = useAuth()
  const router = useRouter()
  const [proposals, setProposals] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
      return
    }

    if (user) {
      loadProposals()
    }
  }, [user, authLoading, router])

  const loadProposals = async () => {
    if (!user || !userData) return

    try {
      setLoading(true)
      const proposalsRef = collection(db, 'proposals')
      
      if (userData.userType === 'CLIENT') {
        // Cliente: ver propostas para seus pedidos
        const requestsRef = collection(db, 'serviceRequests')
        const requestsQuery = query(requestsRef, where('clientId', '==', user.uid))
        const requestsSnapshot = await getDocs(requestsQuery)
        const requestIds = requestsSnapshot.docs.map(d => d.id)
        
        if (requestIds.length > 0) {
          const proposalsData: any[] = []
          
          for (const requestId of requestIds) {
            const proposalsQuery = query(
              proposalsRef,
              where('requestId', '==', requestId)
            )
            const proposalsSnapshot = await getDocs(proposalsQuery)
            
            for (const proposalDoc of proposalsSnapshot.docs) {
              const proposalData = proposalDoc.data()
              const requestDoc = await getDoc(doc(db, 'serviceRequests', requestId))
              
              proposalsData.push({
                id: proposalDoc.id,
                ...proposalData,
                serviceRequest: requestDoc.exists() ? requestDoc.data() : null,
                createdAt: proposalData.createdAt?.toDate().toISOString() || '',
                updatedAt: proposalData.updatedAt?.toDate().toISOString() || ''
              })
            }
          }
          
          setProposals(proposalsData)
        }
      } else if (userData.userType === 'PROFESSIONAL') {
        // Profissional: ver propostas enviadas
        const proposalsQuery = query(
          proposalsRef,
          where('professionalId', '==', user.uid)
        )
        const proposalsSnapshot = await getDocs(proposalsQuery)
        
        const proposalsData: any[] = []
        
        for (const proposalDoc of proposalsSnapshot.docs) {
          const proposalData = proposalDoc.data()
          const requestDoc = await getDoc(doc(db, 'serviceRequests', proposalData.requestId))
          
          proposalsData.push({
            id: proposalDoc.id,
            ...proposalData,
            serviceRequest: requestDoc.exists() ? requestDoc.data() : null,
            createdAt: proposalData.createdAt?.toDate().toISOString() || '',
            updatedAt: proposalData.updatedAt?.toDate().toISOString() || ''
          })
        }
        
        setProposals(proposalsData)
      }
    } catch (err: any) {
      console.error('Error loading proposals:', err)
      setError('Erro ao carregar propostas')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = async (proposalId: string) => {
    if (!confirm('Tem certeza que deseja aceitar esta proposta?')) return

    try {
      const response = await fetch('/api/proposals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, status: 'ACCEPTED' })
      })

      if (!response.ok) throw new Error('Erro ao aceitar proposta')
      
      loadProposals()
    } catch (err: any) {
      alert('Erro ao aceitar proposta: ' + err.message)
    }
  }

  const handleReject = async (proposalId: string) => {
    if (!confirm('Tem certeza que deseja rejeitar esta proposta?')) return

    try {
      const response = await fetch('/api/proposals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ proposalId, status: 'REJECTED' })
      })

      if (!response.ok) throw new Error('Erro ao rejeitar proposta')
      
      loadProposals()
    } catch (err: any) {
      alert('Erro ao rejeitar proposta: ' + err.message)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { text: 'Pendente', bg: 'bg-yellow-100 text-yellow-800', icon: Clock },
      ACCEPTED: { text: 'Aceita', bg: 'bg-green-100 text-green-800', icon: CheckCircle },
      REJECTED: { text: 'Rejeitada', bg: 'bg-red-100 text-red-800', icon: XCircle },
      WITHDRAWN: { text: 'Retirada', bg: 'bg-gray-100 text-gray-800', icon: XCircle }
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

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Data não disponível'
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-PT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!user || !userData) {
    return null
  }

  const isClient = userData.userType === 'CLIENT'
  const isProfessional = userData.userType === 'PROFESSIONAL'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isClient ? 'Propostas Recebidas' : 'Minhas Propostas'}
            </h1>
            <p className="text-gray-600">
              {isClient 
                ? 'Gerencie as propostas recebidas para seus pedidos' 
                : 'Visualize as propostas que você enviou'}
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {proposals.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma proposta ainda
              </h3>
              <p className="text-gray-600 mb-6">
                {isClient 
                  ? 'Você ainda não recebeu propostas para seus pedidos.'
                  : 'Você ainda não enviou nenhuma proposta.'}
              </p>
              {isProfessional && (
                <button
                  onClick={() => router.push('/services')}
                  className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Ver Pedidos Disponíveis
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      {proposal.serviceRequest && (
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {proposal.serviceRequest.title}
                        </h3>
                      )}
                      
                      <div className="flex items-center space-x-4 mb-3 text-sm text-gray-600">
                        {isClient && (
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{proposal.professionalName}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-gray-900">€{proposal.price}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{proposal.estimatedTime}</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-2">{proposal.description}</p>
                      
                      {proposal.serviceRequest && (
                        <p className="text-sm text-gray-500">
                          Categoria: {proposal.serviceRequest.category}
                        </p>
                      )}
                    </div>

                    {getStatusBadge(proposal.status)}
                  </div>

                  {isClient && proposal.status === 'PENDING' && (
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-500">
                        Enviada em {formatDate(proposal.createdAt)}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleReject(proposal.id)}
                          className="px-4 py-2 border border-gray-300 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Rejeitar
                        </button>
                        <button
                          onClick={() => handleAccept(proposal.id)}
                          className="px-4 py-2 bg-primary-600 text-white hover:bg-primary-700 rounded-lg transition-colors"
                        >
                          Aceitar
                        </button>
                      </div>
                    </div>
                  )}

                  {proposal.status !== 'PENDING' && (
                    <div className="pt-4 border-t border-gray-200">
                      <span className="text-sm text-gray-500">
                        {proposal.status === 'ACCEPTED' ? 'Proposta aceita em' : 
                         proposal.status === 'REJECTED' ? 'Proposta rejeitada em' : 
                         'Proposta retirada em'} {formatDate(proposal.updatedAt)}
                      </span>
                    </div>
                  )}
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

