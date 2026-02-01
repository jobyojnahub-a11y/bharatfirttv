import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'भारत FIRST - भारत की आवाज़',
  description: 'भारत की सबसे विश्वसनीय न्यूज वेबसाइट - ताज़ा समाचार, राजनीति, खेल, मनोरंजन',
  keywords: 'news, india, politics, sports, entertainment, bharat, hindi news, समाचार',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}