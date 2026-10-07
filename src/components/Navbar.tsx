// src/components/Navbar.tsx
import { createClient } from '@/lib/supabase/server'
import NavbarClient from './NavbarClient'

export default async function Navbar() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  let avatarUrl: string | null = null
  let displayName: string | null = null

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('avatar_url, display_name, username')
      .eq('id', user.id)
      .single()

    avatarUrl = profile?.avatar_url ?? null
    displayName =
      profile?.display_name ?? profile?.username?.split('@')[0] ?? null
  }

  return (
    <NavbarClient
      userEmail={user?.email ?? null}
      avatarUrl={avatarUrl}
      displayName={displayName}
    />
  )
}