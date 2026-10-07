// src/lib/presence/StatusPicker.tsx
'use client'

import type { PresenceStatus } from './PresenceProvider'
import StatusDot from '@/components/StatusDot'

type Props = {
  value: PresenceStatus
  onChange: (status: PresenceStatus) => void
}

const STATUS_OPTIONS: { value: PresenceStatus; label: string; desc: string }[] = [
  {
    value: 'online',
    label: 'Çevrimiçi',
    desc: 'Herkes seni burada görsün',
  },
  {
    value: 'idle',
    label: 'Boşta',
    desc: 'Uzakta olduğunu göster',
  },
  {
    value: 'dnd',
    label: 'Rahatsız Etme',
    desc: 'Bildirimleri kapat, rahatsız edilme',
  },
  {
    value: 'offline',
    label: 'Görünmez',
    desc: 'Sanki çevrimdışı görün',
  },
]

export default function StatusPicker({ value, onChange }: Props) {
  return (
    <div className="space-y-1">
      {STATUS_OPTIONS.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition ${
            value === opt.value
              ? 'bg-[#785a28]/20 text-[#f0e6d2]'
              : 'text-[#a09b8c] hover:bg-[#111d35]'
          }`}
        >
          <StatusDot status={opt.value} size="md" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-medium">{opt.label}</div>
            <div className="text-xs text-[#5b5a56]">{opt.desc}</div>
          </div>
          {value === opt.value && (
            <span className="text-[#c8aa6e]">✓</span>
          )}
        </button>
      ))}
    </div>
  )
}