'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, User, LogOut, Settings, MessageCircle } from 'lucide-react'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen)

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-32">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <Image
                src="/logo.png"
                alt="Elastiquality"
                width={200}
                height={200}
                className="w-[200px] h-[200px] object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/services" className="text-gray-600 hover:text-primary-600 transition-colors">
              Serviços
            </Link>
            <Link href="/professionals" className="text-gray-600 hover:text-primary-600 transition-colors">
              Profissionais
            </Link>
            <Link href="/how-it-works" className="text-gray-600 hover:text-primary-600 transition-colors">
              Como Funciona
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-primary-600 transition-colors">
              Sobre
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/auth/signin"
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/auth/signup"
              className="btn-primary"
            >
              Cadastrar
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-600 hover:text-primary-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 relative z-50">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link
                href="/services"
                className="block px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Serviços
              </Link>
              <Link
                href="/professionals"
                className="block px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Profissionais
              </Link>
              <Link
                href="/how-it-works"
                className="block px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Como Funciona
              </Link>
              <Link
                href="/about"
                className="block px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Sobre
              </Link>
              
              <div className="pt-4 space-y-2 border-t border-gray-200">
                <Link
                  href="/auth/signin"
                  className="block px-3 py-3 text-gray-600 hover:text-primary-600 hover:bg-gray-50 transition-colors rounded-lg min-h-[44px] flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  href="/auth/signup"
                  className="block mx-3 btn-primary text-center min-h-[44px] flex items-center justify-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Cadastrar
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay para fechar dropdowns */}
      {(isUserMenuOpen || isMenuOpen) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsUserMenuOpen(false)
            setIsMenuOpen(false)
          }}
        />
      )}
    </header>
  )
}
