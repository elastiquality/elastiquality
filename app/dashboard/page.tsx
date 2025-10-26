'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/auth'
import { Loader2, Briefcase, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const { user: currentUser, userData, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !currentUser) {
      router.push('/auth/signin')
    }
  }, [currentUser, authLoading, router])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  const isProfessional = userData?.userType === 'PROFESSIONAL'
  const isClient = userData?.userType === 'CLIENT'

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Bem-vindo, {userData?.name || currentUser.displayName || 'Usuário'}!
            </h1>
            <p className="text-gray-600">
              {isProfessional ? 'Gerencie seus serviços e propostas' : 'Encontre os serviços que precisa'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {isProfessional && (
              <>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Propostas Pendentes</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <Clock className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Serviços em Andamento</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Serviços Concluídos</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Avaliação Média</p>
                      <p className="text-2xl font-bold text-gray-900">—</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <AlertCircle className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </>
            )}

            {isClient && (
              <>
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Pedidos Ativos</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Briefcase className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Serviços Contratados</p>
                      <p className="text-2xl font-bold text-gray-900">0</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Ações Rápidas</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {isProfessional && (
                <>
                  <button
                    onClick={() => router.push('/profile/professional')}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 mb-1">Completar Perfil</h3>
                    <p className="text-sm text-gray-600">Adicione sua biografia e portfólio</p>
                  </button>

                  <button
                    onClick={() => router.push('/services')}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 mb-1">Ver Pedidos</h3>
                    <p className="text-sm text-gray-600">Encontre novos serviços em sua área</p>
                  </button>

                  <button
                    onClick={() => router.push('/professionals')}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 mb-1">Ver Profissionais</h3>
                    <p className="text-sm text-gray-600">Conheça outros profissionais</p>
                  </button>
                </>
              )}

              {isClient && (
                <>
                  <button
                    onClick={() => router.push('/services/create')}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 mb-1">Criar Pedido</h3>
                    <p className="text-sm text-gray-600">Publique um novo serviço</p>
                  </button>

                  <button
                    onClick={() => router.push('/professionals')}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 mb-1">Buscar Profissionais</h3>
                    <p className="text-sm text-gray-600">Encontre profissionais qualificados</p>
                  </button>

                  <button
                    onClick={() => router.push('/services/my-requests')}
                    className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors"
                  >
                    <h3 className="font-medium text-gray-900 mb-1">Meus Pedidos</h3>
                    <p className="text-sm text-gray-600">Veja seus pedidos de serviço</p>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Atividade Recente</h2>
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma atividade recente</p>
              <p className="text-sm text-gray-500 mt-2">Seus serviços e propostas aparecerão aqui</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

