'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Home, FileText, Tags, Settings, Users, LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout, isAdmin } = useAuth()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!user) {
      router.push('/')
      return
    }
    if (!isAdmin) {
      router.push('/')
      return
    }
  }, [user, isAdmin, router])

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-red mx-auto"></div>
          <p className="mt-4 text-gray-600 hindi-text">लोड हो रहा है...</p>
        </div>
      </div>
    )
  }

  const menuItems = [
    { icon: Home, label: 'डैशबोर्ड', href: '/admin' },
    { icon: FileText, label: 'पोस्ट मैनेज करें', href: '/admin/posts' },
    { icon: Tags, label: 'कैटेगरी मैनेज करें', href: '/admin/categories' },
    { icon: Settings, label: 'फीचर्ड सेक्शन', href: '/admin/featured' },
    { icon: Users, label: 'यूज़र मैनेजमेंट', href: '/admin/users' },
  ]

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden bg-white shadow-sm p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold hindi-text">एडमिन पैनल</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out`}>
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b">
              <div className="bg-primary-red text-white px-4 py-2 font-bold text-xl inline-block">
                भारत<br />FIRST
              </div>
              <p className="text-sm text-gray-600 mt-2 hindi-text">एडमिन पैनल</p>
            </div>

            {/* User Info */}
            <div className="p-4 border-b">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-red rounded-full flex items-center justify-center text-white font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.role}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4">
              <ul className="space-y-2">
                {menuItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="w-5 h-5" />
                      <span className="hindi-text">{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t">
              <button
                onClick={handleLogout}
                className="flex items-center space-x-3 px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="hindi-text">लॉगआउट</span>
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          <div className="p-6">
            {/* Header */}
            <div className="hidden lg:block mb-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 hindi-text">एडमिन पैनल</h1>
                <div className="flex items-center space-x-4">
                  <Link
                    href="/"
                    className="text-primary-red hover:underline hindi-text"
                  >
                    वेबसाइट देखें
                  </Link>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary-red rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-gray-700">{user.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Page Content */}
            {children}
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}