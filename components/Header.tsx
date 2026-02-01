'use client'

import { useState } from 'react'
import { Menu, X, Search, Bell, User } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
            <div className="bg-primary-red text-white px-4 py-2 font-bold text-2xl">
              भारत<br />FIRST
            </div>
            
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
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-red font-medium text-sm transition-colors duration-200 hindi-text"
                >
                  {item.name}
                </a>
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
              <button className="p-1 hover:bg-gray-100 rounded-full">
                <User className="w-4 h-4 text-gray-600" />
              </button>
              
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
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-primary-red font-medium text-sm transition-colors duration-200 hindi-text py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </div>
    </>
  )
}