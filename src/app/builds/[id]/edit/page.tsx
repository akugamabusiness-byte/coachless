// src/app/builds/[id]/edit/page.tsx
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditForm from './EditForm'
import { EMPTY_RUNE_CONFIG, type RuneConfig } from '@/lib/lol/data'

export const dynamic = 'force-dynamic'

export default async function EditBuildPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: build, error } = await supabase
    .from('builds')
    .select('*')
    .eq('id', id)
    .single()

  if (error || !build) {
    notFound()
  }

  if (build.user_id !== user.id) {
    notFound()
  }

  // items'ı yeni formata çevir
  const items = Array.isArray(build.items)
    ? build.items
        .filter((it: any) => it && typeof it === 'object')
        .map((it: any) => ({
          id: typeof it.id === 'number' ? it.id : 0,
          name: it.name ?? '',
        }))
        .filter((it: any) => it.name)
    : []

  // runes config'i al (yoksa boş config)
  const runes: RuneConfig = build.runes?.config ?? EMPTY_RUNE_CONFIG

  return (
    <div className="relative min-h-screen">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#c8aa6e]/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl px-6 py-12">
        <div className="mb-10">
          <Link
            href={`/builds/${build.id}`}
            className="text-sm text-[#a09b8c] transition hover:text-[#c8aa6e]"
          >
            ← Build&apos;e dön
          </Link>
          <h1 className="mt-3 text-4xl font-bold text-[#f0e6d2]">
            <span className="text-gradient-gold">Düzenle</span>
          </h1>
          <p className="mt-2 text-[#a09b8c]">{build.title}</p>
        </div>

        <EditForm
          build={{
            id: build.id,
            title: build.title,
            champion: build.champion,
            role: build.role,
            items,
            runes,
            description: build.description ?? '',
            status: build.status,
          }}
        />
      </div>
    </div>
  )
}