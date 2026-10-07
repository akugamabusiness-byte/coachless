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

const ROLE_ICONS: Record<string, string> = {
  top: '⚔️',
  jungle: '🌲',
  mid: '🔮',
  adc: '🏹',
  support: '🛡️',
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
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[#c8aa6e]/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        {/* Başlık */}
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <Link
              href="/dashboard"
              className="text-sm text-[#a09b8c] transition hover:text-[#c8aa6e]"
            >
              ← Panel
            </Link>
            <h1 className="mt-3 text-4xl font-bold text-[#f0e6d2]">
              🔨 <span className="text-gradient-gold">Build&apos;lerim</span>
            </h1>
            <p className="mt-2 text-[#a09b8c]">
              Kendi build&apos;lerini yönet: yayınla, düzenle veya sil.
            </p>
          </div>
          <Link href="/builds/new" className="btn-primary">
            + Yeni Build
          </Link>
        </div>

        {error && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            Hata: {error.message}
          </div>
        )}

        {/* İstatistikler */}
        {builds && builds.length > 0 && (
          <div className="mb-10 grid gap-5 sm:grid-cols-3">
            <div className="card-lol p-5">
              <div className="text-xs uppercase tracking-widest text-[#5b5a56]">
                Toplam
              </div>
              <div className="mt-2 text-3xl font-bold text-[#f0e6d2]">
                {builds.length}
              </div>
            </div>
            <div className="card-lol p-5">
              <div className="text-xs uppercase tracking-widest text-[#5b5a56]">
                Yayında
              </div>
              <div className="mt-2 text-3xl font-bold text-emerald-400">
                {published.length}
              </div>
            </div>
            <div className="card-lol p-5">
              <div className="text-xs uppercase tracking-widest text-[#5b5a56]">
                Draft
              </div>
              <div className="mt-2 text-3xl font-bold text-[#c8aa6e]">
                {drafts.length}
              </div>
            </div>
          </div>
        )}

        {/* Boş durum */}
        {!error && builds && builds.length === 0 && (
          <div className="card-lol p-16 text-center">
            <div className="mb-4 text-5xl">🔨</div>
            <p className="text-lg text-[#a09b8c]">Henüz build oluşturmadın.</p>
            <Link href="/builds/new" className="mt-6 inline-block btn-primary">
              İlk build&apos;ini oluştur
            </Link>
          </div>
        )}

        {/* Draft'lar */}
        {drafts.length > 0 && (
          <section className="mb-12">
            <div className="mb-5 flex items-center gap-3">
              <h2 className="text-xl font-semibold text-[#f0e6d2]">
                📝 Draft&apos;lar
              </h2>
              <span className="rounded-full border border-[#785a28] bg-[#785a28]/20 px-2 py-0.5 text-xs text-[#c8aa6e]">
                {drafts.length}
              </span>
              <span className="text-xs text-[#5b5a56]">— sadece sen görürsün</span>
            </div>
            <div className="space-y-3">
              {drafts.map((build) => (
                <BuildRow key={build.id} build={build} />
              ))}
            </div>
          </section>
        )}

        {/* Yayında */}
        {published.length > 0 && (
          <section>
            <div className="mb-5 flex items-center gap-3">
              <h2 className="text-xl font-semibold text-[#f0e6d2]">
                🚀 Yayında
              </h2>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-400">
                {published.length}
              </span>
              <span className="text-xs text-[#5b5a56]">— herkes görebilir</span>
            </div>
            <div className="space-y-3">
              {published.map((build) => (
                <BuildRow key={build.id} build={build} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}

function BuildRow({ build }: { build: any }) {
  return (
    <div className="card-lol p-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <Link
            href={`/builds/${build.id}`}
            className="group flex items-center gap-3"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0a1428] px-2.5 py-1 text-xs font-medium text-[#c8aa6e]">
              <span>{ROLE_ICONS[build.role] ?? '⚔️'}</span>
              {ROLE_LABELS[build.role] ?? build.role}
            </span>
            <div className="min-w-0">
              <div className="text-xs uppercase tracking-widest text-[#5b5a56]">
                {build.champion}
              </div>
              <div className="truncate font-semibold text-[#f0e6d2] transition group-hover:text-[#c8aa6e]">
                {build.title}
              </div>
            </div>
          </Link>
          <p className="mt-2 text-xs text-[#5b5a56]">
            Güncellenme:{' '}
            {new Date(build.updated_at).toLocaleDateString('tr-TR', {
              day: 'numeric',
              month: 'short',
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