// src/components/ProfileEditModal.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import {
  usePresence,
  type PresenceStatus,
} from '@/lib/presence/PresenceProvider'
import StatusPicker from '@/lib/presence/StatusPicker'
import StatusDot from './StatusDot'

type Props = {
  open: boolean
  onClose: () => void
}

type Tab = 'profile' | 'status' | 'password'

export default function ProfileEditModal({ open, onClose }: Props) {
  const supabase = createClient()
  const { currentUserStatus, setStatus, user } = usePresence()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [closing, setClosing] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  const [displayName, setDisplayName] = useState('')
  const [customStatus, setCustomStatus] = useState('')
  const [bio, setBio] = useState('')
  const [primaryRole, setPrimaryRole] = useState('')
  const [summonerName, setSummonerName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [bannerUrl, setBannerUrl] = useState<string | null>(null)
  const [status, setLocalStatus] = useState<PresenceStatus>('online')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [avatarInputKey, setAvatarInputKey] = useState(0)
  const [bannerInputKey, setBannerInputKey] = useState(0)

  useEffect(() => {
    if (!open || !user) return

    setLoading(true)
    setError(null)
    setSuccess(false)
    setActiveTab('profile')

    supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setError('Profil yüklenemedi.')
          setLoading(false)
          return
        }
        setDisplayName(data.display_name ?? '')
        setCustomStatus(data.custom_status ?? '')
        setBio(data.bio ?? '')
        setPrimaryRole(data.primary_role ?? '')
        setSummonerName(data.summoner_name ?? '')
        setAvatarUrl(data.avatar_url ?? null)
        setBannerUrl(data.banner_url ?? null)
        setLocalStatus(currentUserStatus)
        setLoading(false)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, user])

  function handleClose() {
    setClosing(true)
    setTimeout(() => {
      setClosing(false)
      onClose()
    }, 200)
  }

  useEffect(() => {
    if (!open) return
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (!file.type.startsWith('image/')) {
      setError('Sadece resim yükleyebilirsin.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Maksimum 2MB.')
      return
    }

    setError(null)
    setUploadingAvatar(true)

    const ext = file.name.split('.').pop() || 'png'
    const fileName = `${user.id}/avatar-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setError(uploadError.message)
      setUploadingAvatar(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    if (avatarUrl) {
      const oldPath = avatarUrl.split('/avatars/')[1]
      if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath])
      }
    }

    setAvatarUrl(urlData.publicUrl)
    setUploadingAvatar(false)
    setAvatarInputKey((k) => k + 1)
  }

  async function handleBannerUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !user) return

    if (!file.type.startsWith('image/')) {
      setError('Sadece resim yükleyebilirsin.')
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setError('Banner maksimum 3MB olabilir.')
      return
    }

    setError(null)
    setUploadingBanner(true)

    const ext = file.name.split('.').pop() || 'png'
    const fileName = `${user.id}/banner-${Date.now()}.${ext}`

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { cacheControl: '3600', upsert: false })

    if (uploadError) {
      setError(uploadError.message)
      setUploadingBanner(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    if (bannerUrl) {
      const oldPath = bannerUrl.split('/avatars/')[1]
      if (oldPath) {
        await supabase.storage.from('avatars').remove([oldPath])
      }
    }

    setBannerUrl(urlData.publicUrl)
    setUploadingBanner(false)
    setBannerInputKey((k) => k + 1)
  }

  async function handleRemoveAvatar() {
    if (!avatarUrl || !user) return
    const path = avatarUrl.split('/avatars/')[1]
    if (path) {
      await supabase.storage.from('avatars').remove([path])
    }
    setAvatarUrl(null)
  }

  async function handleRemoveBanner() {
    if (!bannerUrl || !user) return
    const path = bannerUrl.split('/avatars/')[1]
    if (path) {
      await supabase.storage.from('avatars').remove([path])
    }
    setBannerUrl(null)
  }

  async function handleSaveProfile() {
    if (!user) return
    setError(null)
    setSuccess(false)
    setSaving(true)

    if (bio.length > 500) {
      setError('Bio en fazla 500 karakter olabilir.')
      setSaving(false)
      return
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        display_name: displayName.trim() || null,
        custom_status: customStatus.trim() || null,
        bio: bio.trim() || null,
        primary_role: primaryRole || null,
        summoner_name: summonerName.trim() || null,
        avatar_url: avatarUrl,
        banner_url: bannerUrl,
      })
      .eq('id', user.id)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    setSuccess(true)
    setSaving(false)
    setTimeout(() => {
      handleClose()
      setTimeout(() => window.location.reload(), 250)
    }, 600)
  }

  async function handleSaveStatus() {
    if (!user) return
    setError(null)
    setSuccess(false)
    setSaving(true)

    const { error } = await supabase
      .from('profiles')
      .update({ status })
      .eq('id', user.id)

    if (error) {
      setError(error.message)
      setSaving(false)
      return
    }

    if (status !== currentUserStatus) setStatus(status)

    setSuccess(true)
    setSaving(false)
    setTimeout(() => setSuccess(false), 2000)
  }

  async function handleChangePassword() {
    if (!user || !user.email) return
    setError(null)
    setSuccess(false)

    if (newPassword.length < 6) {
      setError('Yeni şifre en az 6 karakter olmalı.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Yeni şifreler eşleşmiyor.')
      return
    }
    if (currentPassword === newPassword) {
      setError('Yeni şifre, mevcut şifreden farklı olmalı.')
      return
    }

    setSaving(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: currentPassword,
    })

    if (signInError) {
      setError('Mevcut şifre yanlış.')
      setSaving(false)
      return
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (updateError) {
      setError(updateError.message)
      setSaving(false)
      return
    }

    setSuccess(true)
    setSaving(false)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setTimeout(() => setSuccess(false), 3000)
  }

  if (!open) return null

  const displayNamePreview =
    displayName || user?.email?.split('@')[0] || 'Summoner'
  const initial = displayNamePreview[0]?.toUpperCase() ?? 'U'
  const username = user?.email?.split('@')[0] ?? 'summoner'

  return (
    <div
      className={`modal-backdrop fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 ${
        closing ? 'closing' : ''
      }`}
      onClick={handleClose}
    >
      <div
        className={`modal-content max-h-[92vh] w-full max-w-3xl overflow-y-auto overflow-x-hidden rounded-2xl border border-[#1e3a5f]/50 bg-[#0a1428] shadow-[0_25px_70px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/[0.03] ${
          closing ? 'closing' : ''
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ============ BANNER ============ */}
        <div className="group/banner relative h-28 overflow-hidden rounded-t-2xl">
          {bannerUrl ? (
            <Image
              src={bannerUrl}
              alt="Banner"
              fill
              className="object-cover"
              unoptimized
              priority
            />
          ) : (
            <div
              className="banner-animated absolute inset-0"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, #785a28 0%, #7b3fe4 50%, #0a1428 100%)',
              }}
            />
          )}

          {/* Karartma katmanları */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1428] via-transparent to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[length:16px_16px] opacity-40" />
          <div className="pointer-events-none absolute inset-0 bg-black/0 transition-all duration-300 group-hover/banner:bg-black/40" />

          {/* Hover'da ortada çıkan büyük buton */}
          <label className="absolute inset-0 z-[5] flex cursor-pointer items-center justify-center opacity-0 transition-opacity duration-300 group-hover/banner:opacity-100">
            <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-black/70 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-md transition-transform duration-200 hover:scale-105">
              {uploadingBanner ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Yükleniyor...
                </>
              ) : (
                <>📷 Banner {bannerUrl ? 'Değiştir' : 'Yükle'}</>
              )}
            </div>
            <input
              key={`hover-${bannerInputKey}`}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleBannerUpload}
              disabled={uploadingBanner}
              className="hidden"
            />
          </label>

          {/* Kapat butonu */}
          <button
            onClick={handleClose}
            className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-black/80"
            title="Kapat (ESC)"
          >
            ✕
          </button>

          {/* Banner kaldır */}
          {bannerUrl && (
            <button
              onClick={handleRemoveBanner}
              className="absolute left-3 top-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-xs text-white backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:bg-red-600/80"
              title="Bannerı Kaldır"
            >
              🗑️
            </button>
          )}

          {/* HER ZAMAN GÖRÜNEN küçük banner butonu (sağ altta) */}
          <label
            className="absolute bottom-3 right-3 z-10 flex cursor-pointer items-center gap-1.5 rounded-md border border-white/15 bg-black/60 px-2.5 py-1.5 text-[11px] font-medium text-white/90 backdrop-blur-md transition-all duration-200 hover:border-[#c8aa6e]/50 hover:bg-black/80 hover:text-[#c8aa6e]"
            title={bannerUrl ? 'Bannerı Değiştir' : 'Banner Yükle'}
          >
            {uploadingBanner ? (
              <>
                <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Yükleniyor
              </>
            ) : (
              <>📷 {bannerUrl ? 'Bannerı Değiştir' : 'Banner Yükle'}</>
            )}
            <input
              key={`corner-${bannerInputKey}`}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleBannerUpload}
              disabled={uploadingBanner}
              className="hidden"
            />
          </label>
        </div>

        {/* ============ HEADER ============ */}
        <div className="relative border-b border-white/[0.04] px-6 pb-0 pt-0">
          <div className="-mt-10 flex items-end gap-4 pb-3">
            {/* Avatar */}
            <div className="group/avatar relative shrink-0">
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-[#c8aa6e] via-[#7b3fe4] to-[#c8aa6e] opacity-60 blur-md transition-opacity duration-300 group-hover/avatar:opacity-100" />
              <div className="relative">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={displayNamePreview}
                    width={84}
                    height={84}
                    className="h-[84px] w-[84px] rounded-full border-[3px] border-[#0a1428] object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="flex h-[84px] w-[84px] items-center justify-center rounded-full border-[3px] border-[#0a1428] bg-gradient-to-br from-[#c8aa6e] to-[#785a28] text-2xl font-bold text-[#010a13]">
                    {initial}
                  </div>
                )}
                <div className="absolute bottom-0.5 right-0.5">
                  <StatusDot status={status} size="lg" />
                </div>

                {uploadingAvatar && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#c8aa6e] border-t-transparent" />
                  </div>
                )}
              </div>

              {/* Kamera ikonu */}
              <label
                className="absolute -bottom-0.5 -right-0.5 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-[#0a1428] bg-[#c8aa6e] text-xs text-[#010a13] shadow-lg transition-all duration-200 hover:scale-110"
                title="Avatar Yükle"
              >
                📷
                <input
                  key={avatarInputKey}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarUpload}
                  disabled={uploadingAvatar}
                  className="hidden"
                />
              </label>
            </div>

            {/* İsim */}
            <div className="min-w-0 flex-1 pb-1">
              <h2 className="truncate text-lg font-semibold tracking-tight text-[#f0e6d2]">
                {displayNamePreview}
              </h2>
              <p className="truncate text-xs text-[#5b5a56]">
                @{username}
                {summonerName && (
                  <span className="ml-2 text-[#785a28]">· {summonerName}</span>
                )}
              </p>
            </div>
          </div>

          {/* Tab'lar */}
          <div className="flex gap-6">
            <TabButton
              active={activeTab === 'profile'}
              onClick={() => setActiveTab('profile')}
              label="Profil"
            />
            <TabButton
              active={activeTab === 'status'}
              onClick={() => setActiveTab('status')}
              label="Durum"
            />
            <TabButton
              active={activeTab === 'password'}
              onClick={() => setActiveTab('password')}
              label="Şifre"
            />
          </div>
        </div>

        {/* ============ İÇERİK ============ */}
        <div className="px-6 py-5">
          {loading ? (
            <div className="py-12 text-center text-sm text-[#a09b8c]">
              Yükleniyor...
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 rounded-md border border-red-500/30 bg-red-500/5 p-2.5 text-xs text-red-400 backdrop-blur-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="mb-4 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-2.5 text-xs text-emerald-400 backdrop-blur-sm">
                  ✓ Kaydedildi
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="space-y-3.5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Görünen Ad">
                      <input
                        type="text"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Aku The Carry"
                        maxLength={50}
                        className="input-minimal"
                      />
                    </Field>

                    <Field label="Summoner Adı">
                      <input
                        type="text"
                        value={summonerName}
                        onChange={(e) => setSummonerName(e.target.value)}
                        placeholder="Aku#TR1"
                        maxLength={30}
                        className="input-minimal"
                      />
                    </Field>
                  </div>

                  <Field label="Özel Durum">
                    <input
                      type="text"
                      value={customStatus}
                      onChange={(e) => setCustomStatus(e.target.value)}
                      placeholder="🎮 Ranked atıyorum"
                      maxLength={80}
                      className="input-minimal"
                    />
                  </Field>

                  <Field
                    label="Hakkımda"
                    hint={`${bio.length}/500`}
                    hintWarn={bio.length > 450}
                  >
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      maxLength={500}
                      placeholder="Ahri main, Diamond 3, mid lane..."
                      className="input-minimal resize-none"
                    />
                  </Field>

                  <Field label="Ana Rol">
                    <div className="flex gap-1.5">
                      {[
                        { v: 'top', label: '⚔️', title: 'Üst Koridor' },
                        { v: 'jungle', label: '🌲', title: 'Orman' },
                        { v: 'mid', label: '🔮', title: 'Orta Koridor' },
                        { v: 'adc', label: '🏹', title: 'Alt Koridor' },
                        { v: 'support', label: '🛡️', title: 'Destek' },
                      ].map((role) => (
                        <button
                          key={role.v}
                          type="button"
                          title={role.title}
                          onClick={() =>
                            setPrimaryRole(primaryRole === role.v ? '' : role.v)
                          }
                          className={`flex h-10 flex-1 items-center justify-center rounded-md border text-base transition-all duration-200 ${
                            primaryRole === role.v
                              ? 'border-[#c8aa6e]/60 bg-[#785a28]/20 shadow-[0_0_20px_rgba(200,170,110,0.15)]'
                              : 'border-white/[0.06] bg-white/[0.02] hover:border-[#785a28]/50 hover:bg-white/[0.04]'
                          }`}
                        >
                          {role.label}
                        </button>
                      ))}
                    </div>
                  </Field>
                </div>
              )}

              {activeTab === 'status' && (
                <div className="space-y-4">
                  <p className="text-xs text-[#5b5a56]">
                    Durumun, üye listesinde diğer kullanıcılara gösterilir.
                  </p>

                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-2">
                    <StatusPicker value={status} onChange={setLocalStatus} />
                  </div>

                  <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-3">
                    <p className="mb-2.5 text-[10px] uppercase tracking-widest text-[#5b5a56]">
                      Önizleme
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={displayNamePreview}
                            width={36}
                            height={36}
                            className="rounded-full border border-[#785a28] object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-[#c8aa6e] to-[#785a28] text-xs font-bold text-[#010a13]">
                            {initial}
                          </div>
                        )}
                        <div className="absolute -bottom-0.5 -right-0.5">
                          <StatusDot status={status} size="sm" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-[#f0e6d2]">
                          {displayNamePreview}
                        </div>
                        {customStatus && (
                          <div className="truncate text-xs text-[#a09b8c]">
                            {customStatus}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="space-y-3.5">
                  <p className="text-xs text-[#5b5a56]">
                    Güvenliğin için mevcut şifreni doğrulaman gerekiyor.
                  </p>

                  <Field label="Mevcut Şifre">
                    <input
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-minimal"
                    />
                  </Field>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <Field label="Yeni Şifre">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="En az 6 karakter"
                        className="input-minimal"
                      />
                    </Field>

                    <Field label="Yeni Şifre (tekrar)">
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        className="input-minimal"
                      />
                    </Field>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* ============ FOOTER ============ */}
        {!loading && (
          <div className="flex items-center justify-between border-t border-white/[0.04] bg-white/[0.015] px-6 py-3.5 backdrop-blur-sm">
            <button
              type="button"
              onClick={handleClose}
              className="text-xs text-[#5b5a56] transition hover:text-[#a09b8c]"
            >
              İptal
            </button>

            <div className="flex gap-2">
              {activeTab === 'profile' && (
                <PrimaryButton
                  onClick={handleSaveProfile}
                  disabled={saving || success}
                  loading={saving}
                  success={success}
                  label="Kaydet"
                />
              )}
              {activeTab === 'status' && (
                <PrimaryButton
                  onClick={handleSaveStatus}
                  disabled={saving || success}
                  loading={saving}
                  success={success}
                  label="Durumu Kaydet"
                />
              )}
              {activeTab === 'password' && (
                <PrimaryButton
                  onClick={handleChangePassword}
                  disabled={saving || success}
                  loading={saving}
                  success={success}
                  label="Şifreyi Değiştir"
                />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ============================================
// YARDIMCI BİLEŞENLER
// ============================================

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative pb-3 pt-1 text-xs font-medium tracking-wide transition-colors duration-200 ${
        active ? 'text-[#f0e6d2]' : 'text-[#5b5a56] hover:text-[#a09b8c]'
      }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#c8aa6e] to-transparent" />
      )}
    </button>
  )
}

function Field({
  label,
  hint,
  hintWarn,
  children,
}: {
  label: string
  hint?: string
  hintWarn?: boolean
  children: React.ReactNode
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5b5a56]">
          {label}
        </label>
        {hint && (
          <span
            className={`text-[10px] tabular-nums ${
              hintWarn ? 'text-red-400' : 'text-[#5b5a56]'
            }`}
          >
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  )
}

function PrimaryButton({
  onClick,
  disabled,
  loading,
  success,
  label,
}: {
  onClick: () => void
  disabled: boolean
  loading: boolean
  success: boolean
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="btn-glow relative overflow-hidden rounded-lg bg-gradient-to-br from-[#d4ba7e] via-[#c8aa6e] to-[#785a28] px-6 py-2 text-xs font-semibold tracking-wide text-[#010a13] shadow-[0_4px_20px_-4px_rgba(200,170,110,0.5)] transition-all duration-200 hover:scale-[1.02] hover:shadow-[0_6px_28px_-4px_rgba(200,170,110,0.7)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
    >
      {loading ? 'Kaydediliyor...' : success ? '✓ Kaydedildi' : label}
    </button>
  )
}