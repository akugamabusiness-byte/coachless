// src/app/register/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const supabase = createClient()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Şifreler eşleşmiyor')
      return
    }

    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#c8aa6e]/10 blur-[120px]" />
        </div>

        <div className="card-lol relative w-full max-w-md p-8 text-center">
          <div className="mb-4 text-5xl">📧</div>
          <h2 className="text-2xl font-bold text-[#f0e6d2]">
            E-postanı kontrol et
          </h2>
          <p className="mt-3 text-sm text-[#a09b8c]">
            <strong className="text-[#c8aa6e]">{email}</strong> adresine bir
            doğrulama bağlantısı gönderdik.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block btn-secondary"
          >
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-[#c8aa6e]/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-[#7b3fe4]/10 blur-[120px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-[#c8aa6e] to-[#785a28] text-sm font-bold text-[#010a13]">
              LC
            </div>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-[#f0e6d2]">
            Hesap oluştur
          </h1>
          <p className="mt-2 text-sm text-[#a09b8c]">
            Build paylaşmaya başlamak için kayıt ol
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="card-lol space-y-5 p-8"
        >
          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
              E-posta
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1428] px-3 py-2.5 text-[#f0e6d2] placeholder-[#5b5a56] outline-none transition focus:border-[#c8aa6e]"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
              Şifre
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1428] px-3 py-2.5 text-[#f0e6d2] placeholder-[#5b5a56] outline-none transition focus:border-[#c8aa6e]"
              placeholder="En az 6 karakter"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium uppercase tracking-widest text-[#5b5a56]">
              Şifre (tekrar)
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-md border border-[#1e3a5f] bg-[#0a1428] px-3 py-2.5 text-[#f0e6d2] placeholder-[#5b5a56] outline-none transition focus:border-[#c8aa6e]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50"
          >
            {loading ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
          </button>

          <div className="divider-lol !my-4" />

          <p className="text-center text-sm text-[#a09b8c]">
            Zaten hesabın var mı?{' '}
            <Link
              href="/login"
              className="font-medium text-[#c8aa6e] transition hover:text-[#f0e6d2]"
            >
              Giriş yap
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}