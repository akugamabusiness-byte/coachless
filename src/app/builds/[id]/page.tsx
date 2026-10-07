// src/app/builds/[id]/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import FavoriteButton from '@/components/FavoriteButton'
import RuneDisplay from '@/components/RuneDisplay'
import {
  findChampionId,
  getChampionIconUrl,
  getChampionSplashUrl,
  findItem,
  getItemIconUrl,
} from '@/lib/lol/data'

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

export default async function BuildDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: build, error } = await supabase
    .from('builds')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !build) {
    notFound()
  }

  if (build.status === 'draft' && build.user_id !== user?.id) {
    notFound()
  }

  const isOwner = user?.id === build.user_id

  let isFavorited = false
  if (user) {
    const { data: fav } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('build_id', build.id)
      .maybeSingle()
    isFavorited = !!fav
  }

  const { count: favoriteCount } = await supabase
    .from('favorites')
    .select('id', { count: 'exact', head: true })
    .eq('build_id', build.id)

  const items = Array.isArray(build.items) ? build.items : []
  const runesRaw = build.runes?.raw ?? ''

  const championId = findChampionId(build.champion)
  const championIcon = championId ? getChampionIconUrl(championId) : null
  const championSplash = championId ? getChampionSplashUrl(championId) : null

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#c8aa6e]/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 py-12">
        <Link
          href="/builds"
          className="inline-flex items-center gap-2 text-sm text-[#a09b8c] transition hover:text-[#c8aa6e]"
        >
          ← Build&apos;ler
        </Link>

        {/* SPLASH BANNER */}
        {championSplash && (
          <div className="relative mt-6 overflow-hidden rounded-lg border border-[#1e3a5f]">
            <div className="relative h-40 sm:h-56">
              <Image
                src={championSplash}
                alt={build.champion}
                fill
                className="object-cover object-top opacity-40"
                unoptimized
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#010a13] via-[#010a13]/60 to-transparent" />
            </div>

            <div className="absolute inset-0 flex items-end">
              <div className="flex w-full items-end gap-4 p-5">
                {championIcon && (
                  <Image
                    src={championIcon}
                    alt={build.champion}
                    width={80}
                    height={80}
                    className="rounded-lg border-2 border-[#c8aa6e] shadow-[0_0_30px_rgba(200,170,110,0.5)]"
                    unoptimized
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium uppercase tracking-widest text-[#c8aa6e]">
                    {build.champion}
                  </div>
                  <h1 className="mt-1 truncate text-2xl font-bold text-[#f0e6d2] sm:text-3xl">
                    {build.title}
                  </h1>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#785a28] bg-[#111d35] px-3 py-1 text-xs font-medium text-[#c8aa6e]">
                      <span>{ROLE_ICONS[build.role] ?? '⚔️'}</span>
                      {ROLE_LABELS[build.role] ?? build.role}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                        build.status === 'published'
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border border-[#785a28] bg-[#785a28]/20 text-[#c8aa6e]'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {build.status === 'published' ? 'Yayında' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fallback başlık (splash yoksa) */}
        {!championSplash && (
          <header className="mt-6 mb-8">
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#785a28] bg-[#111d35] px-3 py-1 text-xs font-medium text-[#c8aa6e]">
                <span>{ROLE_ICONS[build.role] ?? '⚔️'}</span>
                {ROLE_LABELS[build.role] ?? build.role}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-medium text-[#c8aa6e]">
                {build.champion}
              </span>
            </div>
            <h1 className="mt-2 text-4xl font-bold text-[#f0e6d2]">
              {build.title}
            </h1>
          </header>
        )}

        {/* Aksiyon satırı */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-y border-[#1e3a5f] py-4">
          <div className="flex flex-wrap items-center gap-4 text-xs text-[#5b5a56]">
            <span>
              📅{' '}
              {new Date(build.created_at).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
            <span className="text-[#c8aa6e]">
              ⭐ {favoriteCount ?? 0} favori
            </span>
          </div>

          <div className="flex items-center gap-3">
            {!isOwner && (
              <FavoriteButton
                buildId={build.id}
                userId={user?.id ?? null}
                initialFavorited={isFavorited}
              />
            )}
            {isOwner && (
              <Link
                href={`/builds/${build.id}/edit`}
                className="btn-secondary text-sm"
              >
                ✏️ Düzenle
              </Link>
            )}
          </div>
        </div>

        {/* İçerik */}
        <div className="mt-8 space-y-6">
          {/* ITEM GRID */}
          {items.length > 0 && (
            <section className="card-lol p-6">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-[#f0e6d2]">
                <span>🛒</span> Item Sırası
              </h2>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-6">
                {items.map((item: any, i: number) => {
                  const itemName = item.name ?? ''
                  const matchedItem = findItem(itemName)

                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2"
                    >
                      <div className="relative">
                        <div className="absolute -left-1 -top-1 z-10 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#c8aa6e] to-[#785a28] text-[10px] font-bold text-[#010a13]">
                          {i + 1}
                        </div>

                        {matchedItem ? (
                          <Image
                            src={getItemIconUrl(matchedItem.id)}
                            alt={matchedItem.name}
                            width={64}
                            height={64}
                            className="rounded-md border-2 border-[#785a28] transition hover:border-[#c8aa6e]"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-16 w-16 items-center justify-center rounded-md border-2 border-[#1e3a5f] bg-[#0a1428] text-2xl">
                            ❓
                          </div>
                        )}
                      </div>

                      <div className="w-full text-center text-[10px] text-[#a09b8c]">
                        {matchedItem?.name ?? itemName}
                      </div>
                    </div>
                  )
                })}
              </div>

              {items.some((it: any) => !findItem(it.name ?? '')) && (
                <p className="mt-4 text-xs text-[#5b5a56]">
                  ❓ simgeli item&apos;lar Riot veritabanında bulunamadı.
                </p>
              )}
            </section>
          )}

          {/* RÜNLER */}
          {runesRaw && (
            <section className="card-lol p-6">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-[#f0e6d2]">
                <span>⚡</span> Rün Sayfası
              </h2>
              <RuneDisplay runesRaw={runesRaw} />
            </section>
          )}

          {/* AÇIKLAMA */}
          {build.description && (
            <section className="card-lol p-6">
              <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-[#f0e6d2]">
                <span>📝</span> Açıklama
              </h2>
              <p className="whitespace-pre-wrap leading-relaxed text-[#a09b8c]">
                {build.description}
              </p>
            </section>
          )}

          {/* BOŞ DURUM */}
          {items.length === 0 && !runesRaw && !build.description && (
            <div className="card-lol p-12 text-center text-[#5b5a56]">
              Bu build&apos;de henüz detay yok.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}