// src/components/ChampionPicker.tsx
'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { CHAMPIONS, getChampionIconUrl } from '@/lib/lol/data'

type Props = {
  value: string // seçili şampiyon adı ('Ahri' gibi)
  onChange: (championName: string) => void
  required?: boolean
}

export default function ChampionPicker({ value, onChange, required }: Props) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  // Şampiyon ID'yi bul (isim üzerinden)
  const selectedChampion = useMemo(
    () => CHAMPIONS.find((c) => c.name === value),
    [value]
  )

  const filtered = useMemo(() => {
    if (!search.trim()) return CHAMPIONS
    const q = search.toLowerCase()
    return CHAMPIONS.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.id.toLowerCase().includes(q)
    )
  }, [search])

  if (selectedChampion && !open) {
    return (
      <div className="flex items-center gap-3 rounded-md border border-[#c8aa6e] bg-[#0a1428] p-3">
        <Image
          src={getChampionIconUrl(selectedChampion.id)}
          alt={selectedChampion.name}
          width={48}
          height={48}
          className="rounded-md border border-[#785a28]"
          unoptimized
        />
        <div className="flex-1">
          <div className="text-xs uppercase tracking-widest text-[#5b5a56]">
            Seçili Şampiyon
          </div>
          <div className="text-sm font-medium text-[#f0e6d2]">
            {selectedChampion.name}
          </div>
        </div>
        <button
          type="button"
          onClick={() => {
            setOpen(true)
            onChange('')
          }}
          className="rounded-md border border-[#1e3a5f] px-3 py-1.5 text-xs text-[#a09b8c] transition hover:border-[#c8aa6e] hover:text-[#c8aa6e]"
        >
          Değiştir
        </button>

        {/* Gizli required input — form validasyonu için */}
        {required && (
          <input type="hidden" value={value} required />
        )}
      </div>
    )
  }

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setOpen(true)}
        placeholder="Şampiyon ara... (örn. Ahri, Yasuo)"
        className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1428] px-3 py-2.5 text-[#f0e6d2] placeholder-[#5b5a56] outline-none transition focus:border-[#c8aa6e]"
      />

      {open && (
        <>
          {/* Grid */}
          <div className="mt-3 max-h-80 overflow-y-auto rounded-md border border-[#1e3a5f] bg-[#0a1428] p-2">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#5b5a56]">
                Sonuç bulunamadı
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                {filtered.map((champ) => (
                  <button
                    key={champ.id}
                    type="button"
                    onClick={() => {
                      onChange(champ.name)
                      setOpen(false)
                      setSearch('')
                    }}
                    className="group flex flex-col items-center gap-1 rounded-md p-1 transition hover:bg-[#111d35]"
                    title={champ.name}
                  >
                    <Image
                      src={getChampionIconUrl(champ.id)}
                      alt={champ.name}
                      width={56}
                      height={56}
                      className="rounded-md border-2 border-transparent transition group-hover:border-[#c8aa6e]"
                      unoptimized
                    />
                    <span className="w-full truncate text-center text-[10px] text-[#a09b8c] group-hover:text-[#f0e6d2]">
                      {champ.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Kapat */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-2 text-xs text-[#5b5a56] hover:text-[#a09b8c]"
          >
            ✕ Kapat
          </button>
        </>
      )}
    </div>
  )
}