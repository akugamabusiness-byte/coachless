// src/components/UserProfileCard.tsx
'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { OnlineUser } from '@/lib/presence/PresenceProvider'
import StatusDot from './StatusDot'
import { usePresence } from '@/lib/presence/PresenceProvider'

type Props = {
  user: OnlineUser
  anchorRect: DOMRect | null
  onClose: () => void
}

const ROLE_INFO: Record<string, { label: string; icon: string; color: string; bg: string }> = {
  admin: {
    label: 'Yönetici',
    icon: '👑',
    color: 'text-[#c8aa6e]',
    bg: 'bg-[#c8aa6e]/10',
  },
  moderator: {
    label: 'Moderatör',
    icon: '🛡️',
    color: 'text-[#7b3fe4]',
    bg: 'bg-[#7b3fe4]/10',
  },
  member: {
    label: 'Üye',
    icon: '⚔️',
    color: 'text-[#a09b8c]',
    bg: 'bg-[#a09b8c]/10',
  },
  guest: {
    label: 'Misafir',
    icon: '👤',
    color: 'text-[#5b5a56]',
    bg: 'bg-[#5b5a56]/10',
  },
}

const ROLE_LABELS: Record<string, string> = {
  top: '⚔️ Üst Koridor',
  jungle: '🌲 Orman',
  mid: '🔮 Orta Koridor',
  adc: '🏹 Alt Koridor',
  support: '🛡️ Destek',
}

export default function UserProfileCard({ user, anchorRect, onClose }: Props) {
  const { user: currentUser } = usePresence()
  const cardRef = useRef<HTMLDivElement>(null)

  const isMe = currentUser?.id === user.id
  const displayName = user.display_name ?? user.username ?? 'Anonim'
  const initial = displayName[0]?.toUpperCase() ?? 'U'
  const roleInfo = ROLE_INFO[user.role] ?? ROLE_INFO.member

  // Dışına tıklayınca kapat
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        onClose()
      }
    }
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    // Küçük bir gecikme — açılma tıklamasının hemen kapatmasını önler
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick)
      document.addEventListener('keydown', handleEsc)
    }, 0)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [onClose])

  // Konum hesapla (panelden sola doğru)
  const cardWidth = 320
  const offset = 12
  let left = (anchorRect?.left ?? 0) - cardWidth - offset
  let top = (anchorRect?.top ?? 0) - 20

  // Ekran sınırları
  if (left < 16) left = 16
  if (top < 80) top = 80

  return (
    <div
      ref={cardRef}
      className="modal-content fixed z-[60] w-80 overflow-hidden rounded-xl border border-[#1e3a5f]/50 bg-[#0a1428] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.9)] ring-1 ring-white/[0.03]"
      style={{ left, top }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* ============ BANNER ============ */}
      <div className="relative h-24 overflow-hidden">
        {user.banner_url ? (
          <Image
            src={user.banner_url}
            alt="Banner"
            fill
            className="object-cover"
            unoptimized
          />
        ) : (
          <div
            className="banner-animated absolute inset-0"
            style={{
              backgroundImage:
                'linear-gradient(135deg, #785a28 0%, #7b3fe4 50%, #0a1428 100%)',
            }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1428] via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:14px_14px] opacity-40" />

        {/* Kapat */}
        <button
          onClick={onClose}
          className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-md bg-black/40 text-xs text-white/80 transition hover:bg-black/70 hover:text-white"
        >
          ✕
        </button>
      </div>

      {/* ============ AVATAR ============ */}
      <div className="relative -mt-8 flex items-end gap-3 px-4">
        <div className="relative shrink-0">
          {user.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={displayName}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full border-[3px] border-[#0a1428] object-cover"
              unoptimized
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full border-[3px] border-[#0a1428] bg-gradient-to-br from-[#c8aa6e] to-[#785a28] text-xl font-bold text-[#010a13]">
              {initial}
            </div>
          )}
          <div className="absolute bottom-0 right-0">
            <StatusDot status={user.status} size="md" />
          </div>
        </div>

        <div className="min-w-0 flex-1 pb-1">
          <div className="truncate text-sm font-semibold text-[#f0e6d2]">
            {displayName}
          </div>
          <div className="truncate text-xs text-[#5b5a56]">
            @{user.username ?? 'summoner'}
          </div>
        </div>
      </div>

      {/* ============ İÇERİK ============ */}
      <div className="space-y-3 p-4">
        {/* Rol etiketi */}
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium ${roleInfo.bg} ${roleInfo.color}`}
          >
            <span>{roleInfo.icon}</span>
            <span>{roleInfo.label}</span>
          </div>
          {user.status !== 'offline' && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-medium text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Çevrimiçi
            </div>
          )}
        </div>

        {/* Özel durum */}
        {user.custom_status && (
          <div className="rounded-md border border-white/[0.04] bg-white/[0.02] px-3 py-2">
            <div className="text-[10px] uppercase tracking-widest text-[#5b5a56]">
              Durum
            </div>
            <div className="mt-0.5 text-xs text-[#a09b8c]">
              {user.custom_status}
            </div>
          </div>
        )}

        {/* Hakkımda */}
        {user.bio && (
          <div>
            <div className="mb-1 text-[10px] uppercase tracking-widest text-[#5b5a56]">
              Hakkımda
            </div>
            <p className="whitespace-pre-wrap text-xs leading-relaxed text-[#a09b8c]">
              {user.bio}
            </p>
          </div>
        )}

        {/* Summoner + Rol */}
        <div className="grid grid-cols-2 gap-2">
          {user.summoner_name && (
            <div className="rounded-md border border-white/[0.04] bg-white/[0.02] px-3 py-2">
              <div className="text-[10px] uppercase tracking-widest text-[#5b5a56]">
                Summoner
              </div>
              <div className="mt-0.5 truncate text-xs text-[#c8aa6e]">
                {user.summoner_name}
              </div>
            </div>
          )}
          {user.primary_role && (
            <div className="rounded-md border border-white/[0.04] bg-white/[0.02] px-3 py-2">
              <div className="text-[10px] uppercase tracking-widest text-[#5b5a56]">
                Ana Rol
              </div>
              <div className="mt-0.5 truncate text-xs text-[#a09b8c]">
                {ROLE_LABELS[user.primary_role] ?? user.primary_role}
              </div>
            </div>
          )}
        </div>

        {/* Kendi profilin ise */}
        {isMe && (
          <Link
            href="/dashboard/profile"
            className="btn-glow flex items-center justify-center gap-2 rounded-md bg-gradient-to-br from-[#c8aa6e] to-[#785a28] px-4 py-2 text-xs font-semibold text-[#010a13] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(200,170,110,0.4)]"
            onClick={onClose}
          >
            ⚙️ Profili Düzenle
          </Link>
        )}

        {/* Kullanıcının build'lerine git */}
        {!isMe && (
          <Link
            href={`/builds?author=${user.id}`}
            className="flex items-center justify-center gap-2 rounded-md border border-white/[0.08] px-4 py-2 text-xs font-medium text-[#a09b8c] transition-all duration-200 hover:border-[#785a28] hover:text-[#f0e6d2]"
            onClick={onClose}
          >
            🔨 Build&apos;lerini Gör
          </Link>
        )}
      </div>
    </div>
  )
}