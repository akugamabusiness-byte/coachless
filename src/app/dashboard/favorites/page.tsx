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

const ROLE_ICONS: Record<string, string> = {
  top: '⚔️',
  jungle: '🌲',
  mid: '🔮',
  adc: '🏹',
  support: '🛡️',
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
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[#c8aa6e]/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <Link
            href="/dashboard"
            className="text-sm text-[#a09b8c] transition hover:text-[#c8aa6e]"
          >
            ← Panel
          </Link>
          <h1 className="mt-3 text-4xl font-bold text-[#f0e6d2]">
            ⭐ <span className="text-gradient-gold">Favorilerim</span>
          </h1>
          <p className="mt-2 text-[#a09b8c]">
            Favorilere eklediğin build&apos;ler burada.
          </p>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            Hata: {error.message}
          </div>
        )}

        {!error && (!favorites || favorites.length === 0) && (
          <div className="card-lol p-16 text-center">
            <div className="mb-4 text-5xl text-[#c8aa6e]">☆</div>
            <p className="text-lg text-[#a09b8c]">
              Henüz favori build&apos;in yok.
            </p>
            <Link href="/builds" className="mt-6 inline-block btn-primary">
              Build&apos;leri keşfet
            </Link>
          </div>
        )}

        {favorites && favorites.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {favorites.map((fav: any) => {
              const build = fav.builds
              if (!build) return null

              return (
                <Link
                  key={fav.id}
                  href={`/builds/${build.id}`}
                  className="card-lol group relative overflow-hidden p-6"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0a1428] px-3 py-1 text-xs font-medium text-[#c8aa6e]">
                      <span>{ROLE_ICONS[build.role] ?? '⚔️'}</span>
                      {ROLE_LABELS[build.role] ?? build.role}
                    </span>
                    <span className="text-xl text-[#c8aa6e]">★</span>
                  </div>

                  <div>
                    <div className="text-xs uppercase tracking-widest text-[#5b5a56]">
                      {build.champion}
                    </div>
                    <h3 className="mt-1 text-lg font-semibold text-[#f0e6d2] transition group-hover:text-[#c8aa6e]">
                      {build.title}
                    </h3>
                  </div>

                  {build.status === 'draft' && (
                    <span className="mt-3 inline-block rounded-full border border-[#785a28] bg-[#785a28]/20 px-2 py-0.5 text-xs text-[#c8aa6e]">
                      Draft
                    </span>
                  )}

                  <div className="mt-4 flex items-center justify-between border-t border-[#1e3a5f] pt-4">
                    <span className="text-xs text-[#5b5a56]">
                      {new Date(fav.created_at).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="text-xs font-medium text-[#c8aa6e] transition group-hover:translate-x-1">
                      Görüntüle →
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}