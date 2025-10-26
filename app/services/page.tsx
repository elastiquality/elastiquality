'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, MapPin, Filter, Star, Clock, User, Euro, Calendar } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface ServiceRequest {
  id: string
  title: string
  description: string
  district: string
  council: string
  parish: string
  budgetMin: number | null
  budgetMax: number | null
  status: string
  createdAt: string
  category: string
}

const categories = [
  { id: 'all', name: 'Todas as Categorias' },
  { id: '1', name: 'Construção e Reforma' },
  { id: '2', name: 'Serviços Domésticos' },
  { id: '3', name: 'Serviços de Limpeza' },
  { id: '4', name: 'Tecnologia e Informática' },
  { id: '5', name: 'Serviços Automotivos' }
]

const mockRequests: ServiceRequest[] = [
  {
    id: '1',
    title: 'Preciso de eletricista para reparação de instalação',
    description: 'Necessito reparar uma instalação elétrica na minha casa. O problema é com os interruptores na cozinha.',
    district: 'Lisboa',
    council: 'Lisboa',
    parish: 'Areeiro',
    budgetMin: 50,
    budgetMax: 150,
    status: 'PENDING',
    createdAt: '2024-01-15',
    category: 'Eletricidade'
  },
  {
    id: '2',
    title: 'Necessito de canalizador urgente',
    description: 'Fuga de água no chuveiro. Precisa ser reparado o mais rápido possível.',
    district: 'Porto',
    council: 'Porto',
    parish: 'Bonfim',
    budgetMin: 80,
    budgetMax: 200,
    status: 'PENDING',
    createdAt: '2024-01-16',
    category: 'Canalização'
  },
  {
    id: '3',
    title: 'Pintura de interior - 3 divisões',
    description: 'Preciso pintar 3 divisões da minha casa. Já tenho as tintas compradas.',
    district: 'Braga',
    council: 'Braga',
    parish: 'Braga',
    budgetMin: 200,
    budgetMax: 400,
    status: 'IN_PROGRESS',
    createdAt: '2024-01-14',
    category: 'Pintura'
  },
  {
    id: '4',
    title: 'Limpeza profunda de escritório',
    description: 'Necessito de limpeza profissional para escritório de 100m2. Incluindo janelas e carpetes.',
    district: 'Lisboa',
    council: 'Lisboa',
    parish: 'Campo de Ourique',
    budgetMin: 150,
    budgetMax: 300,
    status: 'PENDING',
    createdAt: '2024-01-17',
    category: 'Limpeza'
  },
  {
    id: '5',
    title: 'Jardinagem - manutenção mensal',
    description: 'Procuro jardinheiro para manutenção mensal do jardim. Cerca de 200m2 de relva e canteiros.',
    district: 'Coimbra',
    council: 'Coimbra',
    parish: 'Coimbra',
    budgetMin: null,
    budgetMax: 150,
    status: 'PENDING',
    createdAt: '2024-01-18',
    category: 'Jardinagem'
  },
  {
    id: '6',
    title: 'Instalação de ar condicionado',
    description: 'Preciso instalar sistema de ar condicionado em casa com 3 unidades.',
    district: 'Faro',
    council: 'Faro',
    parish: 'Faro',
    budgetMin: 800,
    budgetMax: 1200,
    status: 'PENDING',
    createdAt: '2024-01-19',
    category: 'Instalação'
  }
]

export default function ServicesPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [requests, setRequests] = useState<ServiceRequest[]>(mockRequests)
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(false)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    filterRequests()
  }

  const filterRequests = () => {
    setLoading(true)
    
    setTimeout(() => {
      let filtered = [...mockRequests]
      
      // Filter by search term
      if (searchTerm.trim()) {
        filtered = filtered.filter(
          req => req.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                 req.description.toLowerCase().includes(searchTerm.toLowerCase())
        )
      }
      
      // Filter by category
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(req => req.category === selectedCategory)
      }
      
      setRequests(filtered)
      setLoading(false)
    }, 500)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setPage(1)
    filterRequests()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatBudget = (min: number | null, max: number | null) => {
    if (!min && !max) return 'Orçamento a definir'
    if (!min) return `Até €${max}`
    if (!max) return `A partir de €${min}`
    return `€${min} - €${max}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800'
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'Pendente'
      case 'IN_PROGRESS':
        return 'Em Progresso'
      case 'COMPLETED':
        return 'Concluído'
      default:
        return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Solicitações de Serviços
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Encontre oportunidades de trabalho. Visualize todas as ofertas de serviço disponíveis.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por título ou descrição..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
            >
              Buscar
            </button>
          </form>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma solicitação encontrada
            </h3>
            <p className="text-gray-600">
              Tente ajustar os filtros de busca para encontrar mais resultados.
            </p>
          </div>
        ) : (
          <>
            {/* Requests Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {requests.map((request) => (
                <div key={request.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {request.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {request.category}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 mb-4 line-clamp-3">
                      {request.description}
                    </p>

                    {/* Budget */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Euro className="w-4 h-4 mr-1" />
                      <span>{formatBudget(request.budgetMin, request.budgetMax)}</span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>
                        {request.district}, {request.council}
                      </span>
                    </div>

                    {/* Date */}
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>Publicado em {formatDate(request.createdAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <Link
                        href={`/service-requests/${request.id}`}
                        className="flex-1 border border-gray-300 text-gray-700 text-center py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* CTA Section */}
        <div className="bg-primary-600 rounded-lg p-8 text-center text-white mt-12">
          <h2 className="text-2xl font-bold mb-4">
            Não encontrou o que procura?
          </h2>
          <p className="text-primary-100 mb-6">
            Publique uma solicitação de serviço e receba propostas de profissionais certificados.
          </p>
          <Link
            href="/services/create"
            className="bg-white text-primary-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
          >
            Solicitar Serviço
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

