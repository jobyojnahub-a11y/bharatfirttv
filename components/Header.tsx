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
      {/* Top Bar */}
      <div className="bg-red-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-4">
            <span>🇮🇳 देश दुनिया खेल मनोरंजन</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>12:25:56 सोमवार</span>
            <div className="flex space-x-2">
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">ND vs NZ Live</span>
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">UP Board Result</span>
              <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs">Gold Price Today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Advertisement Header Panel */}
      <div className="bg-gray-100 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="bg-red-600 text-white px-4 py-2 font-bold text-2xl">
              भारत<br />FIRST
            </div>
            <div className="flex-1 mx-8">
              <div className="bg-gray-300 h-20 flex items-center justify-center text-gray-600 text-lg font-bold border">
                ADVERTISEMENT
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 hindi-text"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <User className="w-5 h-5 text-gray-600" />
              </button>
              
              {/* Mobile Menu Button */}
              <button
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-6 h-6 text-gray-600" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-gray-700 hover:text-red-600 font-medium transition-colors duration-200 hindi-text"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </nav>
    </>
  )
}