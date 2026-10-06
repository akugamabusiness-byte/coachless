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

  // Kendi build'lerinin sayısı
  const { count: buildCount } = await supabase
    .from('builds')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  // Yayında olanlar
  const { count: publishedCount } = await supabase
    .from('builds')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'published')

  // Favori sayısı
  const { count: favoriteCount } = await supabase
    .from('favorites')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user.id)

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Kontrol Paneli</h1>
        <p className="mt-2 text-gray-400">
          Hoş geldin,{' '}
          <span className="text-yellow-500">
            {profile?.username ?? user.email}
          </span>
        </p>
      </div>

      {/* İstatistik kartları */}
      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <Link
          href="/dashboard/builds"
          className="rounded-lg border border-gray-800 bg-gray-900 p-6 transition hover:border-yellow-500/50"
        >
          <div className="text-3xl font-bold text-white">{buildCount ?? 0}</div>
          <div className="mt-1 text-sm text-gray-400">Toplam Build</div>
          <div className="mt-2 text-xs text-yellow-500">
            {publishedCount ?? 0} tanesi yayında
          </div>
        </Link>

        <Link
          href="/dashboard/favorites"
          className="rounded-lg border border-gray-800 bg-gray-900 p-6 transition hover:border-yellow-500/50"
        >
          <div className="text-3xl font-bold text-yellow-500">
            ⭐ {favoriteCount ?? 0}
          </div>
          <div className="mt-1 text-sm text-gray-400">Favori</div>
        </Link>

        <Link
          href="/builds/new"
          className="rounded-lg border border-gray-800 bg-gray-900 p-6 transition hover:border-yellow-500/50"
        >
          <div className="text-3xl font-bold text-white">+</div>
          <div className="mt-1 text-sm text-gray-400">Yeni Build</div>
          <div className="mt-2 text-xs text-yellow-500">
            Hemen oluştur
          </div>
        </Link>
      </div>

      {/* Hesap bilgileri */}
      <div className="rounded-lg border border-gray-800 bg-gray-900 p-6">
        <h2 className="text-xl font-semibold text-white">Hesap Bilgileri</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex gap-4">
            <dt className="w-32 text-gray-500">Kullanıcı ID:</dt>
            <dd className="font-mono text-xs text-gray-300">{user.id}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-32 text-gray-500">E-posta:</dt>
            <dd className="text-gray-300">{user.email}</dd>
          </div>
          <div className="flex gap-4">
            <dt className="w-32 text-gray-500">Kayıt tarihi:</dt>
            <dd className="text-gray-300">
              {new Date(user.created_at).toLocaleDateString('tr-TR')}
            </dd>
          </div>
        </dl>
      </div>

      <div className="mt-6">
        <Link
          href="/api/logout"
          className="text-sm text-red-400 hover:underline"
        >
          Çıkış yap
        </Link>
      </div>
    </div>
  )
}