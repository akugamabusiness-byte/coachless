// src/lib/presence/PresenceProvider.tsx
'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  type ReactNode,
} from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export type PresenceStatus = 'online' | 'idle' | 'dnd' | 'offline'

export type OnlineUser = {
  id: string
  email: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
  banner_url: string | null
  bio: string | null
  summoner_name: string | null
  primary_role: string | null
  status: PresenceStatus
  role: string
  custom_status: string | null
}

type PresenceContextType = {
  onlineUsers: OnlineUser[]
  currentUserStatus: PresenceStatus
  setStatus: (status: PresenceStatus) => void
  user: User | null
}

const PresenceContext = createContext<PresenceContextType>({
  onlineUsers: [],
  currentUserStatus: 'offline',
  setStatus: () => {},
  user: null,
})

export function usePresence() {
  return useContext(PresenceContext)
}

export function PresenceProvider({ children }: { children: ReactNode }) {
  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null)
  const [currentUserStatus, setCurrentUserStatus] =
    useState<PresenceStatus>('online')
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([])
  const profileCacheRef = useRef<Map<string, any>>(new Map())

  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const channelRef = useRef<any>(null)
  const statusRef = useRef<PresenceStatus>('online')

  // Status değiştiğinde ref'i de güncelle (closure sorununu önler)
  useEffect(() => {
    statusRef.current = currentUserStatus
  }, [currentUserStatus])

  // Profil getir (cache'li)
  async function fetchProfile(userId: string) {
    if (profileCacheRef.current.has(userId)) {
      return profileCacheRef.current.get(userId)
    }

    const { data } = await supabase
      .from('profiles')
      .select(
        'id, username, display_name, avatar_url, banner_url, bio, summoner_name, primary_role, role, custom_status'
      )
      .eq('id', userId)
      .single()

    if (data) {
      profileCacheRef.current.set(userId, data)
      return data
    }
    return null
  }

  // Kullanıcıyı al
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Presence kanalı
  useEffect(() => {
    if (!user) return

    const channel = supabase.channel('online-users', {
      config: {
        presence: {
          key: user.id,
        },
      },
    })

    channelRef.current = channel

    channel
      .on('presence', { event: 'sync' }, async () => {
        const state = channel.presenceState()
        const userIds = Object.keys(state)

        const users: OnlineUser[] = []
        for (const userId of userIds) {
          const profile = await fetchProfile(userId)
          const presences = state[userId] as any[]
          const latest = presences[presences.length - 1]

          users.push({
            id: userId,
            email: '',
            display_name: profile?.display_name ?? null,
            username: profile?.username ?? null,
            avatar_url: profile?.avatar_url ?? null,
            banner_url: profile?.banner_url ?? null,
            bio: profile?.bio ?? null,
            summoner_name: profile?.summoner_name ?? null,
            primary_role: profile?.primary_role ?? null,
            status: (latest?.status ?? 'online') as PresenceStatus,
            role: profile?.role ?? 'member',
            custom_status: profile?.custom_status ?? null,
          })
        }

        // Rollere göre sırala: admin > moderator > member > guest
        const roleOrder: Record<string, number> = {
          admin: 0,
          moderator: 1,
          member: 2,
          guest: 3,
        }
        users.sort((a, b) => {
          const roleDiff = (roleOrder[a.role] ?? 99) - (roleOrder[b.role] ?? 99)
          if (roleDiff !== 0) return roleDiff
          const aName = a.display_name ?? a.username ?? ''
          const bName = b.display_name ?? b.username ?? ''
          return aName.localeCompare(bName)
        })

        setOnlineUsers(users)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            user_id: user.id,
            status: statusRef.current,
            online_at: new Date().toISOString(),
          })
        }
      })

    return () => {
      channel.unsubscribe()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Status değişince kanalı güncelle + DB'ye yaz
  useEffect(() => {
    if (!user) return

    if (channelRef.current) {
      channelRef.current.track({
        user_id: user.id,
        status: currentUserStatus,
        online_at: new Date().toISOString(),
      })
    }

    supabase
      .from('profiles')
      .update({
        status: currentUserStatus,
        last_seen_at: new Date().toISOString(),
      })
      .eq('id', user.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUserStatus, user])

  // Idle algılama (5 dk hareketsiz → idle)
  useEffect(() => {
    if (!user) return

    function resetIdleTimer() {
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
      if (statusRef.current === 'idle') {
        setCurrentUserStatus('online')
      }
      idleTimeoutRef.current = setTimeout(() => {
        if (statusRef.current === 'online') {
          setCurrentUserStatus('idle')
        }
      }, 5 * 60 * 1000)
    }

    const events = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart']
    events.forEach((event) =>
      document.addEventListener(event, resetIdleTimer, true)
    )
    resetIdleTimer()

    return () => {
      events.forEach((event) =>
        document.removeEventListener(event, resetIdleTimer, true)
      )
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  // Sayfa kapanınca untrack (kendini online listesinden çıkar)
  useEffect(() => {
    if (!user) return

    function handleBeforeUnload() {
      if (channelRef.current) {
        channelRef.current.untrack()
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <PresenceContext.Provider
      value={{
        onlineUsers,
        currentUserStatus,
        setStatus: setCurrentUserStatus,
        user,
      }}
    >
      {children}
    </PresenceContext.Provider>
  )
}