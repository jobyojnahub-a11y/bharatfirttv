'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { X, Mail, Lock, User } from 'lucide-react'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login, register } = useAuth()

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      let result
      if (isLogin) {
        result = await login(formData.email, formData.password)
      } else {
        result = await register(formData.name, formData.email, formData.password)
      }

      if (result.success) {
        onClose()
        setFormData({ name: '', email: '', password: '' })
        setStep(1)
      } else {
        setError(result.error || 'Something went wrong')
      }
    } catch (err) {
      setError('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && !formData.email) {
      setError('कृपया ईमेल दर्ज करें')
      return
    }
    if (step === 2 && !isLogin && !formData.name) {
      setError('कृपया नाम दर्ज करें')
      return
    }
    if (step === 3 && !formData.password) {
      setError('कृपया पासवर्ड दर्ज करें')
      return
    }
    
    setError('')
    if (step < 3) {
      setStep(step + 1)
    }
  }

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Mail className="w-16 h-16 text-primary-red mx-auto mb-4" />
              <h3 className="text-xl font-bold hindi-text mb-2">
                {isLogin ? 'अपना ईमेल दर्ज करें' : 'ईमेल से शुरुआत करें'}
              </h3>
            </div>
            <input
              type="email"
              placeholder="आपका ईमेल पता"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
              autoFocus
            />
            <button
              onClick={nextStep}
              className="w-full bg-primary-red text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              आगे बढ़ें
            </button>
          </div>
        )

      case 2:
        if (isLogin) {
          return (
            <div className="space-y-4">
              <div className="text-center">
                <Lock className="w-16 h-16 text-primary-red mx-auto mb-4" />
                <h3 className="text-xl font-bold hindi-text mb-2">पासवर्ड दर्ज करें</h3>
                <p className="text-gray-600">{formData.email}</p>
              </div>
              <input
                type="password"
                placeholder="आपका पासवर्ड"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                autoFocus
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-primary-red text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'लॉगिन हो रहा है...' : 'लॉगिन करें'}
              </button>
            </div>
          )
        } else {
          return (
            <div className="space-y-4">
              <div className="text-center">
                <User className="w-16 h-16 text-primary-red mx-auto mb-4" />
                <h3 className="text-xl font-bold hindi-text mb-2">अपना नाम दर्ज करें</h3>
              </div>
              <input
                type="text"
                placeholder="आपका पूरा नाम"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                autoFocus
              />
              <button
                onClick={nextStep}
                className="w-full bg-primary-red text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                आगे बढ़ें
              </button>
            </div>
          )
        }

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center">
              <Lock className="w-16 h-16 text-primary-red mx-auto mb-4" />
              <h3 className="text-xl font-bold hindi-text mb-2">पासवर्ड बनाएं</h3>
              <p className="text-gray-600">{formData.email}</p>
            </div>
            <input
              type="password"
              placeholder="एक मजबूत पासवर्ड बनाएं"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
              autoFocus
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary-red text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'अकाउंट बन रहा है...' : 'अकाउंट बनाएं'}
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <div className="bg-white w-full max-w-md rounded-t-2xl p-6 animate-slide-up">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold hindi-text">
            {isLogin ? 'लॉगिन करें' : 'अकाउंट बनाएं'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {renderStep()}
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setStep(1)
              setError('')
              setFormData({ name: '', email: '', password: '' })
            }}
            className="text-primary-red hover:underline"
          >
            {isLogin ? 'नया अकाउंट बनाएं' : 'पहले से अकाउंट है? लॉगिन करें'}
          </button>
        </div>

        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="mt-4 text-gray-600 hover:text-gray-800"
          >
            ← वापस जाएं
          </button>
        )}
      </div>
    </div>
  )
}