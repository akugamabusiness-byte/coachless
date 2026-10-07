// src/app/builds/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ChampionPicker from '@/components/ChampionPicker'
import ItemPicker from '@/components/ItemPicker'
import RunePicker from '@/components/RunePicker'
import {
  runeConfigToRaw,
  EMPTY_RUNE_CONFIG,
  type RuneConfig,
} from '@/lib/lol/data'

const ROLES = [
  { value: 'top', label: '⚔️ Üst Koridor (Top)' },
  { value: 'jungle', label: '🌲 Orman (Jungle)' },
  { value: 'mid', label: '🔮 Orta Koridor (Mid)' },
  { value: 'adc', label: '🏹 Alt Koridor (ADC)' },
  { value: 'support', label: '🛡️ Destek (Support)' },
]

export default function NewBuildPage() {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [champion, setChampion] = useState('')
  const [role, setRole] = useState('mid')
  const [items, setItems] = useState<{ id: number; name: string }[]>([])
  const [runes, setRunes] = useState<RuneConfig>(EMPTY_RUNE_CONFIG)
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!champion.trim()) {
      setError('Lütfen bir şampiyon seç.')
      return
    }

    setLoading(true)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Build oluşturmak için giriş yapmalısın.')
      setLoading(false)
      return
    }

    const itemsForDb = items.map((item, i) => ({
      slot: i + 1,
      id: item.id,
      name: item.name,
    }))

    const runesData = {
      raw: runeConfigToRaw(runes),
      config: runes,
    }

    const { data, error: insertError } = await supabase
      .from('builds')
      .insert({
        user_id: user.id,
        title: title.trim(),
        champion: champion.trim(),
        role,
        items: itemsForDb,
        runes: runesData,
        description: description.trim() || null,
        status,
      })
      .select('id')
      .single()

    if (insertError) {
      setError(insertError.message)
      setLoading(false)
      return
    }

    router.push(`/builds/${data.id}`)
    router.refresh()
  }

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#c8aa6e]/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-12">
        {/* Başlık */}
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm text-[#a09b8c] transition hover:text-[#c8aa6e]"
          >
            ← Ana sayfa
          </Link>
          <h1 className="mt-3 text-4xl font-bold text-[#f0e6d2]">
            Yeni <span className="text-gradient-gold">Build</span> Oluştur
          </h1>
          <p className="mt-2 text-[#a09b8c]">
            Build&apos;ini paylaş ya da kendine sakla (draft).
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card-lol space-y-6 p-8">
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Başlık */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
              Build Başlığı *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Ahri Mid Full AP Burst"
              className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1428] px-3 py-2.5 text-[#f0e6d2] placeholder-[#5b5a56] outline-none transition focus:border-[#c8aa6e]"
            />
          </div>

          {/* Şampiyon */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
              Şampiyon *
            </label>
            <ChampionPicker
              value={champion}
              onChange={setChampion}
              required
            />
          </div>

          {/* Rol */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
              Rol *
            </label>
            <select
              required
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1428] px-3 py-2.5 text-[#f0e6d2] outline-none transition focus:border-[#c8aa6e]"
            >
              {ROLES.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
                </option>
              ))}
            </select>
          </div>

          {/* Item'lar */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
              Item&apos;lar (maks. 6)
            </label>
            <ItemPicker value={items} onChange={setItems} max={6} />
          </div>

          {/* Rünler */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
              Rün Sayfası
            </label>
            <RunePicker value={runes} onChange={setRunes} />
          </div>

          {/* Açıklama */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
              Açıklama / Notlar
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              placeholder="Oynanış tarzı, kombolar, güçlü/zayıf dönemler..."
              className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1428] px-3 py-2.5 text-sm text-[#f0e6d2] placeholder-[#5b5a56] outline-none transition focus:border-[#c8aa6e]"
            />
          </div>

          {/* Durum */}
          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
              Yayın Durumu
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <label
                className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 transition ${
                  status === 'draft'
                    ? 'border-[#c8aa6e] bg-[#785a28]/10'
                    : 'border-[#1e3a5f] bg-[#0a1428] hover:border-[#785a28]'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="mt-1 accent-[#c8aa6e]"
                />
                <div>
                  <div className="text-sm font-medium text-[#f0e6d2]">
                    📝 Draft
                  </div>
                  <div className="mt-0.5 text-xs text-[#a09b8c]">
                    Sadece sen görürsün
                  </div>
                </div>
              </label>

              <label
                className={`flex cursor-pointer items-start gap-3 rounded-md border p-4 transition ${
                  status === 'published'
                    ? 'border-[#c8aa6e] bg-[#785a28]/10'
                    : 'border-[#1e3a5f] bg-[#0a1428] hover:border-[#785a28]'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="mt-1 accent-[#c8aa6e]"
                />
                <div>
                  <div className="text-sm font-medium text-[#f0e6d2]">
                    🚀 Yayınla
                  </div>
                  <div className="mt-0.5 text-xs text-[#a09b8c]">
                    Herkes görebilir
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-end gap-3 border-t border-[#1e3a5f] pt-6">
            <Link href="/" className="btn-secondary">
              İptal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary disabled:opacity-50"
            >
              {loading
                ? 'Kaydediliyor...'
                : status === 'published'
                ? '🚀 Yayınla'
                : '📝 Draft Olarak Kaydet'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}