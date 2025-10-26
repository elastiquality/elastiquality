'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getDoc, doc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Loader2, MapPin, DollarSign, Calendar, Clock, Send, AlertCircle } from 'lucide-react'

interface ServiceRequest {
  id: string
  clientId: string
  title: string
  description: string
  category: string
  budgetMin: number | null
  budgetMax: number | null
  location: {
    district: string
    council: string
    parish: string
  }
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  urgency: 'LOW' | 'MEDIUM' | 'HIGH'
  deadline: string | null
  createdAt: string
  updatedAt: string
}

interface Proposal {
  id: string
  professionalId: string
  professionalName: string
  price: number
  description: string
  status: string
}

export default function ServiceRequestDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, userData, loading: authLoading } = useAuth()
  const [request, setRequest] = useState<ServiceRequest | null>(null)
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [proposalPrice, setProposalPrice] = useState('')
  const [proposalDescription, setProposalDescription] = useState('')
  const [proposalTime, setProposalTime] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/signin')
      return
    }

    if (user && params.id) {
      loadRequest()
    }
  }, [user, authLoading, params.id, router])

  const loadRequest = async () => {
    if (!params.id) return

    try {
      setLoading(true)
      
      // Load request
      const requestDoc = await getDoc(doc(db, 'serviceRequests', params.id as string))
      
      if (!requestDoc.exists()) {
        setError('Pedido não encontrado')
        setLoading(false)
        return
      }

      const requestData = requestDoc.data()
      setRequest({
        id: requestDoc.id,
        ...requestData,
        createdAt: requestData.createdAt?.toDate().toISOString() || '',
        updatedAt: requestData.updatedAt?.toDate().toISOString() || '',
        deadline: requestData.deadline?.toDate().toISOString() || null
      } as ServiceRequest)

      // Load proposals
      const proposalsRef = collection(db, 'proposals')
      const proposalsQuery = query(
        proposalsRef,
        where('requestId', '==', params.id)
      )
      const proposalsSnapshot = await getDocs(proposalsQuery)
      
      const proposalsData = proposalsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Proposal[]
      
      setProposals(proposalsData)
      
    } catch (err: any) {
      console.error('Error loading request:', err)
      setError('Erro ao carregar pedido')
    } finally {
      setLoading(false)
    }
  }

  const handleSendProposal = async () => {
    if (!request || !user || !userData) return

    if (!proposalPrice || !proposalDescription) {
      alert('Preencha todos os campos obrigatórios')
      return
    }

    const price = parseFloat(proposalPrice)
    if (isNaN(price) || price <= 0) {
      alert('Preço inválido')
      return
    }

    try {
      setError('')
      
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestId: request.id,
          professionalId: user.uid,
          professionalName: userData.name || user.displayName || 'Profissional',
          price,
          description: proposalDescription,
          estimatedTime: proposalTime || 'A definir'
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao enviar proposta')
      }

      setProposalPrice('')
      setProposalDescription('')
      setProposalTime('')
      setShowProposalForm(false)
      loadRequest()
      
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar proposta')
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

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!user || !user || !request) {
    return null
  }

  const canSendProposal = userData?.userType === 'PROFESSIONAL'
  const hasProposed = proposals.some(p => p.professionalId === user.uid)

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Request Details */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{request.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{request.location.district}, {request.location.parish}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(request.createdAt)}</span>
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
                <Clock className="w-4 h-4" />
                <span>Urgência: {request.urgency === 'HIGH' ? 'Alta' : request.urgency === 'MEDIUM' ? 'Média' : 'Baixa'}</span>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{request.description}</p>
            
            <div className="text-sm text-gray-500">
              <p>Categoria: <span className="font-medium text-gray-900">{request.category}</span></p>
              <p>Status: <span className="font-medium text-gray-900">{request.status}</span></p>
            </div>
          </div>

          {/* Send Proposal Button (if professional) */}
          {canSendProposal && (
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              {!hasProposed ? (
                !showProposalForm ? (
                  <button
                    onClick={() => setShowProposalForm(true)}
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Enviar Proposta
                  </button>
                ) : (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Enviar Proposta</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preço (€) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={proposalPrice}
                        onChange={(e) => setProposalPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Ex: 100.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tempo Estimado
                      </label>
                      <input
                        type="text"
                        value={proposalTime}
                        onChange={(e) => setProposalTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Ex: 2 horas, 1 dia, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição da Proposta <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={proposalDescription}
                        onChange={(e) => setProposalDescription(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                        placeholder="Descreva como você vai executar este serviço..."
                      />
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => setShowProposalForm(false)}
                        className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Cancelar
                      </button>
                      <button
                        onClick={handleSendProposal}
                        className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg transition-colors"
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-600">Você já enviou uma proposta para este pedido</p>
                </div>
              )}
            </div>
          )}

          {/* Proposals List */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Propostas ({proposals.length})
            </h2>

            {proposals.length === 0 ? (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhuma proposta ainda</p>
              </div>
            ) : (
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div
                    key={proposal.id}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">{proposal.professionalName}</h4>
                        <p className="text-primary-600 font-semibold">€{proposal.price}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        proposal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        proposal.status === 'ACCEPTED' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {proposal.status === 'PENDING' ? 'Pendente' :
                         proposal.status === 'ACCEPTED' ? 'Aceita' : 'Rejeitada'}
                      </span>
                    </div>
                    <p className="text-gray-600">{proposal.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

