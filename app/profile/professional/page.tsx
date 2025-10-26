'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useAuth } from '@/lib/auth'
import { User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { uploadProfileImage, uploadCertificate, uploadPortfolioImage } from '@/lib/storage'
import { Loader2, User, MapPin, Phone, Briefcase, Camera, Award, Image } from 'lucide-react'

export default function ProfessionalProfilePage() {
  const { user: currentUser, userData, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  
  // Profile data
  const [bio, setBio] = useState('')
  const [phone, setPhone] = useState('')
  const [verified, setVerified] = useState(false)
  const [certificates, setCertificates] = useState<any[]>([])
  const [portfolio, setPortfolio] = useState<any[]>([])
  
  const router = useRouter()

  useEffect(() => {
    if (!authLoading) {
      if (!currentUser) {
        router.push('/auth/signin')
        return
      }
      
      loadProfile()
    }
  }, [currentUser, authLoading])

  const loadProfile = async () => {
    if (!currentUser) return

    try {
      const professionalDoc = await getDoc(doc(db, 'professionals', currentUser.uid))
      
      if (professionalDoc.exists()) {
        const data = professionalDoc.data()
        setBio(data.bio || '')
        setPhone(userData?.profile?.phone || '')
        setVerified(data.verified || false)
        setCertificates(data.certifications || [])
        setPortfolio(data.portfolio || [])
      }
      
      setLoading(false)
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Erro ao carregar perfil')
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!currentUser) {
      router.push('/auth/signin')
      return
    }

    setSaving(true)

    try {
      await updateDoc(doc(db, 'professionals', currentUser.uid), {
        bio,
        updatedAt: serverTimestamp()
      })

      setSuccess('Perfil atualizado com sucesso!')
      
      // Reload after a moment
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setError('Erro ao atualizar perfil')
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Perfil Profissional
            </h1>
            <p className="text-gray-600">
              Complete seu perfil para começar a receber propostas
            </p>
          </div>

          {/* Alerts */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
              {success}
            </div>
          )}

          {/* Profile Info Card */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-20 h-20 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-10 h-10 text-primary-600" />
                </div>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">
                  {currentUser.displayName || 'Profissional'}
                </h2>
                <p className="text-gray-600 mb-3">{currentUser.email}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>{phone || 'Não informado'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{userData?.profile?.location?.district || 'Não informado'}</span>
                  </div>
                </div>
              </div>
              {verified && (
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Verificado
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bio Form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Biografia</h3>
            
            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                Conte-nos sobre você e seus serviços
              </label>
              <textarea
                id="bio"
                rows={6}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                placeholder="Descreva sua experiência, especialidades e o que você pode oferecer..."
              />
              <p className="mt-1 text-xs text-gray-500">{bio.length} caracteres</p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white rounded-lg transition-colors flex items-center"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  'Salvar'
                )}
              </button>
            </div>
          </form>

          {/* Certificates */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Certificados</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Adicionar
              </button>
            </div>
            <p className="text-sm text-gray-600">Adicione seus certificados e diplomas para aumentar sua credibilidade</p>
          </div>

          {/* Portfolio */}
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Portfólio</h3>
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Adicionar
              </button>
            </div>
            <p className="text-sm text-gray-600">Mostre exemplos do seu trabalho</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

