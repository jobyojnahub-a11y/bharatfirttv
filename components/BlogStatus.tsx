'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Wifi, WifiOff } from 'lucide-react'

interface BlogStatusProps {
  postsCount: number
  isWordPressConnected: boolean
}

export default function BlogStatus({ postsCount, isWordPressConnected }: BlogStatusProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    // Auto hide after 5 seconds if WordPress is connected
    if (isWordPressConnected) {
      const timer = setTimeout(() => setIsVisible(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isWordPressConnected])

  if (!isVisible) return null

  return (
    <div className={`fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
      isWordPressConnected 
        ? 'bg-green-50 border border-green-200 text-green-800' 
        : 'bg-yellow-50 border border-yellow-200 text-yellow-800'
    }`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {isWordPressConnected ? (
            <div className="flex items-center space-x-1">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <Wifi className="w-4 h-4 text-green-600" />
            </div>
          ) : (
            <div className="flex items-center space-x-1">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <WifiOff className="w-4 h-4 text-yellow-600" />
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-sm mb-1">
            {isWordPressConnected ? 'Blog Connected ✅' : 'Blog Connection Issue ⚠️'}
          </h3>
          <p className="text-xs leading-relaxed">
            {isWordPressConnected ? (
              <>
                <strong>{postsCount} posts</strong> successfully loaded from{' '}
                <code className="bg-green-100 px-1 rounded">blog.bharatfirsttv.com</code>
              </>
            ) : (
              <>
                Unable to fetch from{' '}
                <code className="bg-yellow-100 px-1 rounded">blog.bharatfirsttv.com</code>
                <br />
                Showing fallback content instead.
              </>
            )}
          </p>
        </div>
        
        <button
          onClick={() => setIsVisible(false)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <span className="sr-only">Close</span>
          ×
        </button>
      </div>
    </div>
  )
}