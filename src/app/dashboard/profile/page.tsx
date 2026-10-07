// src/app/dashboard/profile/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AutoOpenProfileModal from './AutoOpenProfileModal'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 text-center">
      <AutoOpenProfileModal />
      <div className="card-lol p-12">
        <div className="mb-4 text-5xl">👤</div>
        <h1 className="text-2xl font-bold text-[#f0e6d2]">Profil Düzenleme</h1>
        <p className="mt-2 text-[#a09b8c]">
          Modal açılıyor... Açılmadıysa{' '}
          <Link href="/" className="text-[#c8aa6e] hover:underline">
            ana sayfaya dön
          </Link>{' '}
          ve sağ üstteki profil kartına tıkla.
        </p>
      </div>
    </div>
  )
}