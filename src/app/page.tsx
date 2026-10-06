// src/app/page.tsx
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()

  // Yayınlanmış build'leri çek
  const { data: builds, error } = await supabase
    .from('builds')
    .select('id, title, champion, role, created_at')
    .eq('status', 'published')
    .order('created_at', { ascending: false })
    .limit(12)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {/* Hero bölümü */}
      <section className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-white sm:text-5xl">
          LoL <span className="text-yellow-500">Coachless</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-gray-400">
          League of Legends build&apos;lerini paylaş, keşfet ve favorilerine ekle.
          Meta&apos;yı takip et, kendi tarzını yarat.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/builds/new"
            className="rounded-md bg-yellow-500 px-6 py-3 font-medium text-gray-950 transition hover:bg-yellow-400"
          >
            + Yeni Build Oluştur
          </Link>
          <Link
            href="/builds"
            className="rounded-md border border-gray-700 px-6 py-3 font-medium text-gray-300 transition hover:border-yellow-500 hover:text-white"
          >
            Build&apos;leri Keşfet
          </Link>
        </div>
      </section>

      {/* Son build'ler */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">Son Build&apos;ler</h2>
          <Link
            href="/builds"
            className="text-sm text-yellow-500 hover:underline"
          >
            Tümünü gör →
          </Link>
        </div>

        {error && (
          <div className="rounded-md bg-red-950 p-4 text-sm text-red-400">
            Build&apos;ler yüklenirken hata: {error.message}
          </div>
        )}

        {!error && (!builds || builds.length === 0) && (
          <div className="rounded-lg border border-dashed border-gray-800 bg-gray-900/50 p-12 text-center">
            <p className="text-gray-400">
              Henüz yayınlanmış build yok.
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
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-white group-hover:text-yellow-500">
                      {build.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-400">
                      {build.champion} · {build.role}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-xs text-gray-500">
                  {new Date(build.created_at).toLocaleDateString('tr-TR')}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}