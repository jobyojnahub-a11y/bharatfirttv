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
  currentUser: User | null
  login: (emailOrUser: string | User, password?: string) => Promise<{ success: boolean; error?: string }>
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

  const login = async (emailOrUser: string | User, password?: string) => {
    // If User object is passed directly (from OTP login)
    if (typeof emailOrUser === 'object' && emailOrUser !== null) {
      setUser(emailOrUser)
      localStorage.setItem('bharatfirsttv_user', JSON.stringify(emailOrUser))
      return { success: true }
    }
    
    // Traditional email/password login
    if (typeof emailOrUser === 'string' && password) {
      const result = await mockAPI.login(emailOrUser, password)
      if (result.success && result.user) {
        setUser(result.user as User)
        localStorage.setItem('bharatfirsttv_user', JSON.stringify(result.user))
        return { success: true }
      }
      return { success: false, error: result.error || 'Login failed' }
    }
    
    return { success: false, error: 'Invalid login parameters' }
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
    currentUser: user,
    login,
    register,
    logout,
    isLoggedIn: !!user,
    isAdmin: user?.role === 'admin'
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}