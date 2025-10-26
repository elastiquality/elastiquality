'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Search, MapPin, Star, Clock, Award, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

const professionals = [
  {
    id: 1,
    name: 'João Silva',
    profession: 'Eletricista',
    location: 'Lisboa',
    rating: 4.9,
    reviews: 127,
    experience: '8 anos',
    price: '€35/hora',
    verified: true,
    specialties: ['Instalações elétricas', 'Reparações', 'Automação'],
    image: null,
    description: 'Eletricista certificado com vasta experiência em instalações residenciais e comerciais.'
  },
  {
    id: 2,
    name: 'Maria Santos',
    profession: 'Canalizadora',
    location: 'Porto',
    rating: 4.8,
    reviews: 89,
    experience: '12 anos',
    price: '€40/hora',
    verified: true,
    specialties: ['Reparações urgentes', 'Instalações', 'Aquecimento'],
    image: null,
    description: 'Canalizadora experiente, especializada em reparações urgentes e instalações modernas.'
  },
  {
    id: 3,
    name: 'Pedro Costa',
    profession: 'Pintor',
    location: 'Braga',
    rating: 4.7,
    reviews: 156,
    experience: '15 anos',
    price: '€25/hora',
    verified: true,
    specialties: ['Interiores', 'Exteriores', 'Decoração'],
    image: null,
    description: 'Pintor profissional com especialização em técnicas modernas de pintura decorativa.'
  },
  {
    id: 4,
    name: 'Ana Rodrigues',
    profession: 'Limpeza',
    location: 'Coimbra',
    rating: 4.9,
    reviews: 203,
    experience: '6 anos',
    price: '€18/hora',
    verified: true,
    specialties: ['Limpeza doméstica', 'Escritórios', 'Pós-obra'],
    image: null,
    description: 'Especialista em limpeza com foco na qualidade e atenção aos detalhes.'
  },
  {
    id: 5,
    name: 'Carlos Ferreira',
    profession: 'Jardineiro',
    location: 'Faro',
    rating: 4.8,
    reviews: 94,
    experience: '10 anos',
    price: '€22/hora',
    verified: true,
    specialties: ['Paisagismo', 'Manutenção', 'Plantas'],
    image: null,
    description: 'Jardineiro apaixonado pela natureza, especializado em paisagismo e manutenção de jardins.'
  },
  {
    id: 6,
    name: 'Sofia Almeida',
    profession: 'Mecânica',
    location: 'Aveiro',
    rating: 4.9,
    reviews: 78,
    experience: '7 anos',
    price: '€45/hora',
    verified: true,
    specialties: ['Manutenção', 'Diagnóstico', 'Elétrica automóvel'],
    image: null,
    description: 'Mecânica especializada em manutenção preventiva e reparações de veículos modernos.'
  },
  {
    id: 7,
    name: 'Miguel Pereira',
    profession: 'Carpinteiro',
    location: 'Setúbal',
    rating: 4.7,
    reviews: 142,
    experience: '11 anos',
    price: '€30/hora',
    verified: true,
    specialties: ['Móveis sob medida', 'Restauração', 'Construção'],
    image: null,
    description: 'Carpinteiro especializado em móveis personalizados e restauração de peças antigas.'
  },
  {
    id: 8,
    name: 'Carla Mendes',
    profession: 'Designer de Interiores',
    location: 'Leiria',
    rating: 4.8,
    reviews: 95,
    experience: '9 anos',
    price: '€50/hora',
    verified: true,
    specialties: ['Design residencial', 'Consultoria', 'Decoração'],
    image: null,
    description: 'Designer criativa com foco em espaços funcionais e esteticamente agradáveis.'
  },
  {
    id: 9,
    name: 'Rui Fernandes',
    profession: 'Técnico de Aquecimento',
    location: 'Viseu',
    rating: 4.9,
    reviews: 167,
    experience: '13 anos',
    price: '€40/hora',
    verified: true,
    specialties: ['Aquecimento central', 'Caldeiras', 'Energia solar'],
    image: null,
    description: 'Especialista em sistemas de aquecimento e soluções energéticas eficientes.'
  },
  {
    id: 10,
    name: 'Teresa Oliveira',
    profession: 'Fisioterapeuta',
    location: 'Évora',
    rating: 4.8,
    reviews: 203,
    experience: '8 anos',
    price: '€35/hora',
    verified: true,
    specialties: ['Reabilitação', 'Massagem terapêutica', 'Pilates'],
    image: null,
    description: 'Fisioterapeuta dedicada à recuperação e bem-estar dos pacientes.'
  },
  {
    id: 11,
    name: 'André Costa',
    profession: 'Técnico de Informática',
    location: 'Funchal',
    rating: 4.7,
    reviews: 89,
    experience: '6 anos',
    price: '€25/hora',
    verified: true,
    specialties: ['Reparação de computadores', 'Redes', 'Software'],
    image: null,
    description: 'Técnico especializado em soluções informáticas para empresas e particulares.'
  },
  {
    id: 12,
    name: 'Isabel Santos',
    profession: 'Organizadora de Eventos',
    location: 'Bragança',
    rating: 4.9,
    reviews: 134,
    experience: '10 anos',
    price: '€60/hora',
    verified: true,
    specialties: ['Casamentos', 'Aniversários', 'Eventos corporativos'],
    image: null,
    description: 'Organizadora experiente que transforma sonhos em eventos memoráveis.'
  }
]

