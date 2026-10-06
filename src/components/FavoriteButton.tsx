// src/components/FavoriteButton.tsx
'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Props = {
  buildId: string
  userId: string | null
  initialFavorited: boolean
}

export default function FavoriteButton({
  buildId,
  userId,
  initialFavorited,
}: Props) {
  const supabase = createClient()
  const [favorited, setFavorited] = useState(initialFavorited)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  async function toggleFavorite() {
    if (!userId) {
      setMessage('Favorilere eklemek için giriş yap.')
      setTimeout(() => setMessage(null), 3000)
      return
    }

    setLoading(true)
    setMessage(null)

    if (favorited) {
      // Favoriden çıkar
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('build_id', buildId)

      if (error) {
        setMessage(`Hata: ${error.message}`)
      } else {
        setFavorited(false)
      }
    } else {
      // Favoriye ekle
      const { error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, build_id: buildId })

      if (error) {
        // Aynı build zaten favoride ise (unique constraint) sessizce geç
        if (error.code === '23505') {
          setFavorited(true)
        } else {
          setMessage(`Hata: ${error.message}`)
        }
      } else {
        setFavorited(true)
      }
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        onClick={toggleFavorite}
        disabled={loading}
        className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
          favorited
            ? 'border-yellow-500 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
            : 'border-gray-700 text-gray-300 hover:border-yellow-500 hover:text-yellow-500'
        }`}
        title={favorited ? 'Favorilerden çıkar' : 'Favorilere ekle'}
      >
        <span className="text-lg">{favorited ? '★' : '☆'}</span>
        <span>
          {loading
            ? '...'
            : favorited
            ? 'Favoride'
            : 'Favorilere Ekle'}
        </span>
      </button>

      {message && (
        <p className="text-xs text-red-400">{message}</p>
      )}
    </div>
  )
}