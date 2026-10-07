// src/components/StatusDot.tsx
'use client'

import type { PresenceStatus } from '@/lib/presence/PresenceProvider'

type Props = {
  status: PresenceStatus
  size?: 'sm' | 'md' | 'lg'
  className?: string
  pulse?: boolean
}

const STATUS_COLORS: Record<PresenceStatus, string> = {
  online: 'bg-emerald-500',
  idle: 'bg-yellow-500',
  dnd: 'bg-red-500',
  offline: 'bg-gray-500',
}

const STATUS_LABELS: Record<PresenceStatus, string> = {
  online: 'Çevrimiçi',
  idle: 'Boşta',
  dnd: 'Rahatsız Etme',
  offline: 'Çevrimdışı',
}

const SIZE_CLASSES = {
  sm: 'h-3 w-3 border-2',
  md: 'h-4 w-4 border-2',
  lg: 'h-5 w-5 border-[3px]',
}

export default function StatusDot({
  status,
  size = 'md',
  className = '',
  pulse = true,
}: Props) {
  // Sadece online iken pulse
  const pulseClass =
    pulse && status === 'online' ? 'status-pulse-online' : ''

  return (
    <span
      className={`inline-block rounded-full border-[#010a13] transition-all duration-300 ${STATUS_COLORS[status]} ${SIZE_CLASSES[size]} ${pulseClass} ${className}`}
      title={STATUS_LABELS[status]}
    />
  )
}