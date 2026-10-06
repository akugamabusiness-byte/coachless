// src/app/builds/[id]/page.tsx
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import FavoriteButton from '@/components/FavoriteButton'

export const dynamic = 'force-dynamic'

const ROLE_LABELS: Record<string, string> = {
  top: 'Üst Koridor',
  jungle: 'Orman',
  mid: 'Orta Koridor',
  adc: 'Alt Koridor',
  support: 'Destek',
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

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="mb-8">
        <Link
          href="/builds"
          className="text-sm text-gray-400 hover:text-yellow-500"
        >
          ← Build&apos;ler
        </Link>
      </div>

      <header className="mb-8 border-b border-gray-800 pb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-white">{build.title}</h1>
              <span
                className={`rounded-full px-2 py-1 text-xs font-medium ${
                  build.status === 'published'
                    ? 'bg-green-950 text-green-400'
                    : 'bg-yellow-950 text-yellow-400'
                }`}
              >
                {build.status === 'published' ? 'Yayında' : 'Draft'}
              </span>
            </div>
            <p className="mt-2 text-lg text-gray-400">
              <span className="font-medium text-yellow-500">
                {build.champion}
              </span>{' '}
              · <span>{ROLE_LABELS[build.role] ?? build.role}</span>
            </p>
          </div>

          {!isOwner && (
            <FavoriteButton
              buildId={build.id}
              userId={user?.id ?? null}
              initialFavorited={isFavorited}
            />
          )}

          {isOwner && (
            <div className="flex gap-2">
              <Link
                href={`/builds/${build.id}/edit`}
                className="rounded-md border border-gray-700 px-3 py-1.5 text-sm text-gray-300 transition hover:border-yellow-500 hover:text-yellow-500"
              >
                Düzenle
              </Link>
            </div>
          )}
        </div>

        <p className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <span>
            Oluşturma:{' '}
            {new Date(build.created_at).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </span>
          <span className="text-yellow-500">
            ⭐ {favoriteCount ?? 0} favori
          </span>
        </p>
      </header>

      <div className="space-y-8">
        {items.length > 0 && (
          <section className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              🛒 Item Sırası
            </h2>
            <ol className="space-y-2">
              {items.map((item: any, i: number) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-medium text-yellow-500">
                    {i + 1}
                  </span>
                  <span>{item.name ?? JSON.stringify(item)}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {runesRaw && (
          <section className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              ⚡ Rün Sayfası
            </h2>
            <pre className="whitespace-pre-wrap font-sans text-sm text-gray-300">
              {runesRaw}
            </pre>
          </section>
        )}

        {build.description && (
          <section className="rounded-lg border border-gray-800 bg-gray-900 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">
              📝 Açıklama
            </h2>
            <p className="whitespace-pre-wrap text-gray-300">
              {build.description}
            </p>
          </section>
        )}

        {items.length === 0 && !runesRaw && !build.description && (
          <div className="rounded-lg border border-dashed border-gray-800 bg-gray-900/50 p-8 text-center text-gray-500">
            Bu build&apos;de henüz detay yok.
          </div>
        )}
      </div>
    </div>
  )
}