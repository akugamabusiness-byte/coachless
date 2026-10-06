// src/app/builds/[id]/edit/page.tsx
import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EditForm from './EditForm'

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

  const itemsText = Array.isArray(build.items)
    ? build.items.map((it: any) => it.name ?? '').join('\n')
    : ''
  const runesText = build.runes?.raw ?? ''

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <Link
          href={`/builds/${build.id}`}
          className="text-sm text-gray-400 hover:text-yellow-500"
        >
          ← Build&apos;e dön
        </Link>
        <h1 className="mt-3 text-3xl font-bold text-white">
          Build&apos;i Düzenle
        </h1>
        <p className="mt-2 text-gray-400">{build.title}</p>
      </div>

      <EditForm
        build={{
          id: build.id,
          title: build.title,
          champion: build.champion,
          role: build.role,
          itemsText,
          runesText,
          description: build.description ?? '',
          status: build.status,
        }}
      />
    </div>
  )
}