// src/components/NavbarClient.tsx
'use client'

import Link from 'next/link'

type Props = {
  userEmail: string | null
}

export default function NavbarClient({ userEmail }: Props) {
  return (
    <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Sol: Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-yellow-500">
            LoL Coachless
          </span>
        </Link>

        {/* Orta: Ana linkler */}
        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm text-gray-300 transition hover:text-white"
          >
            Ana Sayfa
          </Link>
          <Link
            href="/builds"
            className="text-sm text-gray-300 transition hover:text-white"
          >
            Build&apos;ler
          </Link>
          {userEmail && (
            <>
              <Link
                href="/dashboard"
                className="text-sm text-gray-300 transition hover:text-white"
              >
                Panel
              </Link>
              <Link
                href="/dashboard/favorites"
                className="text-sm text-gray-300 transition hover:text-white"
              >
                Favorilerim
              </Link>
            </>
          )}
        </div>

        {/* Sağ: Auth butonları */}
        <div className="flex items-center gap-3">
          {userEmail ? (
            <>
              <span className="hidden text-sm text-gray-400 sm:inline">
                {userEmail}
              </span>
              <Link
                href="/api/logout"
                className="rounded-md border border-gray-700 px-3 py-1.5 text-sm text-gray-300 transition hover:border-red-500 hover:text-red-400"
              >
                Çıkış
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm text-gray-300 transition hover:text-white"
              >
                Giriş
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-yellow-500 px-3 py-1.5 text-sm font-medium text-gray-950 transition hover:bg-yellow-400"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}