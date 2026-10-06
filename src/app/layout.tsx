// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LoL Coachless',
  description: 'League of Legends build paylaşım platformu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr">
      <body
        className={`${inter.className} min-h-screen bg-gray-950 text-white antialiased`}
      >
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}