// src/app/dashboard/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Profil bilgilerini çek
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-white">Kontrol Paneli</h1>
        <p className="mt-2 text-gray-400">
          Hoş geldin,{' '}
          <span className="text-blue-400">
            {profile?.username ?? user.email}
          </span>
        </p>

        <div className="mt-8 rounded-lg bg-gray-900 p-6">
          <h2 className="text-xl font-semibold text-white">Hesap Bilgileri</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex gap-4">
              <dt className="w-32 text-gray-500">Kullanıcı ID:</dt>
              <dd className="font-mono text-gray-300">{user.id}</dd>
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
          <a
            href="/api/logout"
            className="text-sm text-red-400 hover:underline"
          >
            Çıkış yap
          </a>
        </div>
      </div>
    </div>
  )
}