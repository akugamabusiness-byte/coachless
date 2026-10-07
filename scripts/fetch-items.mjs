// scripts/fetch-items.mjs
// Community Dragon'dan tüm item'ları çekip data.ts'e yazar

import { writeFileSync } from 'fs'
import { resolve } from 'path'

const CDRAGON_URL = 'https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/items.json'

async function main() {
  console.log('📥 Community Dragon\'dan item listesi çekiliyor...')

  const res = await fetch(CDRAGON_URL)
  if (!res.ok) {
    console.error('❌ Fetch hatası:', res.status)
    process.exit(1)
  }

  const items = await res.json()
  console.log(`✅ ${items.length} item çekildi`)

  // Sadece isimli, satın alınabilir item'ları filtrele
  // (bazıları test/tutorial/legacy)
  const validItems = items
    .filter((item) => {
      if (!item.name || item.name === '') return false
      if (item.inStore === false) return false
      if (item.name.startsWith('[')) return false // test item'ları
      return true
    })
    .map((item) => ({
      id: item.id,
      name: item.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name))

  console.log(`✅ ${validItems.length} geçerli item filtrelendi`)

  // TypeScript kod bloğu oluştur
  const tsCode = `// Bu dosya otomatik oluşturuldu — DÜZENLEMEYİN
// Kaynak: Community Dragon
// Güncelleme: ${new Date().toISOString()}
// Toplam: ${validItems.length} item

export type Item = {
  id: number
  name: string
}

export const ALL_ITEMS: Item[] = ${JSON.stringify(validItems, null, 2)}
`

  const outPath = resolve('src/lib/lol/items.generated.ts')
  writeFileSync(outPath, tsCode, 'utf-8')
  console.log(`✅ Yazıldı: ${outPath}`)
  console.log(`\n🎉 Bitti! Şimdi data.ts'te import et:`)
  console.log(`   import { ALL_ITEMS } from './items.generated'`)
}

main().catch((err) => {
  console.error('❌ Hata:', err)
  process.exit(1)
})