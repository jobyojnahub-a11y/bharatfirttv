'use client'

import { useState } from 'react'
import { Menu, X, Search, Bell, User, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import AuthModal from './AuthModal'
import Link from 'next/link'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, logout, isLoggedIn, isAdmin } = useAuth()

  const navItems = [
    { name: 'होम', href: '/' },
    { name: 'ब्लॉग', href: '/blog' },
    { name: 'देश', href: '/desh' },
    { name: 'दुनिया', href: '/duniya' },
    { name: 'खेल', href: '/khel' },
    { name: 'मनोरंजन', href: '/manoranjan' },
    { name: 'राजनीति', href: '/politics' },
  ]

  return (
    <>
      {/* White Header with Logo and Advertisement */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/">
              <div className="bg-primary-red text-white px-4 py-2 font-bold text-2xl cursor-pointer hover:opacity-90">
                भारत<br />FIRST
              </div>
            </Link>
            
            {/* Advertisement Banner */}
            <div className="flex-1 mx-8">
              <div className="bg-gray-300 h-20 flex items-center justify-center text-gray-600 text-lg font-bold border advertisement-text">
                ADVERTISEMENT
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Thin Header with Profile and Categories */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2">
            {/* Categories Navigation */}
            <nav className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-red font-medium text-sm transition-colors duration-200 hindi-text"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Profile Icons */}
            <div className="flex items-center space-x-3">
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <Search className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <Bell className="w-4 h-4 text-gray-600" />
              </button>
              
              {/* User Authentication */}
              {isLoggedIn ? (
                <div className="flex items-center space-x-2">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="text-xs bg-primary-red text-white px-2 py-1 rounded hindi-text hover:opacity-90 animate-pulse-custom"
                      title="Admin Panel"
                    >
                      🛠️ एडमिन
                    </Link>
                  )}
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-primary-red rounded-full flex items-center justify-center text-white font-bold text-xs">
                      {user?.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-xs text-gray-700">{user?.name}</span>
                    <button
                      onClick={logout}
                      className="p-1 hover:bg-gray-100 rounded-full"
                      title="लॉगआउट"
                    >
                      <LogOut className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center space-x-1 text-primary-red hover:bg-red-50 px-2 py-1 rounded text-sm font-medium hindi-text"
                  >
                    <User className="w-4 h-4" />
                    <span>लॉगिन</span>
                  </button>
                  <Link
                    href="/admin"
                    className="text-xs bg-gray-600 text-white px-2 py-1 rounded hindi-text hover:bg-gray-700"
                    title="Admin Panel (Login Required)"
                  >
                    🛠️ एडमिन
                  </Link>
                </div>
              )}
              
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-1 hover:bg-gray-100 rounded-full"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-3">
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-primary-red font-medium text-sm transition-colors duration-200 hindi-text py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />
    </>
  )
}