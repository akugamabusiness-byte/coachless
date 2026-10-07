// src/components/MemberPanel.tsx
'use client'

import { useState } from 'react'
import { usePresence, type OnlineUser } from '@/lib/presence/PresenceProvider'
import UserCard from './UserCard'
import UserProfileCard from './UserProfileCard'

type Props = {
  open: boolean
  onClose: () => void
}

type SelectedUser = {
  user: OnlineUser
  anchorRect: DOMRect
}

const ROLE_GROUPS: {
  key: string
  label: string
  icon: string
  color: string
}[] = [
  { key: 'admin', label: 'Yönetici', icon: '👑', color: 'text-[#c8aa6e]' },
  { key: 'moderator', label: 'Moderatör', icon: '🛡️', color: 'text-[#7b3fe4]' },
  { key: 'member', label: 'Üye', icon: '⚔️', color: 'text-[#a09b8c]' },
  { key: 'guest', label: 'Misafir', icon: '👤', color: 'text-[#5b5a56]' },
]

export default function MemberPanel({ open, onClose }: Props) {
  const { onlineUsers } = usePresence()
  const [selected, setSelected] = useState<SelectedUser | null>(null)

  const grouped = onlineUsers.reduce<Record<string, OnlineUser[]>>(
    (acc, u) => {
      const role = u.role || 'member'
      if (!acc[role]) acc[role] = []
      acc[role].push(u)
      return acc
    },
    {}
  )

  const totalOnline = onlineUsers.filter((u) => u.status !== 'offline').length

  return (
    <>
      {/* Mobil için arka plan karartma */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden ${
          open ? 'block' : 'hidden'
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <aside
        className={`
          fixed right-0 top-16 bottom-0 z-40 w-72
          overflow-y-auto border-l border-white/[0.04]
          bg-[#0a1428]/95 backdrop-blur-xl
          lg:static lg:top-auto lg:bottom-auto lg:z-0
          lg:block lg:h-auto lg:w-72
          lg:bg-transparent lg:backdrop-blur-none
          ${open ? 'block' : 'hidden'}
          lg:!block
        `}
        style={{ scrollbarWidth: 'thin' }}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 border-b border-white/[0.04] bg-[#0a1428]/90 px-4 py-3 backdrop-blur-xl lg:bg-[#0a1428]/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#f0e6d2]">
                Üyeler
              </span>
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400">
                {totalOnline} çevrimiçi
              </span>
            </div>
            <button
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center rounded-md text-[#5b5a56] transition hover:bg-white/[0.04] hover:text-[#a09b8c] lg:hidden"
              title="Kapat"
            >
              ✕
            </button>
          </div>
        </div>

        {/* İçerik */}
        {onlineUsers.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-3xl">👻</div>
            <p className="mt-3 text-xs text-[#5b5a56]">
              Şu an çevrimiçi kimse yok
            </p>
          </div>
        ) : (
          <div className="space-y-4 p-3">
            {ROLE_GROUPS.map((group) => {
              const users = grouped[group.key] ?? []
              if (users.length === 0) return null

              return (
                <div key={group.key}>
                  <div className="mb-1 flex items-center gap-1.5 px-2">
                    <span className={`text-xs ${group.color}`}>
                      {group.icon}
                    </span>
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-[#5b5a56]">
                      {group.label}
                    </span>
                    <span className="text-[10px] text-[#5b5a56]">
                      — {users.length}
                    </span>
                  </div>

                  <div className="space-y-0.5">
                    {users.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        onClick={(rect) =>
                          setSelected({ user, anchorRect: rect })
                        }
                      />
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Alt bilgi */}
        <div className="border-t border-white/[0.04] p-3">
          <div className="flex items-center gap-2 text-[10px] text-[#5b5a56]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            <span>Canlı güncelleniyor</span>
          </div>
        </div>
      </aside>

      {/* Profil kartı popover */}
      {selected && (
        <UserProfileCard
          user={selected.user}
          anchorRect={selected.anchorRect}
          onClose={() => setSelected(null)}
        />
      )}
    </>
  )
}