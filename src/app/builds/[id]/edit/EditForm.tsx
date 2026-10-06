// src/app/builds/[id]/edit/EditForm.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const ROLES = [
  { value: 'top', label: 'Üst Koridor (Top)' },
  { value: 'jungle', label: 'Orman (Jungle)' },
  { value: 'mid', label: 'Orta Koridor (Mid)' },
  { value: 'adc', label: 'Alt Koridor (ADC)' },
  { value: 'support', label: 'Destek (Support)' },
]

type Props = {
  build: {
    id: string
    title: string
    champion: string
    role: string
    itemsText: string
    runesText: string
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
  const [itemsText, setItemsText] = useState(build.itemsText)
  const [runesText, setRunesText] = useState(build.runesText)
  const [description, setDescription] = useState(build.description)
  const [status, setStatus] = useState<'draft' | 'published'>(build.status)

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)
    setLoading(true)

    const items = itemsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name, i) => ({ slot: i + 1, name }))

    const runes = { raw: runesText.trim() }

    const { error } = await supabase
      .from('builds')
      .update({
        title: title.trim(),
        champion: champion.trim(),
        role,
        items,
        runes,
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
    <form
      onSubmit={handleSubmit}
      className="space-y-6 rounded-lg border border-gray-800 bg-gray-900 p-6"
    >
      {error && (
        <div className="rounded-md bg-red-950 p-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-950 p-3 text-sm text-green-400">
          ✓ Kaydedildi! Yönlendiriliyorsun...
        </div>
      )}

      {/* Başlık */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Build Başlığı *
        </label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none focus:border-yellow-500"
        />
      </div>

      {/* Şampiyon + Rol */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Şampiyon *
          </label>
          <input
            type="text"
            required
            value={champion}
            onChange={(e) => setChampion(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none focus:border-yellow-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Rol *
          </label>
          <select
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none focus:border-yellow-500"
          >
            {ROLES.map((r) => (
              <option key={r.value} value={r.value}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Item'lar */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Item&apos;lar
        </label>
        <textarea
          value={itemsText}
          onChange={(e) => setItemsText(e.target.value)}
          rows={6}
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 font-mono text-sm text-white outline-none focus:border-yellow-500"
        />
        <p className="mt-1 text-xs text-gray-500">
          Her satıra bir item yaz.
        </p>
      </div>

      {/* Rünler */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Rünler
        </label>
        <textarea
          value={runesText}
          onChange={(e) => setRunesText(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-yellow-500"
        />
      </div>

      {/* Açıklama */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Açıklama
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-yellow-500"
        />
      </div>

      {/* Durum */}
      <div>
        <label className="mb-2 block text-sm font-medium text-gray-300">
          Yayın Durumu
        </label>
        <div className="flex gap-3">
          <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-4 py-3 transition hover:border-yellow-500/50">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={status === 'draft'}
              onChange={() => setStatus('draft')}
              className="accent-yellow-500"
            />
            <div>
              <div className="text-sm font-medium text-white">Draft</div>
              <div className="text-xs text-gray-400">
                Sadece sen görürsün
              </div>
            </div>
          </label>
          <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-gray-700 bg-gray-800 px-4 py-3 transition hover:border-yellow-500/50">
            <input
              type="radio"
              name="status"
              value="published"
              checked={status === 'published'}
              onChange={() => setStatus('published')}
              className="accent-yellow-500"
            />
            <div>
              <div className="text-sm font-medium text-white">Yayınla</div>
              <div className="text-xs text-gray-400">
                Herkes görebilir
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end gap-3 border-t border-gray-800 pt-6">
        <Link
          href={`/builds/${build.id}`}
          className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:border-gray-600"
        >
          İptal
        </Link>
        <button
          type="submit"
          disabled={loading || success}
          className="rounded-md bg-yellow-500 px-6 py-2 text-sm font-medium text-gray-950 transition hover:bg-yellow-400 disabled:opacity-50"
        >
          {loading ? 'Kaydediliyor...' : success ? '✓ Kaydedildi' : 'Kaydet'}
        </button>
      </div>
    </form>
  )
}