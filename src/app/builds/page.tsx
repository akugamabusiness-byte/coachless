// src/app/builds/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const ROLE_LABELS: Record<string, string> = {
  top: 'Üst Koridor',
  jungle: 'Orman',
  mid: 'Orta Koridor',
  adc: 'Alt Koridor',
  support: 'Destek',
}

const ROLE_OPTIONS = [
  { value: '', label: 'Tüm Roller' },
  { value: 'top', label: 'Üst Koridor' },
  { value: 'jungle', label: 'Orman' },
  { value: 'mid', label: 'Orta Koridor' },
  { value: 'adc', label: 'Alt Koridor' },
  { value: 'support', label: 'Destek' },
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
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Build&apos;ler</h1>
        <p className="mt-2 text-gray-400">
          Topluluğun paylaştığı tüm build&apos;leri keşfet.
        </p>
      </div>

      <form
        method="GET"
        className="mb-8 flex flex-wrap gap-3 rounded-lg border border-gray-800 bg-gray-900 p-4"
      >
        <div className="min-w-0 flex-1">
          <input
            type="text"
            name="q"
            defaultValue={q ?? ''}
            placeholder="Şampiyon veya başlık ara... (örn. Ahri)"
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none focus:border-yellow-500"
          />
        </div>

        <div>
          <select
            name="role"
            defaultValue={role ?? ''}
            className="rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none focus:border-yellow-500"
          >
            {ROLE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="rounded-md bg-yellow-500 px-6 py-2 text-sm font-medium text-gray-950 transition hover:bg-yellow-400"
        >
          Ara
        </button>

        {(role || q) && (
          <Link
            href="/builds"
            className="rounded-md border border-gray-700 px-4 py-2 text-sm text-gray-300 transition hover:border-gray-600"
          >
            Temizle
          </Link>
        )}
      </form>

      {(role || q) && (
        <div className="mb-6 flex flex-wrap items-center gap-2 text-sm text-gray-400">
          <span>Filtre:</span>
          {q && (
            <span className="rounded-full bg-gray-800 px-3 py-1">
              Arama: <strong className="text-white">{q}</strong>
            </span>
          )}
          {role && (
            <span className="rounded-full bg-gray-800 px-3 py-1">
              Rol:{' '}
              <strong className="text-white">
                {ROLE_LABELS[role] ?? role}
              </strong>
            </span>
          )}
          <span className="text-xs">({builds?.length ?? 0} sonuç)</span>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-950 p-4 text-sm text-red-400">
          Hata: {error.message}
        </div>
      )}

      {!error && (!builds || builds.length === 0) && (
        <div className="rounded-lg border border-dashed border-gray-800 bg-gray-900/50 p-12 text-center">
          <p className="text-4xl">🔍</p>
          <p className="mt-4 text-gray-400">
            {q || role
              ? 'Bu kriterlere uyan build bulunamadı.'
              : 'Henüz yayınlanmış build yok.'}
          </p>
          <Link
            href="/builds/new"
            className="mt-4 inline-block text-yellow-500 hover:underline"
          >
            İlk build&apos;i sen oluştur →
          </Link>
        </div>
      )}

      {builds && builds.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {builds.map((build) => (
            <Link
              key={build.id}
              href={`/builds/${build.id}`}
              className="group rounded-lg border border-gray-800 bg-gray-900 p-5 transition hover:border-yellow-500/50"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-white group-hover:text-yellow-500">
                    {build.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    <span className="text-yellow-500">{build.champion}</span> ·{' '}
                    {ROLE_LABELS[build.role] ?? build.role}
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs text-gray-500">
                {new Date(build.created_at).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}