'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'

interface OTPLoginPanelProps {
  isOpen: boolean
  onClose: () => void
}

type Step = 'email' | 'otp' | 'registration'

export default function OTPLoginPanel({ isOpen, onClose }: OTPLoginPanelProps) {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [countdown, setCountdown] = useState(0)
  
  const { login } = useAuth()

  // Countdown timer for resend OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendOTP = async () => {
    if (!email || !email.includes('@')) {
      setError('कृपया वैध ईमेल दर्ज करें')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setStep('otp')
        setSuccess('OTP आपके ईमेल पर भेज दिया गया है')
        setCountdown(60) // 60 seconds countdown
      } else {
        setError(data.error || 'OTP भेजने में त्रुटि')
      }
    } catch (error) {
      setError('कनेक्शन त्रुटि। कृपया पुनः प्रयास करें।')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      setError('कृपया 6 अंकों का OTP दर्ज करें')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      })
      
      const data = await response.json()
      
      if (data.success) {
        if (data.isNewUser) {
          setStep('registration')
          setSuccess('OTP सत्यापित! कृपया अपना विवरण भरें')
        } else {
          // Existing user - login successful
          login(data.user)
          setSuccess('सफलतापूर्वक लॉगिन हो गए!')
          setTimeout(() => {
            onClose()
            resetForm()
          }, 1500)
        }
      } else {
        setError(data.error || 'OTP सत्यापन में त्रुटि')
      }
    } catch (error) {
      setError('कनेक्शन त्रुटि। कृपया पुनः प्रयास करें।')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteRegistration = async () => {
    if (!name.trim()) {
      setError('कृपया अपना नाम दर्ज करें')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/auth/complete-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        login(data.user)
        setSuccess('खाता सफलतापूर्वक बनाया गया!')
        setTimeout(() => {
          onClose()
          resetForm()
        }, 1500)
      } else {
        setError(data.error || 'पंजीकरण में त्रुटि')
      }
    } catch (error) {
      setError('कनेक्शन त्रुटि। कृपया पुनः प्रयास करें।')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setStep('email')
    setEmail('')
    setOtp('')
    setName('')
    setPassword('')
    setError('')
    setSuccess('')
    setCountdown(0)
  }

  const handleClose = () => {
    onClose()
    resetForm()
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300"
        onClick={handleClose}
      />
      
      {/* Panel */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl z-50 transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}>
        
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-red rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🇮🇳</span>
            </div>
            <div>
              <h2 className="text-lg font-bold hindi-text">Bharat First TV में लॉगिन करें</h2>
              <p className="text-sm text-gray-600 hindi-text">OTP के साथ तुरंत लॉगिन करें</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-96 overflow-y-auto">
          
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm hindi-text">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm hindi-text">{success}</p>
            </div>
          )}

          {/* Step 1: Email */}
          {step === 'email' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 hindi-text">
                  ईमेल पता
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="आपका ईमेल दर्ज करें"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent hindi-text"
                  disabled={loading}
                />
              </div>
              
              <button
                onClick={handleSendOTP}
                disabled={loading}
                className="w-full bg-primary-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed hindi-text"
              >
                {loading ? 'भेजा जा रहा है...' : 'OTP भेजें'}
              </button>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 hindi-text">
                  OTP कोड
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="6 अंकों का OTP दर्ज करें"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent text-center text-2xl font-mono tracking-widest"
                  disabled={loading}
                  maxLength={6}
                />
                <p className="text-xs text-gray-500 mt-1 hindi-text">
                  OTP {email} पर भेजा गया है
                </p>
              </div>
              
              <button
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
                className="w-full bg-primary-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed hindi-text"
              >
                {loading ? 'सत्यापित किया जा रहा है...' : 'OTP सत्यापित करें'}
              </button>
              
              <div className="flex justify-between items-center">
                <button
                  onClick={() => setStep('email')}
                  className="text-sm text-gray-600 hover:text-gray-800 hindi-text"
                >
                  ← ईमेल बदलें
                </button>
                
                <button
                  onClick={handleSendOTP}
                  disabled={countdown > 0 || loading}
                  className="text-sm text-primary-red hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed hindi-text"
                >
                  {countdown > 0 ? `पुनः भेजें (${countdown}s)` : 'OTP पुनः भेजें'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Registration */}
          {step === 'registration' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 hindi-text">
                  आपका नाम *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="पूरा नाम दर्ज करें"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent hindi-text"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 hindi-text">
                  पासवर्ड (वैकल्पिक)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="पासवर्ड सेट करें (वैकल्पिक)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-transparent"
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1 hindi-text">
                  भविष्य में तेज़ लॉगिन के लिए पासवर्ड सेट करें
                </p>
              </div>
              
              <button
                onClick={handleCompleteRegistration}
                disabled={loading || !name.trim()}
                className="w-full bg-primary-red text-white py-3 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed hindi-text"
              >
                {loading ? 'खाता बनाया जा रहा है...' : 'खाता बनाएं'}
              </button>
              
              <button
                onClick={() => setStep('otp')}
                className="w-full text-sm text-gray-600 hover:text-gray-800 hindi-text"
              >
                ← वापस जाएं
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 rounded-t-2xl">
          <p className="text-xs text-gray-500 text-center hindi-text">
            लॉगिन करके आप हमारी <span className="text-primary-red">सेवा की शर्तें</span> और <span className="text-primary-red">गोपनीयता नीति</span> से सहमत हैं
          </p>
        </div>
      </div>
    </>
  )
}