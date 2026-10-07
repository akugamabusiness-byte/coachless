// src/app/dashboard/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: buildCount } = await supabase
    .from('builds')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  const { count: publishedCount } = await supabase
    .from('builds')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'published')

  const { count: favoriteCount } = await supabase
    .from('favorites')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 right-1/4 h-96 w-96 rounded-full bg-[#7b3fe4]/10 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-12">
        {/* Başlık */}
        <div className="mb-10">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#785a28] bg-[#111d35] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#c8aa6e]" />
            <span className="text-xs font-medium uppercase tracking-widest text-[#c8aa6e]">
              Kontrol Paneli
            </span>
          </div>
          <h1 className="text-4xl font-bold text-[#f0e6d2] sm:text-5xl">
            Hoş geldin,{' '}
            <span className="text-gradient-gold">
              {profile?.username?.split('@')[0] ?? 'Summoner'}
            </span>
          </h1>
          <p className="mt-3 text-[#a09b8c]">
            Build&apos;lerini yönet, favorilerini gör, yeni içerik oluştur.
          </p>
        </div>

        {/* İstatistik kartları */}
        <div className="mb-10 grid gap-5 sm:grid-cols-3">
          <Link
            href="/dashboard/builds"
            className="card-lol group p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#5b5a56]">
                  Toplam Build
                </div>
                <div className="mt-2 text-4xl font-bold text-[#f0e6d2]">
                  {buildCount ?? 0}
                </div>
                <div className="mt-2 text-xs text-[#c8aa6e]">
                  {publishedCount ?? 0} tanesi yayında
                </div>
              </div>
              <div className="text-3xl opacity-50 transition group-hover:opacity-100">
                🔨
              </div>
            </div>
          </Link>

          <Link
            href="/dashboard/favorites"
            className="card-lol group p-6"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#5b5a56]">
                  Favorilerim
                </div>
                <div className="mt-2 text-4xl font-bold text-[#c8aa6e]">
                  {favoriteCount ?? 0}
                </div>
                <div className="mt-2 text-xs text-[#a09b8c]">
                  Beğendiğin build&apos;ler
                </div>
              </div>
              <div className="text-3xl opacity-50 transition group-hover:opacity-100">
                ⭐
              </div>
            </div>
          </Link>

          <Link href="/builds/new" className="card-lol group p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs uppercase tracking-widest text-[#5b5a56]">
                  Yeni Build
                </div>
                <div className="mt-2 text-4xl font-bold text-[#f0e6d2]">+</div>
                <div className="mt-2 text-xs text-[#c8aa6e]">
                  Hemen oluştur
                </div>
              </div>
              <div className="text-3xl opacity-50 transition group-hover:opacity-100">
                ✨
              </div>
            </div>
          </Link>
        </div>

        {/* Hesap bilgileri */}
        <div className="card-lol p-6">
          <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-[#f0e6d2]">
            <span>👤</span> Hesap Bilgileri
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-4">
              <dt className="w-32 text-[#5b5a56]">E-posta</dt>
              <dd className="text-[#f0e6d2]">{user.email}</dd>
            </div>
            <div className="flex flex-wrap gap-4">
              <dt className="w-32 text-[#5b5a56]">Kullanıcı ID</dt>
              <dd className="font-mono text-xs text-[#a09b8c]">{user.id}</dd>
            </div>
            <div className="flex flex-wrap gap-4">
              <dt className="w-32 text-[#5b5a56]">Kayıt tarihi</dt>
              <dd className="text-[#a09b8c]">
                {new Date(user.created_at).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}