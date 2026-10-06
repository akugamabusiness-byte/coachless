// src/app/register/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
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

    // E-posta doğrulama açıksa burada "e-postanı kontrol et" deriz
    // Kapalıysa direkt /dashboard'a gidebilir
    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
        <div className="w-full max-w-md rounded-lg bg-gray-900 p-6 text-center shadow-lg">
          <h2 className="text-2xl font-bold text-white">E-postanı kontrol et</h2>
          <p className="mt-3 text-gray-400">
            <strong className="text-white">{email}</strong> adresine bir
            doğrulama bağlantısı gönderdik. Bağlantıya tıklayarak hesabını
            aktifleştir.
          </p>
          <Link
            href="/login"
            className="mt-6 inline-block text-blue-400 hover:underline"
          >
            Giriş sayfasına dön
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white">LoL Coachless</h1>
          <p className="mt-2 text-gray-400">Yeni hesap oluştur</p>
        </div>

        <form
          onSubmit={handleRegister}
          className="space-y-4 rounded-lg bg-gray-900 p-6 shadow-lg"
        >
          {error && (
            <div className="rounded-md bg-red-950 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div>
            <label className="mb-1 block text-sm text-gray-300">E-posta</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none focus:border-blue-500"
              placeholder="ornek@email.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">Şifre</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none focus:border-blue-500"
              placeholder="En az 6 karakter"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-300">
              Şifre (tekrar)
            </label>
            <input
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white outline-none focus:border-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 py-2 font-medium text-white transition hover:bg-blue-500 disabled:opacity-50"
          >
            {loading ? 'Hesap oluşturuluyor...' : 'Kayıt Ol'}
          </button>

          <p className="text-center text-sm text-gray-400">
            Zaten hesabın var mı?{' '}
            <Link href="/login" className="text-blue-400 hover:underline">
              Giriş yap
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}