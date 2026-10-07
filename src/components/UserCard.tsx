// src/components/UserCard.tsx
'use client'

import { useRef } from 'react'
import Image from 'next/image'
import StatusDot from './StatusDot'
import type { OnlineUser } from '@/lib/presence/PresenceProvider'

type Props = {
  user: OnlineUser
  onClick?: (anchorRect: DOMRect) => void
}

const ROLE_BADGES: Record<string, { icon: string; color: string; label: string }> = {
  admin: {
    icon: '👑',
    color: 'text-[#c8aa6e]',
    label: 'Yönetici',
  },
  moderator: {
    icon: '🛡️',
    color: 'text-[#7b3fe4]',
    label: 'Moderatör',
  },
  member: {
    icon: '⚔️',
    color: 'text-[#a09b8c]',
    label: 'Üye',
  },
  guest: {
    icon: '👤',
    color: 'text-[#5b5a56]',
    label: 'Misafir',
  },
}

export default function UserCard({ user, onClick }: Props) {
  const ref = useRef<HTMLButtonElement>(null)

  const displayName =
    user.display_name ?? user.username ?? user.email ?? 'Anonim'
  const initial = displayName[0]?.toUpperCase() ?? 'U'
  const roleInfo = ROLE_BADGES[user.role] ?? ROLE_BADGES.member
  const isOffline = user.status === 'offline'

  function handleClick() {
    if (onClick && ref.current) {
      onClick(ref.current.getBoundingClientRect())
    }
  }

  return (
    <button
      ref={ref}
      onClick={handleClick}
      className={`group flex w-full items-center gap-3 rounded-md px-2 py-1.5 text-left transition-all duration-200 hover:bg-white/[0.04] ${
        isOffline ? 'opacity-50 hover:opacity-100' : ''
      }`}
    >
      {/* Avatar + durum noktası */}
      <div className="relative shrink-0">
        {user.avatar_url ? (
          <Image
            src={user.avatar_url}
            alt={displayName}
            width={32}
            height={32}
            className="h-8 w-8 rounded-full border border-[#785a28]/60 object-cover transition-all duration-200 group-hover:border-[#c8aa6e]"
            unoptimized
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#c8aa6e] to-[#785a28] text-xs font-bold text-[#010a13]">
            {initial}
          </div>
        )}

        <div className="absolute -bottom-0.5 -right-0.5">
          <StatusDot status={user.status} size="sm" />
        </div>
      </div>

      {/* İsim + özel durum */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-xs font-medium text-[#f0e6d2]">
            {displayName}
          </span>
          <span
            className={`shrink-0 text-[10px] ${roleInfo.color}`}
            title={roleInfo.label}
          >
            {roleInfo.icon}
          </span>
        </div>
        {user.custom_status ? (
          <div className="truncate text-[10px] text-[#a09b8c]">
            {user.custom_status}
          </div>
        ) : (
          <div className="truncate text-[10px] text-[#5b5a56]">
            @{user.username ?? user.email ?? 'user'}
          </div>
        )}
      </div>
    </button>
  )
}