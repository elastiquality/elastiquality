'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Mail, Lock, User, AlertCircle, Loader2, MapPin, Phone, Briefcase, Map } from 'lucide-react'
import { DISTRICTS, SERVICE_CATEGORIES_LIST } from '@/lib/districts'
import { PostalCode } from '@/lib/postal-codes'

export default function SignUpPage() {
  const [userType, setUserType] = useState<'CLIENT' | 'PROFESSIONAL'>('CLIENT')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [location, setLocation] = useState('')
  const [locationData, setLocationData] = useState<PostalCode | null>(null)
  const [locationSuggestions, setLocationSuggestions] = useState<PostalCode[]>([])
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  
  // Professional specific fields
  const [serviceDistricts, setServiceDistricts] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [searchService, setSearchService] = useState('')
  
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp, signInWithGoogle } = useAuth()
  const router = useRouter()

  // Location autocomplete
  const handleLocationChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocation(value)
    setShowLocationSuggestions(true)

    if (value.length < 2) {
      setLocationSuggestions([])
      return
    }

    try {
      const response = await fetch(`/api/postal-codes?q=${encodeURIComponent(value)}`)
      const data = await response.json()
      
      // data is already an array from the API
      setLocationSuggestions(Array.isArray(data) ? data.slice(0, 5) : [])
    } catch (error) {
      console.error('Error fetching location suggestions:', error)
      setLocationSuggestions([])
    }
  }

  const selectLocation = (suggestion: PostalCode) => {
    setLocation(`${suggestion.freguesia}, ${suggestion.council}, ${suggestion.district}`)
    setLocationData(suggestion)
    setShowLocationSuggestions(false)
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9)
    setPhone(value)
  }

  const toggleDistrict = (district: string) => {
    if (serviceDistricts.includes(district)) {
      setServiceDistricts(serviceDistricts.filter(d => d !== district))
    } else {
      setServiceDistricts([...serviceDistricts, district])
    }
  }

  const toggleService = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service))
    } else {
      setSelectedServices([...selectedServices, service])
    }
  }

  // Get services from selected category
  const availableServices = selectedCategory 
    ? SERVICE_CATEGORIES_LIST.find(cat => cat.name === selectedCategory)?.services || []
    : []

  // Filter services based on search
  const filteredServices = availableServices.filter(service =>
    service.toLowerCase().includes(searchService.toLowerCase())
  )

  // Get all selected services grouped by category
  const allSelectedServices = selectedServices

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      setError('Por favor, preencha nome e apelido')
      return
    }

    if (!phone || phone.length !== 9) {
      setError('O telemóvel deve ter 9 dígitos')
      return
    }

    if (!locationData) {
      setError('Por favor, selecione uma localização')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres')
      return
    }

    // Professional specific validation
    if (userType === 'PROFESSIONAL') {
      if (serviceDistricts.length === 0) {
        setError('Selecione pelo menos um distrito onde atende')
        return
      }
      if (selectedServices.length === 0) {
        setError('Selecione pelo menos um serviço')
        return
      }
    }

    setLoading(true)

    try {
      const fullName = `${firstName} ${lastName}`
      await signUp(email, password, fullName, userType, {
        firstName,
        lastName,
        phone,
        location: locationData,
        serviceDistricts: userType === 'PROFESSIONAL' ? serviceDistricts : undefined,
        categories: userType === 'PROFESSIONAL' ? selectedServices : undefined,
      })
      
      // Redirect based on user type
      if (userType === 'PROFESSIONAL') {
        router.push('/profile/professional')
      } else {
        router.push('/dashboard')
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      setError('')
      setLoading(true)
      await signInWithGoogle()
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto space-y-8">
          <div>
            <h2 className="text-center text-3xl font-bold text-gray-900">
              Crie sua conta
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/auth/signin" className="font-medium text-primary-600 hover:text-primary-500">
                Entre aqui
              </Link>
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div className="rounded-lg shadow-sm bg-white p-6 space-y-6">
              {/* User Type Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tipo de conta
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setUserType('CLIENT')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      userType === 'CLIENT'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg font-medium text-gray-900 mb-1">👤 Cliente</div>
                    <div className="text-sm text-gray-600">Buscar serviços</div>
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setUserType('PROFESSIONAL')}
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      userType === 'PROFESSIONAL'
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-lg font-medium text-gray-900 mb-1">🔧 Profissional</div>
                    <div className="text-sm text-gray-600">Oferecer serviços</div>
                  </button>
                </div>
              </div>

              {/* Name fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nome <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Nome"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Apelido <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      autoComplete="family-name"
                      required
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      placeholder="Apelido"
                    />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Telemóvel <span className="text-red-500">*</span> <span className="text-gray-500 text-xs">(9 dígitos)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    required
                    value={phone}
                    onChange={handlePhoneChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="912345678"
                    maxLength={9}
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">{phone.length}/9 dígitos</p>
              </div>

              {/* Location */}
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Localização <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="location"
                    name="location"
                    type="text"
                    required
                    value={location}
                    onChange={handleLocationChange}
                    onBlur={() => setTimeout(() => setShowLocationSuggestions(false), 200)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="Digite o código postal ou morada"
                  />
                  {showLocationSuggestions && locationSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {locationSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectLocation(suggestion)}
                          className="w-full px-4 py-2 text-left hover:bg-gray-50 transition-colors"
                        >
                          <div className="font-medium">{suggestion.freguesia}</div>
                          <div className="text-sm text-gray-600">{suggestion.council}, {suggestion.district}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Professional specific fields */}
              {userType === 'PROFESSIONAL' && (
                <>
                  {/* Service Districts */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Distritos onde atende
                    </label>
                    <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                      <div className="grid grid-cols-2 gap-2">
                        {DISTRICTS.map((district) => (
                          <label key={district} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={serviceDistricts.includes(district)}
                              onChange={() => toggleDistrict(district)}
                              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                            />
                            <span className="text-sm text-gray-700">{district}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Selecione os distritos onde está disposto a atender</p>
                  </div>

                  {/* Service Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categorias e Serviços <span className="text-red-500">*</span>
                    </label>
                    
                    {/* Category Selection */}
                    <div className="mb-3">
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value)
                          setSelectedServices([]) // Reset services when category changes
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                      >
                        <option value="">Selecione uma categoria...</option>
                        {SERVICE_CATEGORIES_LIST.map((category) => (
                          <option key={category.name} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Services Selection (only show if category selected) */}
                    {selectedCategory && (
                      <>
                        <div className="relative mb-3">
                          <input
                            type="text"
                            value={searchService}
                            onChange={(e) => setSearchService(e.target.value)}
                            placeholder="Buscar serviço..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <div className="max-h-48 overflow-y-auto border border-gray-300 rounded-lg p-3">
                          {filteredServices.length > 0 ? (
                            filteredServices.map((service) => (
                              <label key={service} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input
                                  type="checkbox"
                                  checked={selectedServices.includes(service)}
                                  onChange={() => toggleService(service)}
                                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-700">{service}</span>
                              </label>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500 text-center py-4">Nenhum serviço encontrado</p>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-gray-500">
                          Categoria: {selectedCategory} | {selectedServices.length} serviço(s) selecionado(s)
                        </p>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <div className="mt-1 text-xs space-y-1">
                  <p className="text-gray-600">A senha deve ter:</p>
                  <ul className="list-disc list-inside ml-2 space-y-0.5 text-gray-500">
                    <li className={password.length >= 6 ? 'text-green-600' : ''}>✓ No mínimo 6 caracteres</li>
                  </ul>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar senha <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {password === confirmPassword ? '✓ Senhas correspondem' : '✗ Senhas não correspondem'}
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-50 text-gray-500">Ou</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span>Criar conta com Google</span>
            </button>

            <p className="text-center text-sm text-gray-600">
              Ao criar uma conta, você concorda com os{' '}
              <Link href="/terms" className="text-primary-600 hover:text-primary-500">
                Termos de Uso
              </Link>
              {' '}e{' '}
              <Link href="/privacy" className="text-primary-600 hover:text-primary-500">
                Política de Privacidade
              </Link>
            </p>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
