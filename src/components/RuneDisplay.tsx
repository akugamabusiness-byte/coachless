// src/components/RuneDisplay.tsx
import Image from 'next/image'
import {
  parseRunes,
  getRuneIconUrl,
  getRuneTreeIconUrl,
  RUNE_TREES,
} from '@/lib/lol/data'

type Props = {
  runesRaw: string
}

export default function RuneDisplay({ runesRaw }: Props) {
  const parsed = parseRunes(runesRaw)
  const hasStructured =
    parsed.primaryTree || parsed.keystone || parsed.secondaryTree

  return (
    <div className="space-y-6">
      {/* Yapılandırılmış görsel */}
      {hasStructured && (
        <div className="grid gap-4 sm:grid-cols-2">
          {/* ANA AĞAÇ */}
          {parsed.primaryTree && (
            <div className="rounded-lg border border-[#1e3a5f] bg-[#0a1428] p-4">
              <div className="mb-3 flex items-center gap-3">
                <Image
                  src={getRuneTreeIconUrl(parsed.primaryTree)}
                  alt={parsed.primaryTree}
                  width={40}
                  height={40}
                  className="rounded-full border-2"
                  style={{
                    borderColor: RUNE_TREES[parsed.primaryTree].color,
                  }}
                  unoptimized
                />
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#5b5a56]">
                    Ana Ağaç
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: RUNE_TREES[parsed.primaryTree].color }}
                  >
                    {RUNE_TREES[parsed.primaryTree].name}
                  </div>
                </div>
              </div>

              {/* Keystone */}
              {parsed.keystone && (
                <div className="mb-3 flex items-center gap-3 rounded-md bg-[#010a13] p-3">
                  <Image
                    src={getRuneIconUrl(parsed.keystone.icon)}
                    alt={parsed.keystone.name}
                    width={48}
                    height={48}
                    className="rounded-full border-2"
                    style={{
                      borderColor: RUNE_TREES[parsed.keystone.tree].color,
                    }}
                    unoptimized
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[10px] uppercase tracking-widest text-[#c8aa6e]">
                      Anahtar
                    </div>
                    <div className="truncate text-sm font-medium text-[#f0e6d2]">
                      {parsed.keystone.name}
                    </div>
                  </div>
                </div>
              )}

              {/* Primary runes */}
              {parsed.primaryRunes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {parsed.primaryRunes.map((rune) => (
                    <div
                      key={rune.id}
                      className="flex items-center gap-2 rounded-md border border-[#1e3a5f] bg-[#010a13] px-2 py-1.5"
                    >
                      <Image
                        src={getRuneIconUrl(rune.icon)}
                        alt={rune.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                        unoptimized
                      />
                      <span className="text-xs text-[#a09b8c]">
                        {rune.name}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* YAN AĞAÇ */}
          {parsed.secondaryTree && (
            <div className="rounded-lg border border-[#1e3a5f] bg-[#0a1428] p-4">
              <div className="mb-3 flex items-center gap-3">
                <Image
                  src={getRuneTreeIconUrl(parsed.secondaryTree)}
                  alt={parsed.secondaryTree}
                  width={40}
                  height={40}
                  className="rounded-full border-2"
                  style={{
                    borderColor: RUNE_TREES[parsed.secondaryTree].color,
                  }}
                  unoptimized
                />
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#5b5a56]">
                    Yan Ağaç
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: RUNE_TREES[parsed.secondaryTree].color }}
                  >
                    {RUNE_TREES[parsed.secondaryTree].name}
                  </div>
                </div>
              </div>

              {parsed.secondaryRunes.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {parsed.secondaryRunes.map((rune) => (
                    <div
                      key={rune.id}
                      className="flex items-center gap-2 rounded-md border border-[#1e3a5f] bg-[#010a13] px-2 py-1.5"
                    >
                      <Image
                        src={getRuneIconUrl(rune.icon)}
                        alt={rune.name}
                        width={24}
                        height={24}
                        className="rounded-full"
                        unoptimized
                      />
                      <span className="text-xs text-[#a09b8c]">
                        {rune.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-[#5b5a56]">
                  Yan ağaç rünleri belirtilmemiş
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Ham metin (fallback / referans) */}
      <div className="rounded-lg border border-[#1e3a5f] bg-[#0a1428] p-4">
        <div className="mb-2 text-[10px] uppercase tracking-widest text-[#5b5a56]">
          📝 Rün Notları
        </div>
        <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-[#a09b8c]">
          {runesRaw}
        </pre>
      </div>
    </div>
  )
}