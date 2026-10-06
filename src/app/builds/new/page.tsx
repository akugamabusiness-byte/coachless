// src/app/builds/new/page.tsx
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

// Örnek şampiyon listesi (sonra Riot API'den çekeceğiz)
const CHAMPIONS = [
  'Ahri', 'Akali', 'Alistar', 'Amumu', 'Annie', 'Ashe', 'Azir',
  'Blitzcrank', 'Brand', 'Braum', 'Caitlyn', 'Camille', 'Cassiopeia',
  'Darius', 'Diana', 'Dr. Mundo', 'Draven', 'Ekko', 'Elise', 'Evelynn',
  'Ezreal', 'Fiora', 'Fizz', 'Galio', 'Garen', 'Gnar', 'Gragas',
  'Graves', 'Hecarim', 'Heimerdinger', 'Illaoi', 'Irelia', 'Janna',
  'Jarvan IV', 'Jax', 'Jayce', 'Jhin', 'Jinx', 'Kai\'Sa', 'Karma',
  'Karthus', 'Kassadin', 'Katarina', 'Kayle', 'Kennen', 'Kha\'Zix',
  'Kindred', 'Kled', 'Kog\'Maw', 'LeBlanc', 'Lee Sin', 'Leona',
  'Lissandra', 'Lucian', 'Lulu', 'Lux', 'Malphite', 'Malzahar',
  'Maokai', 'Master Yi', 'Miss Fortune', 'Mordekaiser', 'Morgana',
  'Nami', 'Nasus', 'Nautilus', 'Nidalee', 'Nocturne', 'Olaf', 'Orianna',
  'Pantheon', 'Poppy', 'Pyke', 'Qiyana', 'Rakan', 'Rammus', 'Renekton',
  'Rengar', 'Riven', 'Rumble', 'Ryze', 'Sejuani', 'Sett', 'Shaco',
  'Shen', 'Shyvana', 'Singed', 'Sion', 'Sivir', 'Skarner', 'Sona',
  'Soraka', 'Swain', 'Sylas', 'Syndra', 'Talon', 'Taric', 'Teemo',
  'Thresh', 'Tristana', 'Trundle', 'Tryndamere', 'Twisted Fate',
  'Twitch', 'Udyr', 'Urgot', 'Varus', 'Vayne', 'Veigar', 'Vel\'Koz',
  'Vi', 'Viktor', 'Vladimir', 'Volibear', 'Warwick', 'Wukong',
  'Xayah', 'Xerath', 'Xin Zhao', 'Yasuo', 'Yorick', 'Yuumi', 'Zac',
  'Zed', 'Ziggs', 'Zilean', 'Zoe', 'Zyra',
].sort()

export default function NewBuildPage() {
  const router = useRouter()
  const supabase = createClient()

  const [title, setTitle] = useState('')
  const [champion, setChampion] = useState('')
  const [role, setRole] = useState('mid')
  const [itemsText, setItemsText] = useState('')
  const [runesText, setRunesText] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<'draft' | 'published'>('draft')

  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Oturum kontrolü
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Build oluşturmak için giriş yapmalısın.')
      setLoading(false)
      return
    }

    // Item'ları ve rünleri dizi/obje haline getir
    const items = itemsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name, i) => ({ slot: i + 1, name }))

    const runes = {
      raw: runesText.trim(),
    }

    const { data, error: insertError } = await supabase
      .from('builds')
      .insert({
        user_id: user.id,
        title: title.trim(),
        champion: champion.trim(),
        role,
        items,
        runes,
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

    // Başarılı → build detayına veya panele git
    router.push(`/builds/${data.id}`)
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <Link
          href="/"
          className="text-sm text-gray-400 hover:text-yellow-500"
        >
          ← Ana sayfa
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-white">
          Yeni Build Oluştur
        </h1>
        <p className="mt-2 text-gray-400">
          Build&apos;ini paylaş ya da kendine sakla (draft).
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-lg border border-gray-800 bg-gray-900 p-6"
      >
        {error && (
          <div className="rounded-md bg-red-950 p-3 text-sm text-red-400">
            {error}
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
            placeholder="Örn: Ahri Mid Full AP Burst"
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none focus:border-yellow-500"
          />
        </div>

        {/* Şampiyon + Rol (yan yana) */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Şampiyon *
            </label>
            <select
              required
              value={champion}
              onChange={(e) => setChampion(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none focus:border-yellow-500"
            >
              <option value="">Seç...</option>
              {CHAMPIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
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
            rows={5}
            placeholder={'Her satıra bir item:\nLuden\'s Companion\nSorcerer\'s Shoes\nRabadon\'s Deathcap\nVoid Staff\nZhonya\'s Hourglass\nShadowflame'}
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 font-mono text-sm text-white outline-none focus:border-yellow-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Her satıra bir item yaz. Sıra numarası otomatik atanır.
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
            placeholder={'Örn:\nAna Ağaç: Sihir (Sorcery)\nAnahtar: Summon Aery\nYan Ağaç: İlham (Inspiration)'}
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-sm text-white outline-none focus:border-yellow-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Serbest metin — istediğin gibi yazabilirsin.
          </p>
        </div>

        {/* Açıklama */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Açıklama / Notlar
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Oynanış tarzı, kombolar, güçlü/zayıf dönemler..."
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
            href="/"
            className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:border-gray-600"
          >
            İptal
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="rounded-md bg-yellow-500 px-6 py-2 text-sm font-medium text-gray-950 transition hover:bg-yellow-400 disabled:opacity-50"
          >
            {loading
              ? 'Kaydediliyor...'
              : status === 'published'
              ? 'Yayınla'
              : 'Draft Olarak Kaydet'}
          </button>
        </div>
      </form>
    </div>
  )
}