'use client'

import { useState } from 'react'
import { Menu, X, Search, Bell, User } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { name: 'देश', href: '/desh' },
    { name: 'दुनिया', href: '/duniya' },
    { name: 'खेल', href: '/khel' },
    { name: 'मनोरंजन', href: '/manoranjan' },
    { name: 'बिजनेस', href: '/business' },
    { name: 'टेक्नोलॉजी', href: '/technology' },
    { name: 'राजनीति', href: '/politics' },
  ]

  return (
    <>
      {/* Top Bar */}
      <div className="bg-primary-500 text-white py-2">
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

      {/* Main Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div className="flex items-center">
              <div className="bg-primary-500 text-white px-4 py-2 font-bold text-xl">
                भारत<br />FIRST
              </div>
              <span className="ml-2 text-gray-600 text-sm">भारत की आवाज़</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary-500 font-medium transition-colors duration-200 hindi-text"
                >
                  {item.name}
                </a>
              ))}
            </nav>

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
                    className="text-gray-700 hover:text-primary-500 font-medium transition-colors duration-200 hindi-text"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}