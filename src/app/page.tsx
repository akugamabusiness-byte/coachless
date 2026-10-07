// src/app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { findChampionId, getChampionIconUrl } from '@/lib/lol/data'

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

export default async function HomePage() {
  const supabase = await createClient()

  const { data: builds, error } = await supabase
    .from('builds')
    .select('id, title, champion, role, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#c8aa6e]/10 blur-[120px]" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-[#7b3fe4]/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        {/* HERO */}
        <section className="py-20 text-center sm:py-28">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#785a28] bg-[#111d35] px-4 py-1.5">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#c8aa6e]" />
            <span className="text-xs font-medium uppercase tracking-widest text-[#c8aa6e]">
              Topluluk Tarafından Oluşturuldu
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-gradient-gold">LoL</span>{' '}
            <span className="text-[#f0e6d2]">Coachless</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-[#a09b8c] sm:text-xl">
            League of Legends build&apos;lerini paylaş, keşfet ve favorilerine
            ekle. Meta&apos;yı takip et, kendi tarzını yarat.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link href="/builds/new" className="btn-primary">
              + Yeni Build Oluştur
            </Link>
            <Link href="/builds" className="btn-secondary">
              Build&apos;leri Keşfet →
            </Link>
          </div>

          <p className="mt-6 text-xs uppercase tracking-widest text-[#5b5a56]">
            Ücretsiz · Hesap oluştur · Saniyeler içinde başla
          </p>
        </section>

        <div className="divider-lol" />

        {/* SON BUILD'LER */}
        <section className="py-12">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-[#f0e6d2] sm:text-3xl">
                Son Build&apos;ler
              </h2>
              <p className="mt-1 text-sm text-[#a09b8c]">
                Topluluğun son paylaştığı build&apos;ler
              </p>
            </div>
            <Link
              href="/builds"
              className="text-sm font-medium text-[#c8aa6e] transition hover:text-[#f0e6d2]"
            >
              Tümünü gör →
            </Link>
          </div>

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
              Build&apos;ler yüklenirken hata: {error.message}
            </div>
          )}

          {!error && (!builds || builds.length === 0) && (
            <div className="card-lol p-16 text-center">
              <div className="mb-4 text-5xl">⚔️</div>
              <p className="text-lg text-[#a09b8c]">
                Henüz yayınlanmış build yok.
              </p>
              <Link
                href="/builds/new"
                className="mt-6 inline-block btn-primary"
              >
                İlk build&apos;i sen oluştur
              </Link>
            </div>
          )}

          {builds && builds.length > 0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {builds.map((build) => {
                const championId = findChampionId(build.champion)
                const icon = championId
                  ? getChampionIconUrl(championId)
                  : null

                return (
                  <Link
                    key={build.id}
                    href={`/builds/${build.id}`}
                    className="card-lol group relative overflow-hidden p-6"
                  >
                    <div className="mb-4 flex items-center gap-3">
                      {icon && (
                        <Image
                          src={icon}
                          alt={build.champion}
                          width={48}
                          height={48}
                          className="rounded-md border-2 border-[#785a28] transition group-hover:border-[#c8aa6e]"
                          unoptimized
                        />
                      )}
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0a1428] px-2.5 py-0.5 text-[10px] font-medium text-[#c8aa6e]">
                        <span>{ROLE_ICONS[build.role] ?? '⚔️'}</span>
                        {ROLE_LABELS[build.role] ?? build.role}
                      </span>
                    </div>

                    <div>
                      <div className="text-xs uppercase tracking-widest text-[#5b5a56]">
                        {build.champion}
                      </div>
                      <h3 className="mt-1 truncate text-lg font-semibold text-[#f0e6d2] transition group-hover:text-[#c8aa6e]">
                        {build.title}
                      </h3>
                    </div>

                    <div className="mt-6 flex items-center justify-between border-t border-[#1e3a5f] pt-4">
                      <span className="text-xs text-[#5b5a56]">
                        {new Date(build.created_at).toLocaleDateString(
                          'tr-TR',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
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
        </section>
      </div>
    </div>
  )
}