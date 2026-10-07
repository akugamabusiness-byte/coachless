// src/app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import { PresenceProvider } from '@/lib/presence/PresenceProvider'
import LayoutWithPanel from '@/components/LayoutWithPanel'

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
        className={`${inter.className} min-h-screen bg-[#010a13] text-[#f0e6d2] antialiased`}
      >
        <PresenceProvider>
          <div className="flex min-h-screen flex-col">
            <Navbar />

            <LayoutWithPanel>{children}</LayoutWithPanel>

            {/* Global footer */}
            <footer className="relative border-t border-[#1e3a5f] py-12 text-center">
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute bottom-0 left-1/2 h-32 w-96 -translate-x-1/2 rounded-full bg-[#c8aa6e]/5 blur-[80px]" />
              </div>
              <div className="relative">
                <p className="text-sm text-[#5b5a56]">
                  LoL Coachless — Made by{' '}
                  <span className="aku-signature-wrapper">
                    <span className="aku-particle" />
                    <span className="aku-particle" />
                    <span className="aku-particle" />
                    <span className="aku-particle" />
                    <span className="aku-particle" />
                    <span className="aku-particle" />
                    <span className="aku-signature">AKU</span>
                  </span>
                </p>
                <p className="mt-3 text-[10px] uppercase tracking-widest text-[#5b5a56]/60">
                  © 2026 · Tüm hakları saklıdır
                </p>
              </div>
            </footer>
          </div>
        </PresenceProvider>
      </body>
    </html>
  )
}