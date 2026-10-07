// src/app/builds/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { findChampionId, getChampionIconUrl } from '@/lib/lol/data'
import ItemPicker from '@/components/ItemPicker'

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

const ROLE_OPTIONS = [
  { value: '', label: 'Tüm Roller' },
  { value: 'top', label: '⚔️ Üst Koridor' },
  { value: 'jungle', label: '🌲 Orman' },
  { value: 'mid', label: '🔮 Orta Koridor' },
  { value: 'adc', label: '🏹 Alt Koridor' },
  { value: 'support', label: '🛡️ Destek' },
]

type SearchParams = Promise<{
  role?: string
  q?: string
}>

export default async function BuildsPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const { role, q } = await searchParams
  const supabase = await createClient()

  let query = supabase
    .from('builds')
    .select('id, title, champion, role, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })

  if (role && role !== '') {
    query = query.eq('role', role)
  }

  if (q && q.trim() !== '') {
    const search = `%${q.trim()}%`
    query = query.or(`champion.ilike.${search},title.ilike.${search}`)
  }

  const { data: builds, error } = await query

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[#c8aa6e]/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#785a28] bg-[#111d35] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c8aa6e]" />
            <span className="text-xs font-medium uppercase tracking-widest text-[#c8aa6e]">
              Keşfet
            </span>
          </div>
          <h1 className="text-4xl font-bold text-[#f0e6d2] sm:text-5xl">
            Tüm <span className="text-gradient-gold">Build&apos;ler</span>
          </h1>
          <p className="mt-3 max-w-2xl text-[#a09b8c]">
            Topluluğun paylaştığı tüm build&apos;leri keşfet, ara ve filtrele.
          </p>
        </div>

        <form
          method="GET"
          className="card-lol mb-8 flex flex-wrap items-end gap-3 p-5"
        >
          <div className="min-w-0 flex-1">
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
              Arama
            </label>
            <input
              type="text"
              name="q"
              defaultValue={q ?? ''}
              placeholder="Şampiyon veya başlık ara..."
              className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1428] px-3 py-2.5 text-[#f0e6d2] placeholder-[#5b5a56] outline-none transition focus:border-[#c8aa6e]"
            />
          </div>

          <div className="min-w-[180px]">
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
              Rol
            </label>
            <select
              name="role"
              defaultValue={role ?? ''}
              className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1428] px-3 py-2.5 text-[#f0e6d2] outline-none transition focus:border-[#c8aa6e]"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary">
            Ara
          </button>

          {(role || q) && (
            <Link href="/builds" className="btn-secondary">
              Temizle
            </Link>
          )}
        </form>

        {(role || q) && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-[#a09b8c]">
            <span className="text-xs uppercase tracking-widest text-[#5b5a56]">
              Filtre:
            </span>
            {q && (
              <span className="rounded-full border border-[#785a28] bg-[#111d35] px-3 py-1 text-xs">
                Arama: <strong className="text-[#c8aa6e]">{q}</strong>
              </span>
            )}
            {role && (
              <span className="rounded-full border border-[#785a28] bg-[#111d35] px-3 py-1 text-xs">
                Rol:{' '}
                <strong className="text-[#c8aa6e]">
                  {ROLE_LABELS[role] ?? role}
                </strong>
              </span>
            )}
            <span className="text-xs text-[#5b5a56]">
              {builds?.length ?? 0} sonuç
            </span>
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            Hata: {error.message}
          </div>
        )}

        {!error && (!builds || builds.length === 0) && (
          <div className="card-lol p-16 text-center">
            <div className="mb-4 text-5xl">🔍</div>
            <p className="text-lg text-[#a09b8c]">
              {q || role
                ? 'Bu kriterlere uyan build bulunamadı.'
                : 'Henüz yayınlanmış build yok.'}
            </p>
            <Link href="/builds/new" className="mt-6 inline-block btn-primary">
              İlk build&apos;i sen oluştur
            </Link>
          </div>
        )}

        {builds && builds.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {builds.map((build) => {
              const championId = findChampionId(build.champion)
              const icon = championId ? getChampionIconUrl(championId) : null

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
                    <div className="min-w-0 flex-1">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0a1428] px-2.5 py-0.5 text-[10px] font-medium text-[#c8aa6e]">
                        <span>{ROLE_ICONS[build.role] ?? '⚔️'}</span>
                        {ROLE_LABELS[build.role] ?? build.role}
                      </span>
                    </div>
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
                      {new Date(build.created_at).toLocaleDateString('tr-TR', {
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