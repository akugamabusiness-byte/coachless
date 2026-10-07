// src/app/dashboard/profile/AutoOpenProfileModal.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProfileEditModal from '@/components/ProfileEditModal'

export default function AutoOpenProfileModal() {
  const router = useRouter()
  const [open, setOpen] = useState(true)

  return (
    <ProfileEditModal
      open={open}
      onClose={() => {
        setOpen(false)
        router.push('/dashboard')
      }}
    />
  )
}