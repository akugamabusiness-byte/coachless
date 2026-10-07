// src/components/ItemPicker.tsx
'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { COMMON_ITEMS, getItemIconUrl, type Item } from '@/lib/lol/data'

type SelectedItem = {
  id: number
  name: string
}

type Props = {
  value: SelectedItem[]
  onChange: (items: SelectedItem[]) => void
  max?: number
}

export default function ItemPicker({ value, onChange, max = 6 }: Props) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)

  // Filtrelenmiş item listesi
  const filtered = useMemo(() => {
    if (!search.trim()) return COMMON_ITEMS
    const q = search.toLowerCase()
    return COMMON_ITEMS.filter((item) =>
      item.name.toLowerCase().includes(q)
    )
  }, [search])

  // Seçili item'ların ID'leri
  const selectedIds = useMemo(() => new Set(value.map((i) => i.id)), [value])

  // Item ekle
  function addItem(item: Item) {
    if (value.length >= max) return
    if (selectedIds.has(item.id)) return
    onChange([...value, { id: item.id, name: item.name }])
    setSearch('')
  }

  // Item çıkar
  function removeItem(itemId: number) {
    onChange(value.filter((i) => i.id !== itemId))
  }

  // Sıralamayı değiştir (sola/sağa kaydır)
  function moveItem(index: number, direction: -1 | 1) {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= value.length) return
    const newValue = [...value]
    const [moved] = newValue.splice(index, 1)
    newValue.splice(newIndex, 0, moved)
    onChange(newValue)
  }

  return (
    <div className="space-y-4">
      {/* Seçili item'lar */}
      {value.length > 0 && (
        <div className="rounded-lg border border-[#c8aa6e] bg-[#0a1428] p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-xs font-medium uppercase tracking-widest text-[#c8aa6e]">
              Seçili Item&apos;lar ({value.length}/{max})
            </div>
            {value.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs text-[#5b5a56] transition hover:text-red-400"
              >
                Tümünü Temizle
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            {value.map((item, index) => (
              <div
                key={item.id}
                className="group relative flex flex-col items-center"
              >
                {/* Sıra numarası */}
                <div className="absolute -left-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#c8aa6e] to-[#785a28] text-[10px] font-bold text-[#010a13]">
                  {index + 1}
                </div>

                {/* İkon */}
                <div className="relative">
                  <Image
                    src={getItemIconUrl(item.id)}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-md border-2 border-[#785a28] transition group-hover:border-[#c8aa6e]"
                    unoptimized
                  />

                  {/* Remove butonu */}
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#010a13] bg-red-600 text-xs text-white opacity-0 transition group-hover:opacity-100"
                    title="Kaldır"
                  >
                    ✕
                  </button>
                </div>

                {/* İsim */}
                <div className="mt-1 w-16 truncate text-center text-[10px] text-[#a09b8c]">
                  {item.name}
                </div>

                {/* Sıra değiştir butonları */}
                <div className="mt-1 flex gap-1">
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => moveItem(index, -1)}
                      className="rounded border border-[#1e3a5f] px-1.5 py-0.5 text-[10px] text-[#a09b8c] transition hover:border-[#c8aa6e] hover:text-[#c8aa6e]"
                      title="Sola kaydır"
                    >
                      ←
                    </button>
                  )}
                  {index < value.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveItem(index, 1)}
                      className="rounded border border-[#1e3a5f] px-1.5 py-0.5 text-[10px] text-[#a09b8c] transition hover:border-[#c8aa6e] hover:text-[#c8aa6e]"
                      title="Sağa kaydır"
                    >
                      →
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Arama kutusu */}
      <div>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={
            value.length >= max
              ? `Maksimum ${max} item seçildi`
              : "Item ara... (örn. Rabadon, Infinity, Zhonya)"
          }
          disabled={value.length >= max}
          className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1428] px-3 py-2.5 text-[#f0e6d2] placeholder-[#5b5a56] outline-none transition focus:border-[#c8aa6e] disabled:opacity-50"
        />
      </div>

      {/* Grid — açıkken */}
      {open && value.length < max && (
        <>
          <div className="max-h-80 overflow-y-auto rounded-md border border-[#1e3a5f] bg-[#0a1428] p-2">
            {filtered.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#5b5a56]">
                Sonuç bulunamadı
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                {filtered.map((item) => {
                  const isSelected = selectedIds.has(item.id)
                  return (
                    <button
                      key={`${item.id}-${item.name}`}
                      type="button"
                      onClick={() => !isSelected && addItem(item)}
                      disabled={isSelected}
                      className={`group flex flex-col items-center gap-1 rounded-md p-1 transition ${
                        isSelected
                          ? 'cursor-not-allowed opacity-30'
                          : 'hover:bg-[#111d35]'
                      }`}
                      title={item.name}
                    >
                      <Image
                        src={getItemIconUrl(item.id)}
                        alt={item.name}
                        width={56}
                        height={56}
                        className={`rounded-md border-2 transition ${
                          isSelected
                            ? 'border-[#c8aa6e]'
                            : 'border-transparent group-hover:border-[#c8aa6e]'
                        }`}
                        unoptimized
                      />
                      <span className="w-full truncate text-center text-[10px] text-[#a09b8c] group-hover:text-[#f0e6d2]">
                        {item.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs text-[#5b5a56] transition hover:text-[#a09b8c]"
          >
            ✕ Kapat
          </button>
        </>
      )}

      {/* Yardım metni */}
      <p className="text-xs text-[#5b5a56]">
        {value.length >= max
          ? `Maksimum ${max} item seçildi. Bir item'ı çıkarmak için üzerine gelin ve ✕'e basın.`
          : `Item'ları ikonlara tıklayarak seçin. Sıralamayı ← → butonlarıyla değiştirin.`}
      </p>
    </div>
  )
}