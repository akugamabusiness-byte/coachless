// src/app/dashboard/builds/BuildActions.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import ConfirmModal from '@/components/ConfirmModal'

type Props = {
  buildId: string
  buildTitle: string
  initialStatus: 'draft' | 'published'
}

export default function BuildActions({
  buildId,
  buildTitle,
  initialStatus,
}: Props) {
  const router = useRouter()
  const supabase = createClient()

  const [status, setStatus] = useState(initialStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)

  async function toggleStatus() {
    const nextStatus = status === 'draft' ? 'published' : 'draft'
    setLoading(true)
    setError(null)

    const { error } = await supabase
      .from('builds')
      .update({ status: nextStatus })
      .eq('id', buildId)

    if (error) {
      setError(error.message)
    } else {
      setStatus(nextStatus)
      router.refresh()
    }
    setLoading(false)
  }

  async function confirmDelete() {
    setLoading(true)
    setError(null)

    const { error } = await supabase
      .from('builds')
      .delete()
      .eq('id', buildId)

    if (error) {
      setError(error.message)
      setLoading(false)
      setConfirmOpen(false)
      return
    }

    setConfirmOpen(false)
    router.refresh()
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={toggleStatus}
        disabled={loading}
        className={`rounded-md border px-3 py-1.5 text-xs font-medium transition disabled:opacity-50 ${
          status === 'draft'
            ? 'border-green-700 bg-green-950/50 text-green-400 hover:bg-green-950'
            : 'border-yellow-700 bg-yellow-950/50 text-yellow-400 hover:bg-yellow-950'
        }`}
        title={status === 'draft' ? 'Yayınla' : 'Draft yap'}
      >
        {status === 'draft' ? '🚀 Yayınla' : '📝 Draft Yap'}
      </button>

      <Link
        href={`/builds/${buildId}/edit`}
        className="rounded-md border border-gray-700 px-3 py-1.5 text-xs font-medium text-gray-300 transition hover:border-yellow-500 hover:text-yellow-500"
      >
        ✏️ Düzenle
      </Link>

      <button
        onClick={() => setConfirmOpen(true)}
        disabled={loading}
        className="rounded-md border border-red-900 bg-red-950/50 px-3 py-1.5 text-xs font-medium text-red-400 transition hover:bg-red-950 disabled:opacity-50"
      >
        🗑️ Sil
      </button>

      {error && <span className="text-xs text-red-400">{error}</span>}

      <ConfirmModal
        open={confirmOpen}
        title="Build'i sil"
        message={`"${buildTitle}" build'ini kalıcı olarak silmek istediğine emin misin?\n\nBu işlem geri alınamaz ve build'e bağlı tüm favoriler de silinir.`}
        confirmText="Evet, Sil"
        cancelText="Vazgeç"
        variant="danger"
        loading={loading}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  )
}