// src/components/RunePicker.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  RUNE_TREES,
  SHARDS,
  getRuneIconUrl,
  getRuneTreeIconUrl,
  getRunesByTree,
  type RuneTree,
  type Rune,
  type RuneConfig,
} from '@/lib/lol/data'

type Props = {
  value: RuneConfig
  onChange: (config: RuneConfig) => void
}

const ALL_TREES: RuneTree[] = [
  'Precision',
  'Domination',
  'Sorcery',
  'Resolve',
  'Inspiration',
]

export default function RunePicker({ value, onChange }: Props) {
  const [activeTab, setActiveTab] = useState<'primary' | 'secondary' | 'shards'>(
    'primary'
  )

  function update(partial: Partial<RuneConfig>) {
    onChange({ ...value, ...partial })
  }

  function selectPrimaryTree(tree: RuneTree) {
    if (value.secondaryTree === tree) {
      update({
        primaryTree: tree,
        keystone: null,
        primaryRunes: [],
        secondaryTree: null,
        secondaryRunes: [],
      })
    } else {
      update({
        primaryTree: tree,
        keystone: null,
        primaryRunes: [],
      })
    }
  }

  function selectSecondaryTree(tree: RuneTree) {
    if (value.primaryTree === tree) return
    update({ secondaryTree: tree, secondaryRunes: [] })
  }

  function togglePrimaryRune(rune: Rune) {
    const exists = value.primaryRunes.includes(rune.name)
    if (exists) {
      update({
        primaryRunes: value.primaryRunes.filter((n) => n !== rune.name),
      })
    } else {
      if (value.primaryRunes.length >= 3) return
      update({ primaryRunes: [...value.primaryRunes, rune.name] })
    }
  }

  function toggleSecondaryRune(rune: Rune) {
    const exists = value.secondaryRunes.includes(rune.name)
    if (exists) {
      update({
        secondaryRunes: value.secondaryRunes.filter((n) => n !== rune.name),
      })
    } else {
      if (value.secondaryRunes.length >= 2) return
      update({ secondaryRunes: [...value.secondaryRunes, rune.name] })
    }
  }

  function selectShard(shardId: string, row: number) {
    const shard = SHARDS.find((s) => s.id === shardId)
    if (!shard) return
    const rowShards = SHARDS.filter((s) => s.row === row).map((s) => s.name)
    const filtered = value.shards.filter((name) => !rowShards.includes(name))
    update({ shards: [...filtered, shard.name] })
  }

  const progress = {
    primaryTree: !!value.primaryTree,
    keystone: !!value.keystone,
    primaryRunes: value.primaryRunes.length === 3,
    secondaryTree: !!value.secondaryTree,
    secondaryRunes: value.secondaryRunes.length === 2,
  }

  const isComplete =
    progress.primaryTree &&
    progress.keystone &&
    progress.primaryRunes &&
    progress.secondaryTree &&
    progress.secondaryRunes

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-md border border-[#1e3a5f] bg-[#0a1428] px-4 py-2">
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <span className={progress.primaryTree ? 'text-emerald-400' : 'text-[#5b5a56]'}>
            {progress.primaryTree ? '✓' : '○'} Ana Ağaç
          </span>
          <span className={progress.keystone ? 'text-emerald-400' : 'text-[#5b5a56]'}>
            {progress.keystone ? '✓' : '○'} Anahtar
          </span>
          <span className={progress.primaryRunes ? 'text-emerald-400' : 'text-[#5b5a56]'}>
            {progress.primaryRunes ? '✓' : '○'} 3 Ana Rün
          </span>
          <span className={progress.secondaryTree ? 'text-emerald-400' : 'text-[#5b5a56]'}>
            {progress.secondaryTree ? '✓' : '○'} Yan Ağaç
          </span>
          <span className={progress.secondaryRunes ? 'text-emerald-400' : 'text-[#5b5a56]'}>
            {progress.secondaryRunes ? '✓' : '○'} 2 Yan Rün
          </span>
        </div>
        {isComplete && (
          <span className="text-xs font-medium text-emerald-400">
            ✓ Rünler Tamam
          </span>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-md border border-[#1e3a5f] bg-[#0a1428] p-1">
        <button
          type="button"
          onClick={() => setActiveTab('primary')}
          className={`flex-1 rounded px-3 py-2 text-xs font-medium transition ${
            activeTab === 'primary'
              ? 'bg-[#785a28]/30 text-[#c8aa6e]'
              : 'text-[#a09b8c] hover:bg-[#111d35]'
          }`}
        >
          Ana Ağaç {progress.primaryTree && '✓'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('secondary')}
          className={`flex-1 rounded px-3 py-2 text-xs font-medium transition ${
            activeTab === 'secondary'
              ? 'bg-[#785a28]/30 text-[#c8aa6e]'
              : 'text-[#a09b8c] hover:bg-[#111d35]'
          }`}
        >
          Yan Ağaç {progress.secondaryTree && '✓'}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('shards')}
          className={`flex-1 rounded px-3 py-2 text-xs font-medium transition ${
            activeTab === 'shards'
              ? 'bg-[#785a28]/30 text-[#c8aa6e]'
              : 'text-[#a09b8c] hover:bg-[#111d35]'
          }`}
        >
          Shard&apos;lar ({value.shards.length}/3)
        </button>
      </div>

      {/* PRIMARY */}
      {activeTab === 'primary' && (
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-xs uppercase tracking-widest text-[#5b5a56]">
              1. Ana Ağaç
            </div>
            <div className="grid grid-cols-5 gap-2">
              {ALL_TREES.map((tree) => {
                const isSelected = value.primaryTree === tree
                const isDisabled = value.secondaryTree === tree
                return (
                  <button
                    key={tree}
                    type="button"
                    onClick={() => !isDisabled && selectPrimaryTree(tree)}
                    disabled={isDisabled}
                    className={`flex flex-col items-center gap-1 rounded-md border-2 p-2 transition ${
                      isSelected
                        ? 'border-[#c8aa6e] bg-[#785a28]/20'
                        : isDisabled
                        ? 'cursor-not-allowed border-[#1e3a5f] opacity-30'
                        : 'border-[#1e3a5f] hover:border-[#785a28]'
                    }`}
                  >
                    <Image
                      src={getRuneTreeIconUrl(tree)}
                      alt={tree}
                      width={40}
                      height={40}
                      className="rounded-full"
                      unoptimized
                    />
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: RUNE_TREES[tree].color }}
                    >
                      {RUNE_TREES[tree].name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {value.primaryTree && (
            <div>
              <div className="mb-2 text-xs uppercase tracking-widest text-[#5b5a56]">
                2. Anahtar Rün (Keystone) *
              </div>
              <div className="grid grid-cols-4 gap-2">
                {getRunesByTree(value.primaryTree).keystones.map((rune) => {
                  const isSelected = value.keystone === rune.name
                  return (
                    <button
                      key={rune.id}
                      type="button"
                      onClick={() =>
                        update({ keystone: isSelected ? null : rune.name })
                      }
                      className={`group flex flex-col items-center gap-1 rounded-md border-2 p-2 transition ${
                        isSelected
                          ? 'border-[#c8aa6e] bg-[#785a28]/20'
                          : 'border-[#1e3a5f] hover:border-[#785a28]'
                      }`}
                    >
                      <Image
                        src={getRuneIconUrl(rune.icon)}
                        alt={rune.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                        unoptimized
                      />
                      <span className="w-full truncate text-center text-[10px] text-[#a09b8c] group-hover:text-[#f0e6d2]">
                        {rune.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          {value.primaryTree && (
            <div>
              <div className="mb-2 text-xs uppercase tracking-widest text-[#5b5a56]">
                3. Ana Rünler ({value.primaryRunes.length}/3)
              </div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {getRunesByTree(value.primaryTree).primary.map((rune) => {
                  const isSelected = value.primaryRunes.includes(rune.name)
                  const isDisabled = !isSelected && value.primaryRunes.length >= 3
                  return (
                    <button
                      key={rune.id}
                      type="button"
                      onClick={() => !isDisabled && togglePrimaryRune(rune)}
                      disabled={isDisabled}
                      className={`group flex flex-col items-center gap-1 rounded-md border-2 p-2 transition ${
                        isSelected
                          ? 'border-[#c8aa6e] bg-[#785a28]/20'
                          : isDisabled
                          ? 'cursor-not-allowed border-[#1e3a5f] opacity-30'
                          : 'border-[#1e3a5f] hover:border-[#785a28]'
                      }`}
                    >
                      <Image
                        src={getRuneIconUrl(rune.icon)}
                        alt={rune.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                        unoptimized
                      />
                      <span className="w-full truncate text-center text-[10px] text-[#a09b8c] group-hover:text-[#f0e6d2]">
                        {rune.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SECONDARY */}
      {activeTab === 'secondary' && (
        <div className="space-y-4">
          <div>
            <div className="mb-2 text-xs uppercase tracking-widest text-[#5b5a56]">
              1. Yan Ağaç
            </div>
            <div className="grid grid-cols-5 gap-2">
              {ALL_TREES.map((tree) => {
                const isSelected = value.secondaryTree === tree
                const isDisabled = value.primaryTree === tree
                return (
                  <button
                    key={tree}
                    type="button"
                    onClick={() => !isDisabled && selectSecondaryTree(tree)}
                    disabled={isDisabled}
                    className={`flex flex-col items-center gap-1 rounded-md border-2 p-2 transition ${
                      isSelected
                        ? 'border-[#c8aa6e] bg-[#785a28]/20'
                        : isDisabled
                        ? 'cursor-not-allowed border-[#1e3a5f] opacity-30'
                        : 'border-[#1e3a5f] hover:border-[#785a28]'
                    }`}
                  >
                    <Image
                      src={getRuneTreeIconUrl(tree)}
                      alt={tree}
                      width={40}
                      height={40}
                      className="rounded-full"
                      unoptimized
                    />
                    <span
                      className="text-[10px] font-medium"
                      style={{ color: RUNE_TREES[tree].color }}
                    >
                      {RUNE_TREES[tree].name}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {value.secondaryTree && (
            <div>
              <div className="mb-2 text-xs uppercase tracking-widest text-[#5b5a56]">
                2. Yan Rünler ({value.secondaryRunes.length}/2)
              </div>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                {getRunesByTree(value.secondaryTree).primary.map((rune) => {
                  const isSelected = value.secondaryRunes.includes(rune.name)
                  const isDisabled =
                    !isSelected && value.secondaryRunes.length >= 2
                  return (
                    <button
                      key={rune.id}
                      type="button"
                      onClick={() => !isDisabled && toggleSecondaryRune(rune)}
                      disabled={isDisabled}
                      className={`group flex flex-col items-center gap-1 rounded-md border-2 p-2 transition ${
                        isSelected
                          ? 'border-[#c8aa6e] bg-[#785a28]/20'
                          : isDisabled
                          ? 'cursor-not-allowed border-[#1e3a5f] opacity-30'
                          : 'border-[#1e3a5f] hover:border-[#785a28]'
                      }`}
                    >
                      <Image
                        src={getRuneIconUrl(rune.icon)}
                        alt={rune.name}
                        width={40}
                        height={40}
                        className="rounded-full"
                        unoptimized
                      />
                      <span className="w-full truncate text-center text-[10px] text-[#a09b8c] group-hover:text-[#f0e6d2]">
                        {rune.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SHARDS */}
      {activeTab === 'shards' && (
        <div className="space-y-4">
          <div className="text-xs uppercase tracking-widest text-[#5b5a56]">
            Stat Shard&apos;ları (her satırdan 1 tane)
          </div>
          {[0, 1, 2].map((row) => {
            const rowShards = SHARDS.filter((s) => s.row === row)
            return (
              <div key={row}>
                <div className="mb-2 text-[10px] text-[#5b5a56]">
                  {row === 0 ? 'Hücum' : row === 1 ? 'Esneklik' : 'Savunma'}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {rowShards.map((shard) => {
                    const isSelected = value.shards.includes(shard.name)
                    return (
                      <button
                        key={shard.id}
                        type="button"
                        onClick={() => selectShard(shard.id, row)}
                        className={`rounded-md border-2 px-3 py-2 text-xs transition ${
                          isSelected
                            ? 'border-[#c8aa6e] bg-[#785a28]/20 text-[#c8aa6e]'
                            : 'border-[#1e3a5f] text-[#a09b8c] hover:border-[#785a28]'
                        }`}
                      >
                        {shard.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}