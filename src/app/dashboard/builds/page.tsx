// src/app/dashboard/builds/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import BuildActions from './BuildActions'

export const dynamic = 'force-dynamic'

const ROLE_LABELS: Record<string, string> = {
  top: 'Üst Koridor',
  jungle: 'Orman',
  mid: 'Orta Koridor',
  adc: 'Alt Koridor',
  support: 'Destek',
}

export default async function MyBuildsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: builds, error } = await supabase
    .from('builds')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const drafts = builds?.filter((b) => b.status === 'draft') ?? []
  const published = builds?.filter((b) => b.status === 'published') ?? []

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/dashboard"
            className="text-sm text-gray-400 hover:text-yellow-500"
          >
            ← Panel
          </Link>
          <h1 className="mt-3 text-3xl font-bold text-white">
            🔨 Build&apos;lerim
          </h1>
          <p className="mt-2 text-gray-400">
            Kendi build&apos;lerini yönet: yayınla, düzenle veya sil.
          </p>
        </div>
        <Link
          href="/builds/new"
          className="rounded-md bg-yellow-500 px-4 py-2 text-sm font-medium text-gray-950 transition hover:bg-yellow-400"
        >
          + Yeni Build
        </Link>
      </div>

      {error && (
        <div className="rounded-md bg-red-950 p-4 text-sm text-red-400">
          Hata: {error.message}
        </div>
      )}

      {!error && builds && builds.length === 0 && (
        <div className="rounded-lg border border-dashed border-gray-800 bg-gray-900/50 p-12 text-center">
          <p className="text-4xl">🔨</p>
          <p className="mt-4 text-gray-400">Henüz build oluşturmadın.</p>
          <Link
            href="/builds/new"
            className="mt-4 inline-block text-yellow-500 hover:underline"
          >
            İlk build&apos;ini oluştur →
          </Link>
        </div>
      )}

      {builds && builds.length > 0 && (
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <div className="text-2xl font-bold text-white">
              {builds.length}
            </div>
            <div className="mt-1 text-xs text-gray-400">Toplam Build</div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <div className="text-2xl font-bold text-green-400">
              {published.length}
            </div>
            <div className="mt-1 text-xs text-gray-400">Yayında</div>
          </div>
          <div className="rounded-lg border border-gray-800 bg-gray-900 p-4">
            <div className="text-2xl font-bold text-yellow-400">
              {drafts.length}
            </div>
            <div className="mt-1 text-xs text-gray-400">Draft</div>
          </div>
        </div>
      )}

      {drafts.length > 0 && (
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-semibold text-white">
            📝 Draft&apos;lar
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({drafts.length}) — sadece sen görürsün
            </span>
          </h2>
          <div className="space-y-3">
            {drafts.map((build) => (
              <BuildRow key={build.id} build={build} />
            ))}
          </div>
        </section>
      )}

      {published.length > 0 && (
        <section>
          <h2 className="mb-4 text-xl font-semibold text-white">
            🚀 Yayında
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({published.length}) — herkes görebilir
            </span>
          </h2>
          <div className="space-y-3">
            {published.map((build) => (
              <BuildRow key={build.id} build={build} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function BuildRow({ build }: { build: any }) {
  return (
    <div className="rounded-lg border border-gray-800 bg-gray-900 p-4 transition hover:border-gray-700">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Link
            href={`/builds/${build.id}`}
            className="block font-semibold text-white hover:text-yellow-500"
          >
            {build.title}
          </Link>
          <p className="mt-1 text-sm text-gray-400">
            <span className="text-yellow-500">{build.champion}</span> ·{' '}
            {ROLE_LABELS[build.role] ?? build.role}
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Güncellenme:{' '}
            {new Date(build.updated_at).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>

        <BuildActions
          buildId={build.id}
          buildTitle={build.title}
          initialStatus={build.status}
        />
      </div>
    </div>
  )
}