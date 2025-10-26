'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, MapPin, Star, Award, MapPinOff, Loader2 } from 'lucide-react'

interface Location {
  postalCode?: string
  postalCodeExt?: string
  location: string
  region: string
  district: string
}

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState('')
  const [location, setLocation] = useState('')
  const [locationSuggestions, setLocationSuggestions] = useState<Location[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const locationInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Fetch location suggestions based on query
  const fetchLocationSuggestions = async (query: string) => {
    if (query.length < 2) {
      setLocationSuggestions([])
      return
    }

    setIsLoadingLocation(true)

    try {
      // Try local API first
      const localApiUrl = `/api/postal-codes?q=${encodeURIComponent(query)}`
      
      try {
        const response = await fetch(localApiUrl)
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data.length > 0) {
            const suggestions: Location[] = data.data.map((item: any) => ({
              postalCode: item.postalCode,
              postalCodeExt: item.postalCodeExt,
              location: `${item.council || ''}, ${item.district || ''}`.trim(),
              region: item.region || '',
              district: item.district || ''
            }))
            setLocationSuggestions(suggestions)
            return
          }
        }
      } catch (e) {
        console.log('Local API not available, using external APIs')
      }

      // Check if it's a postal code (4 digits)
      if (/^\d{4}$/.test(query)) {
        // Try official CTT API
        const response = await fetch(`https://api.cttcodigopostal.pt/api/v1/postalcodes?postalCode=${query}`)
        
        if (response.ok) {
          const data = await response.json()
          const suggestions: Location[] = data.data.map((item: any) => ({
            postalCode: item.postalCode,
            postalCodeExt: item.postalCodeExt,
            location: `${item.county || ''}, ${item.district || ''}`.trim(),
            region: item.region || '',
            district: item.district || ''
          }))
          setLocationSuggestions(suggestions)
          return
        }

        // Fallback API
        const fallbackResponse = await fetch(`https://api-dos-codigos-postais.vercel.app/postal-codes/${query}`)
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json()
          const suggestions: Location[] = data.map((item: any) => ({
            postalCode: item.postal_code,
            postalCodeExt: item.ext,
            location: `${item.council || ''}, ${item.district || ''}`.trim(),
            region: item.region || '',
            district: item.district || ''
          }))
          setLocationSuggestions(suggestions)
        }
      } else {
        // Search by location name
        const response = await fetch(`https://api.cttcodigopostal.pt/api/v1/postalcodes/search?q=${encodeURIComponent(query)}`)
        
        if (response.ok) {
          const data = await response.json()
          const suggestions: Location[] = data.data.map((item: any) => ({
            postalCode: item.postalCode,
            postalCodeExt: item.postalCodeExt,
            location: `${item.county || ''}, ${item.district || ''}`.trim(),
            region: item.region || '',
            district: item.district || ''
          }))
          setLocationSuggestions(suggestions)
          return
        }

        // Fallback API
        const fallbackResponse = await fetch(`https://api-dos-codigos-postais.vercel.app/search?q=${encodeURIComponent(query)}`)
        
        if (fallbackResponse.ok) {
          const data = await fallbackResponse.json()
          const suggestions: Location[] = data.map((item: any) => ({
            postalCode: item.postal_code,
            postalCodeExt: item.ext,
            location: `${item.council || ''}, ${item.district || ''}`.trim(),
            region: item.region || '',
            district: item.district || ''
          }))
          setLocationSuggestions(suggestions)
        }
      }
    } catch (error) {
      console.error('Error fetching location:', error)
      setLocationSuggestions([])
    } finally {
      setIsLoadingLocation(false)
    }
  }

  // Handle location input change
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setLocation(value)
    setShowSuggestions(true)
    fetchLocationSuggestions(value)
  }

  // Handle location selection
  const handleLocationSelect = (selectedLocation: Location) => {
    const fullLocation = selectedLocation.postalCode 
      ? `${selectedLocation.postalCode} - ${selectedLocation.location}` 
      : selectedLocation.location
    setLocation(fullLocation)
    setShowSuggestions(false)
  }

  // Get current location using browser geolocation
  const handleGetCurrentLocation = () => {
    setUseCurrentLocation(true)
    setIsLoadingLocation(true)
    
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          
          try {
            // Reverse geocoding to get address
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`
            )
            
            if (response.ok) {
              const data = await response.json()
              const address = data.address
              const locationString = `${address.city || address.town || address.village || ''}, ${address.state || ''}`.trim()
              setLocation(locationString)
              setShowSuggestions(false)
            }
          } catch (error) {
            console.error('Error getting location:', error)
            setLocation('Localização atual')
          } finally {
            setIsLoadingLocation(false)
            setUseCurrentLocation(false)
          }
        },
        (error) => {
          console.error('Geolocation error:', error)
          setIsLoadingLocation(false)
          setUseCurrentLocation(false)
          alert('Não foi possível obter sua localização. Por favor, insira manualmente.')
        }
      )
    } else {
      alert('Geolocalização não é suportada neste navegador.')
      setIsLoadingLocation(false)
      setUseCurrentLocation(false)
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        locationInputRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!searchQuery.trim() && !location.trim()) {
      return
    }

    const params = new URLSearchParams()
    if (searchQuery.trim()) params.set('service', searchQuery.trim())
    if (location.trim()) params.set('location', location.trim())
    
    router.push(`/search?${params.toString()}`)
  }

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600/20 to-transparent"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Encontre o profissional
                <span className="text-secondary-400 block">
                  perfeito para você
                </span>
              </h1>
              <p className="text-xl text-primary-100 max-w-lg">
                Mais de 500 tipos de serviços em um só lugar. Conectamos clientes com os melhores profissionais de Portugal.
              </p>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="relative">
            <div className="grid grid-cols-1 gap-4">
              {/* Stats Cards */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary-400 p-2 rounded-lg">
                    <Star className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">4.8</p>
                    <p className="text-primary-100 text-sm">Avaliação</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-success-500 p-2 rounded-lg">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">98%</p>
                    <p className="text-primary-100 text-sm">Satisfação</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-secondary-500 rounded-full p-4 animate-bounce-subtle">
              <Star className="w-6 h-6 text-white" />
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-success-500 rounded-full p-3 animate-bounce-subtle" style={{ animationDelay: '1s' }}>
              <Award className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>

        {/* Search Form - Full Width */}
        <div className="mt-12 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Que serviço precisa?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    ref={locationInputRef}
                    type="text"
                    placeholder="Código postal ou localidade"
                    value={location}
                    onChange={handleLocationChange}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-gray-900"
                  />
                  
                  {/* Current location button */}
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    disabled={isLoadingLocation}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-primary-600 transition-colors disabled:opacity-50"
                    title="Usar minha localização"
                  >
                    {isLoadingLocation ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <MapPinOff className="w-5 h-5" />
                    )}
                  </button>

                  {/* Location suggestions dropdown */}
                  {showSuggestions && locationSuggestions.length > 0 && (
                    <div
                      ref={suggestionsRef}
                      className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-60 overflow-y-auto"
                    >
                      {locationSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => handleLocationSelect(suggestion)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900">
                            {suggestion.postalCode && `${suggestion.postalCode} - ${suggestion.postalCodeExt}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {suggestion.location}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {isLoadingLocation && locationSuggestions.length === 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 p-4">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Carregando...</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                >
                  Buscar Profissionais
                </button>
              </div>
            </div>
          </form>

          {/* Popular Searches */}
          <div className="mt-6 space-y-3">
            <p className="text-primary-100 text-sm">Pesquisas populares:</p>
            <div className="flex flex-wrap gap-2">
              {['Eletricista', 'Canalizador', 'Limpeza', 'Jardinagem', 'Pintor', 'Carpinteiro'].map((service) => (
                <button
                  key={service}
                  onClick={() => {
                    setSearchQuery(service)
                    setLocation('')
                    router.push(`/search?service=${encodeURIComponent(service)}`)
                  }}
                  className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full text-sm transition-colors"
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-20"
        >
          <path
            d="M0,64L48,69.3C96,75,192,85,288,85.3C384,85,480,75,576,64C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            fill="#F9FAFB"
          />
        </svg>
      </div>
    </section>
  )
}
