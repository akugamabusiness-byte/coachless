// src/app/dashboard/favorites/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const ROLE_LABELS: Record<string, string> = {
  top: 'Üst Koridor',
  jungle: 'Orman',
  mid: 'Orta Koridor',
  adc: 'Alt Koridor',
  support: 'Destek',
}

export default async function FavoritesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: favorites, error } = await supabase
    .from('favorites')
    .select(
      `
      id,
      created_at,
      builds (
        id,
        title,
        champion,
        role,
        status,
        created_at
      )
    `
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="text-sm text-gray-400 hover:text-yellow-500"
        >
          ← Panel
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-white">⭐ Favorilerim</h1>
        <p className="mt-2 text-gray-400">
          Favorilere eklediğin build&apos;ler burada.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-red-950 p-4 text-sm text-red-400">
          Hata: {error.message}
        </div>
      )}

      {!error && (!favorites || favorites.length === 0) && (
        <div className="rounded-lg border border-dashed border-gray-800 bg-gray-900/50 p-12 text-center">
          <p className="text-4xl">☆</p>
          <p className="mt-4 text-gray-400">Henüz favori build&apos;in yok.</p>
          <Link
            href="/builds"
            className="mt-4 inline-block text-yellow-500 hover:underline"
          >
            Build&apos;leri keşfet →
          </Link>
        </div>
      )}

      {favorites && favorites.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav: any) => {
            const build = fav.builds
            if (!build) return null

            return (
              <Link
                key={fav.id}
                href={`/builds/${build.id}`}
                className="group rounded-lg border border-gray-800 bg-gray-900 p-5 transition hover:border-yellow-500/50"
              >
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-white group-hover:text-yellow-500">
                      {build.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {build.champion} ·{' '}
                      {ROLE_LABELS[build.role] ?? build.role}
                    </p>
                  </div>
                  <span className="ml-2 text-lg text-yellow-500">★</span>
                </div>
                {build.status === 'draft' && (
                  <span className="mt-3 inline-block rounded-full bg-yellow-950 px-2 py-0.5 text-xs text-yellow-400">
                    Draft
                  </span>
                )}
                <p className="mt-4 text-xs text-gray-500">
                  Favoriye eklenme:{' '}
                  {new Date(fav.created_at).toLocaleDateString('tr-TR')}
                </p>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}