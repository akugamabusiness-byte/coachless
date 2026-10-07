// src/components/ConfirmModal.tsx
'use client'

import { useEffect } from 'react'

type Props = {
  open: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  variant?: 'danger' | 'default'
  loading?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmText = 'Onayla',
  cancelText = 'İptal',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
}: Props) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) onCancel()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-lg border border-[#1e3a5f] bg-[#0a1428] p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-semibold text-[#f0e6d2]">{title}</h3>
        <p className="mt-3 whitespace-pre-wrap text-sm text-[#a09b8c]">
          {message}
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-[#1e3a5f] px-4 py-2 text-sm text-[#a09b8c] transition hover:border-[#785a28] hover:text-[#f0e6d2] disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-md px-4 py-2 text-sm font-medium transition disabled:opacity-50 ${
              variant === 'danger'
                ? 'bg-red-600 text-white hover:bg-red-500'
                : 'bg-gradient-to-br from-[#c8aa6e] to-[#785a28] text-[#010a13] hover:shadow-[0_0_20px_rgba(200,170,110,0.4)]'
            }`}
          >
            {loading ? 'İşleniyor...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}