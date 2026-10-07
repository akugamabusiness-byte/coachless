// src/app/builds/[id]/edit/EditForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ChampionPicker from '@/components/ChampionPicker'
import ItemPicker from '@/components/ItemPicker'
import RunePicker from '@/components/RunePicker'
import { runeConfigToRaw, type RuneConfig } from '@/lib/lol/data'

const ROLES = [
  { value: 'top', label: '⚔️ Üst Koridor (Top)' },
  { value: 'jungle', label: '🌲 Orman (Jungle)' },
  { value: 'mid', label: '🔮 Orta Koridor (Mid)' },
  { value: 'adc', label: '🏹 Alt Koridor (ADC)' },
  { value: 'support', label: '🛡️ Destek (Support)' },
]

type Props = {
  build: {
    id: string
    title: string
    champion: string
    role: string
    items: { id: number; name: string }[]
    runes: RuneConfig
    description: string
    status: 'draft' | 'published'
  }
}

export default function EditForm({ build }: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState(build.title)
  const [champion, setChampion] = useState(build.champion)
  const [role, setRole] = useState(build.role)
  const [items, setItems] = useState(build.items)
  const [runes, setRunes] = useState<RuneConfig>(build.runes)
  const [description, setDescription] = useState(build.description)
  const [status, setStatus] = useState<'draft' | 'published'>(build.status)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!champion.trim()) {
      setError('Lütfen bir şampiyon seç.')
      return
    }

    setLoading(true)

    const itemsForDb = items.map((item, i) => ({
      slot: i + 1,
      id: item.id,
      name: item.name,
    }))

    const runesData = {
      raw: runeConfigToRaw(runes),
      config: runes,
    }

    const { error } = await supabase
      .from('builds')
      .update({
        title: title.trim(),
        champion: champion.trim(),
        role,
        items: itemsForDb,
        runes: runesData,
        description: description.trim() || null,
        status,
      })
      .eq('id', build.id)

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    setTimeout(() => {
      router.push(`/builds/${build.id}`)
      router.refresh()
    }, 800)
  }

  return (
    <form onSubmit={handleSubmit} className="card-lol space-y-6 p-8">
      {error && (
        <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-400">
          ✓ Kaydedildi! Yönlendiriliyorsun...
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
          Build Başlığı *
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1428] px-3 py-2.5 text-[#f0e6d2] outline-none transition focus:border-[#c8aa6e]"
        />
      </div>

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

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
          Item&apos;lar (maks. 6)
        </label>
        <ItemPicker value={items} onChange={setItems} max={6} />
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
          Rün Sayfası
        </label>
        <RunePicker value={runes} onChange={setRunes} />
      </div>

      <div>
        <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
          Açıklama
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1428] px-3 py-2.5 text-sm text-[#f0e6d2] outline-none transition focus:border-[#c8aa6e]"
        />
      </div>

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

      <div className="flex justify-end gap-3 border-t border-[#1e3a5f] pt-6">
        <Link href={`/builds/${build.id}`} className="btn-secondary">
          İptal
        </Link>
        <button
          type="submit"
          disabled={loading || success}
          className="btn-primary disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : success ? '✓ Kaydedildi' : 'Kaydet'}
        </button>
      </div>
    </form>
  )
}