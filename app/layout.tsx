import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bharat First TV - भारत फर्स्ट टीवी',
  description: 'Latest news, politics, sports, entertainment and more from India and around the world',
  keywords: 'news, india, politics, sports, entertainment, bharat, hindi news',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hi">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}