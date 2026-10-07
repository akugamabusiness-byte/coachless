// src/components/LayoutWithPanel.tsx
'use client'

import { useState } from 'react'
import MemberPanel from './MemberPanel'

export default function LayoutWithPanel({
  children,
}: {
  children: React.ReactNode
}) {
  const [panelOpen, setPanelOpen] = useState(false)

  return (
    <div className="relative flex flex-1">
      {/* Ana içerik */}
      <main className="flex-1 overflow-x-hidden">{children}</main>

      {/* Üye paneli — desktop'ta her zaman görünür, mobilde toggle ile */}
      <MemberPanel open={panelOpen} onClose={() => setPanelOpen(false)} />

      {/* Mobil için toggle butonu */}
      <button
        type="button"
        onClick={() => setPanelOpen(!panelOpen)}
        className={`fixed bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-[#785a28]/40 bg-[#0a1428] text-lg shadow-[0_8px_30px_-4px_rgba(0,0,0,0.8)] transition-all duration-300 hover:scale-110 hover:border-[#c8aa6e] hover:shadow-[0_0_20px_rgba(200,170,110,0.3)] lg:hidden ${
          panelOpen ? 'right-80' : 'right-6'
        }`}
        title="Üye Listesi"
      >
        👥
      </button>
    </div>
  )
}