export default function ProfessionalsPage() {
  const [visibleCount, setVisibleCount] = useState(6) // Mostrar 6 profissionais inicialmente
  const [isLoading, setIsLoading] = useState(false)

  const handleLoadMore = () => {
    setIsLoading(true)
    
    // Simular carregamento
    setTimeout(() => {
      setVisibleCount(prev => Math.min(prev + 6, professionals.length))
      setIsLoading(false)
    }, 1000)
  }

  const visibleProfessionals = professionals.slice(0, visibleCount)
  const hasMore = visibleCount < professionals.length

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-secondary-500 via-secondary-600 to-secondary-700 text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Profissionais Verificados
              </h1>
              <p className="text-xl text-secondary-100 mb-8 max-w-3xl mx-auto">
                Conheça os melhores profissionais de Portugal. 
                Todos verificados, avaliados e prontos para ajudar.
              </p>
              
              {/* Search Bar */}
              <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-xl p-4 shadow-lg">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Profissão ou especialidade"
                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none text-gray-900"
                      />
                    </div>
                    
                    <div className="relative">
                      <select className="w-full md:w-48 pl-4 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none text-gray-900 bg-white">
                        <option value="">Todas as categorias</option>
                        <option value="construcao-reforma">🏗️ Construção e Reforma</option>
                        <option value="servicos-domesticos">🏠 Serviços Domésticos</option>
                        <option value="limpeza">🧹 Serviços de Limpeza</option>
                        <option value="tecnologia-informatica">💻 Tecnologia e Informática</option>
                        <option value="automotivos">🚗 Serviços Automotivos</option>
                        <option value="beleza-estetica">💄 Beleza e Estética</option>
                        <option value="saude-bem-estar">💆 Saúde e Bem-estar</option>
                        <option value="transporte-logistica">🚛 Transporte e Logística</option>
                        <option value="educacao">📚 Serviços Educacionais</option>
                        <option value="eventos-festas">🎉 Eventos e Festas</option>
                        <option value="administrativos-financeiros">💼 Administrativos e Financeiros</option>
                        <option value="criativos-design">🎨 Criativos e Design</option>
                        <option value="costura-alfaiataria">✂️ Serviços de Costura/Alfaiataria/Modista</option>
                      </select>
                    </div>
                    
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Localização"
                        className="w-full md:w-64 pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-secondary-500 focus:border-transparent outline-none text-gray-900"
                      />
                    </div>
                    
                    <button className="bg-secondary-600 hover:bg-secondary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                      Buscar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-secondary-600 mb-2">98%</div>
                <p className="text-gray-600">Taxa de Verificação</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary-600 mb-2">4.8★</div>
                <p className="text-gray-600">Avaliação Média</p>
              </div>
              <div>
                <div className="text-3xl font-bold text-secondary-600 mb-2">24h</div>
                <p className="text-gray-600">Tempo de Resposta</p>
              </div>
            </div>
          </div>
        </section>

        {/* Professionals Grid */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {visibleProfessionals.map((professional) => (
                <div key={professional.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-200">
                  <div className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-gray-500 text-lg font-medium">
                          {professional.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{professional.name.split(' ')[0]}</h3>
                          {professional.verified && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                        </div>
                        
                        <p className="text-secondary-600 font-medium">{professional.profession}</p>
                        <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{professional.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 text-sm mb-4">{professional.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      {professional.specialties.slice(0, 3).map((specialty, index) => (
                        <span key={index} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mr-2">
                          {specialty}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{professional.rating}</span>
                        <span className="text-sm text-gray-500">({professional.reviews})</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{professional.experience}</span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Link
                        href={`/professionals/${professional.id}`}
                        className="flex-1 bg-secondary-600 hover:bg-secondary-700 text-white text-center py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        Ver Perfil
                      </Link>
                      <Link
                        href={`/services/create?professional=${professional.id}&name=${encodeURIComponent(professional.name)}&profession=${encodeURIComponent(professional.profession)}`}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                      >
                        Contactar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-12">
                <button 
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="bg-white border border-secondary-600 text-secondary-600 hover:bg-secondary-50 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-secondary-600 border-t-transparent rounded-full animate-spin"></div>
                      <span>Carregando...</span>
                    </div>
                  ) : (
                    `Ver Mais Profissionais (${professionals.length - visibleCount} restantes)`
                  )}
                </button>
              </div>
            )}
            
            {/* Mostrar mensagem quando todos os profissionais foram carregados */}
            {!hasMore && professionals.length > 6 && (
              <div className="text-center mt-12">
                <p className="text-gray-500 text-sm">
                  Todos os {professionals.length} profissionais foram carregados
                </p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-secondary-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              É Profissional?
            </h2>
            <p className="text-xl text-secondary-100 mb-8 max-w-2xl mx-auto">
              Junte-se à nossa plataforma e encontre novos clientes todos os dias.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-white text-secondary-600 hover:bg-gray-50 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Cadastrar-se como Profissional
              </Link>
              <Link
                href="/about"
                className="border border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-lg font-medium transition-colors"
              >
                Saiba Mais
              </Link>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  )
}

