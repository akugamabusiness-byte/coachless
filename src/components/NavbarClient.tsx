// src/components/NavbarClient.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { usePresence } from '@/lib/presence/PresenceProvider'
import StatusDot from './StatusDot'
import ProfileEditModal from './ProfileEditModal'

type Props = {
  userEmail: string | null
  avatarUrl?: string | null
  displayName?: string | null
}

export default function NavbarClient({
  userEmail,
  avatarUrl,
  displayName,
}: Props) {
  const pathname = usePathname()
  const { currentUserStatus } = usePresence()
  const [modalOpen, setModalOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const linkClass = (path: string) =>
    `relative px-3 py-2 text-sm font-medium transition-colors ${
      isActive(path)
        ? 'text-[#c8aa6e]'
        : 'text-[#a09b8c] hover:text-[#f0e6d2]'
    }`

  const initial = (displayName?.[0] ?? userEmail?.[0] ?? 'U').toUpperCase()

  return (
    <>
      <nav className="sticky top-0 z-50 border-b border-[#1e3a5f] bg-[#010a13]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="group flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-0 rounded-md bg-gradient-to-br from-[#c8aa6e] to-[#785a28] opacity-50 blur-sm transition group-hover:opacity-100" />
              <div className="relative flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[#c8aa6e] to-[#785a28] text-sm font-bold text-[#010a13]">
                LC
              </div>
            </div>
            <span className="text-lg font-semibold tracking-tight text-gradient-gold">
              LoL Coachless
            </span>
          </Link>

          {/* Orta linkler */}
          <div className="hidden items-center gap-1 md:flex">
            <Link href="/" className={linkClass('/')}>
              Ana Sayfa
              {isActive('/') && (
                <span className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-[#c8aa6e]" />
              )}
            </Link>
            <Link href="/builds" className={linkClass('/builds')}>
              Build&apos;ler
              {isActive('/builds') && pathname !== '/' && (
                <span className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-[#c8aa6e]" />
              )}
            </Link>
            {userEmail && (
              <>
                <Link href="/dashboard" className={linkClass('/dashboard')}>
                  Panel
                  {pathname === '/dashboard' && (
                    <span className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-[#c8aa6e]" />
                  )}
                </Link>
                <Link
                  href="/dashboard/builds"
                  className={linkClass('/dashboard/builds')}
                >
                  Build&apos;lerim
                  {pathname === '/dashboard/builds' && (
                    <span className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-[#c8aa6e]" />
                  )}
                </Link>
                <Link
                  href="/dashboard/favorites"
                  className={linkClass('/dashboard/favorites')}
                >
                  Favorilerim
                  {pathname === '/dashboard/favorites' && (
                    <span className="absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 bg-[#c8aa6e]" />
                  )}
                </Link>
              </>
            )}
          </div>

          {/* Sağ taraf */}
          <div className="flex items-center gap-2">
            {userEmail ? (
              <>
                {/* Kullanıcı kartı - tıklanabilir */}
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="hidden items-center gap-2 rounded-md border border-[#1e3a5f] bg-[#111d35] px-2 py-1.5 transition hover:border-[#785a28] sm:flex"
                  title="Profili Düzenle"
                >
                  <div className="relative">
                    {avatarUrl ? (
                      <Image
                        src={avatarUrl}
                        alt={displayName ?? 'Avatar'}
                        width={28}
                        height={28}
                        className="rounded-full border border-[#785a28] object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[#c8aa6e] to-[#785a28] text-[10px] font-bold text-[#010a13]">
                        {initial}
                      </div>
                    )}
                    <div className="absolute -bottom-0.5 -right-0.5">
                      <StatusDot status={currentUserStatus} size="sm" />
                    </div>
                  </div>
                  <span className="max-w-[120px] truncate text-xs text-[#a09b8c]">
                    {displayName ?? userEmail}
                  </span>
                </button>

                <Link
                  href="/api/logout"
                  className="rounded-md border border-[#1e3a5f] px-3 py-1.5 text-xs font-medium text-[#a09b8c] transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                >
                  Çıkış
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-sm text-[#a09b8c] transition hover:text-[#f0e6d2]"
                >
                  Giriş
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-gradient-to-br from-[#c8aa6e] to-[#785a28] px-4 py-1.5 text-sm font-medium text-[#010a13] transition hover:shadow-[0_0_20px_rgba(200,170,110,0.4)]"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Profil Düzenleme Modal'ı */}
      <ProfileEditModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}