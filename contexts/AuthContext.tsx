'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { mockAPI } from '@/lib/database'

interface User {
  id: number
  name: string
  email: string
  role: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  isLoggedIn: boolean
  isAdmin: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('bharatfirsttv_user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (email: string, password: string) => {
    const result = await mockAPI.login(email, password)
    if (result.success && result.user) {
      setUser(result.user as User)
      localStorage.setItem('bharatfirsttv_user', JSON.stringify(result.user))
      return { success: true }
    }
    return { success: false, error: result.error || 'Login failed' }
  }

  const register = async (name: string, email: string, password: string) => {
    const result = await mockAPI.register(name, email, password)
    if (result.success && result.user) {
      setUser(result.user as User)
      localStorage.setItem('bharatfirsttv_user', JSON.stringify(result.user))
      return { success: true }
    }
    return { success: false, error: result.error || 'Registration failed' }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('bharatfirsttv_user')
  }

  const value = {
    user,
    login,
    register,
    logout,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}