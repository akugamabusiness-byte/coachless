// src/components/MemberListToggle.tsx
'use client'

import { usePresence } from '@/lib/presence/PresenceProvider'

type Props = {
  onClick: () => void
  isOpen: boolean
}

export default function MemberListToggle({ onClick, isOpen }: Props) {
  const { onlineUsers } = usePresence()
  const count = onlineUsers.filter((u) => u.status !== 'offline').length

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex items-center gap-2 rounded-md border px-2.5 py-1.5 transition-all duration-200 ${
        isOpen
          ? 'border-[#c8aa6e]/40 bg-[#785a28]/10 text-[#c8aa6e]'
          : 'border-[#1e3a5f] text-[#a09b8c] hover:border-[#785a28] hover:text-[#f0e6d2]'
      }`}
      title={isOpen ? 'Üye listesini kapat' : 'Üye listesini aç'}
    >
      <span className="text-sm">👥</span>
      <span className="text-xs font-medium">{count}</span>
      <span className="hidden text-[10px] text-[#5b5a56] sm:inline">
        üye
      </span>
    </button>
  )
}