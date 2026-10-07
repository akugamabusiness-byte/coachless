// src/lib/lol/data.ts

// ============================================
// RIOT DATA DRAGON — LoL Veri Katmanı
// ============================================

import { ALL_ITEMS } from './items.generated'

export const DDRAGON_VERSION = '15.1.1'

const DDRAGON_BASE = `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VERSION}`
const DDRAGON_IMG = `https://ddragon.leagueoflegends.com/cdn`

// ============================================
// ŞAMPİYON LİSTESİ
// ============================================

export type Champion = {
  id: string
  name: string
}

export const CHAMPIONS: Champion[] = [
  { id: 'Aatrox', name: 'Aatrox' },
  { id: 'Ahri', name: 'Ahri' },
  { id: 'Akali', name: 'Akali' },
  { id: 'Akshan', name: 'Akshan' },
  { id: 'Alistar', name: 'Alistar' },
  { id: 'Ambessa', name: 'Ambessa' },
  { id: 'Amumu', name: 'Amumu' },
  { id: 'Anivia', name: 'Anivia' },
  { id: 'Annie', name: 'Annie' },
  { id: 'Aphelios', name: 'Aphelios' },
  { id: 'Ashe', name: 'Ashe' },
  { id: 'AurelionSol', name: 'Aurelion Sol' },
  { id: 'Aurora', name: 'Aurora' },
  { id: 'Azir', name: 'Azir' },
  { id: 'Bard', name: 'Bard' },
  { id: 'Belveth', name: "Bel'Veth" },
  { id: 'Blitzcrank', name: 'Blitzcrank' },
  { id: 'Brand', name: 'Brand' },
  { id: 'Braum', name: 'Braum' },
  { id: 'Briar', name: 'Briar' },
  { id: 'Caitlyn', name: 'Caitlyn' },
  { id: 'Camille', name: 'Camille' },
  { id: 'Cassiopeia', name: 'Cassiopeia' },
  { id: 'Chogath', name: "Cho'Gath" },
  { id: 'Corki', name: 'Corki' },
  { id: 'Darius', name: 'Darius' },
  { id: 'Diana', name: 'Diana' },
  { id: 'Draven', name: 'Draven' },
  { id: 'DrMundo', name: 'Dr. Mundo' },
  { id: 'Ekko', name: 'Ekko' },
  { id: 'Elise', name: 'Elise' },
  { id: 'Evelynn', name: 'Evelynn' },
  { id: 'Ezreal', name: 'Ezreal' },
  { id: 'Fiddlesticks', name: 'Fiddlesticks' },
  { id: 'Fiora', name: 'Fiora' },
  { id: 'Fizz', name: 'Fizz' },
  { id: 'Galio', name: 'Galio' },
  { id: 'Gangplank', name: 'Gangplank' },
  { id: 'Garen', name: 'Garen' },
  { id: 'Gnar', name: 'Gnar' },
  { id: 'Gragas', name: 'Gragas' },
  { id: 'Graves', name: 'Graves' },
  { id: 'Gwen', name: 'Gwen' },
  { id: 'Hecarim', name: 'Hecarim' },
  { id: 'Heimerdinger', name: 'Heimerdinger' },
  { id: 'Hwei', name: 'Hwei' },
  { id: 'Illaoi', name: 'Illaoi' },
  { id: 'Irelia', name: 'Irelia' },
  { id: 'Ivern', name: 'Ivern' },
  { id: 'Janna', name: 'Janna' },
  { id: 'JarvanIV', name: 'Jarvan IV' },
  { id: 'Jax', name: 'Jax' },
  { id: 'Jayce', name: 'Jayce' },
  { id: 'Jhin', name: 'Jhin' },
  { id: 'Jinx', name: 'Jinx' },
  { id: 'Kaisa', name: "Kai'Sa" },
  { id: 'Kalista', name: 'Kalista' },
  { id: 'Karma', name: 'Karma' },
  { id: 'Karthus', name: 'Karthus' },
  { id: 'Kassadin', name: 'Kassadin' },
  { id: 'Katarina', name: 'Katarina' },
  { id: 'Kayle', name: 'Kayle' },
  { id: 'Kayn', name: 'Kayn' },
  { id: 'Kennen', name: 'Kennen' },
  { id: 'Khazix', name: "Kha'Zix" },
  { id: 'Kindred', name: 'Kindred' },
  { id: 'Kled', name: 'Kled' },
  { id: 'KogMaw', name: "Kog'Maw" },
  { id: 'KSante', name: "K'Sante" },
  { id: 'Leblanc', name: 'LeBlanc' },
  { id: 'LeeSin', name: 'Lee Sin' },
  { id: 'Leona', name: 'Leona' },
  { id: 'Lillia', name: 'Lillia' },
  { id: 'Lissandra', name: 'Lissandra' },
  { id: 'Lucian', name: 'Lucian' },
  { id: 'Lulu', name: 'Lulu' },
  { id: 'Lux', name: 'Lux' },
  { id: 'Malphite', name: 'Malphite' },
  { id: 'Malzahar', name: 'Malzahar' },
  { id: 'Maokai', name: 'Maokai' },
  { id: 'MasterYi', name: 'Master Yi' },
  { id: 'Milio', name: 'Milio' },
  { id: 'MissFortune', name: 'Miss Fortune' },
  { id: 'MonkeyKing', name: 'Wukong' },
  { id: 'Mordekaiser', name: 'Mordekaiser' },
  { id: 'Morgana', name: 'Morgana' },
  { id: 'Naafiri', name: 'Naafiri' },
  { id: 'Nami', name: 'Nami' },
  { id: 'Nasus', name: 'Nasus' },
  { id: 'Nautilus', name: 'Nautilus' },
  { id: 'Neeko', name: 'Neeko' },
  { id: 'Nidalee', name: 'Nidalee' },
  { id: 'Nilah', name: 'Nilah' },
  { id: 'Nocturne', name: 'Nocturne' },
  { id: 'Nunu', name: 'Nunu & Willump' },
  { id: 'Olaf', name: 'Olaf' },
  { id: 'Orianna', name: 'Orianna' },
  { id: 'Ornn', name: 'Ornn' },
  { id: 'Pantheon', name: 'Pantheon' },
  { id: 'Poppy', name: 'Poppy' },
  { id: 'Pyke', name: 'Pyke' },
  { id: 'Qiyana', name: 'Qiyana' },
  { id: 'Quinn', name: 'Quinn' },
  { id: 'Rakan', name: 'Rakan' },
  { id: 'Rammus', name: 'Rammus' },
  { id: 'RekSai', name: "Rek'Sai" },
  { id: 'Rell', name: 'Rell' },
  { id: 'Renata', name: 'Renata Glasc' },
  { id: 'Renekton', name: 'Renekton' },
  { id: 'Rengar', name: 'Rengar' },
  { id: 'Riven', name: 'Riven' },
  { id: 'Rumble', name: 'Rumble' },
  { id: 'Ryze', name: 'Ryze' },
  { id: 'Samira', name: 'Samira' },
  { id: 'Sejuani', name: 'Sejuani' },
  { id: 'Senna', name: 'Senna' },
  { id: 'Seraphine', name: 'Seraphine' },
  { id: 'Sett', name: 'Sett' },
  { id: 'Shaco', name: 'Shaco' },
  { id: 'Shen', name: 'Shen' },
  { id: 'Shyvana', name: 'Shyvana' },
  { id: 'Singed', name: 'Singed' },
  { id: 'Sion', name: 'Sion' },
  { id: 'Sivir', name: 'Sivir' },
  { id: 'Skarner', name: 'Skarner' },
  { id: 'Smolder', name: 'Smolder' },
  { id: 'Sona', name: 'Sona' },
  { id: 'Soraka', name: 'Soraka' },
  { id: 'Swain', name: 'Swain' },
  { id: 'Sylas', name: 'Sylas' },
  { id: 'Syndra', name: 'Syndra' },
  { id: 'TahmKench', name: 'Tahm Kench' },
  { id: 'Taliyah', name: 'Taliyah' },
  { id: 'Talon', name: 'Talon' },
  { id: 'Taric', name: 'Taric' },
  { id: 'Teemo', name: 'Teemo' },
  { id: 'Thresh', name: 'Thresh' },
  { id: 'Tristana', name: 'Tristana' },
  { id: 'Trundle', name: 'Trundle' },
  { id: 'Tryndamere', name: 'Tryndamere' },
  { id: 'TwistedFate', name: 'Twisted Fate' },
  { id: 'Twitch', name: 'Twitch' },
  { id: 'Udyr', name: 'Udyr' },
  { id: 'Urgot', name: 'Urgot' },
  { id: 'Varus', name: 'Varus' },
  { id: 'Vayne', name: 'Vayne' },
  { id: 'Veigar', name: 'Veigar' },
  { id: 'Velkoz', name: "Vel'Koz" },
  { id: 'Vex', name: 'Vex' },
  { id: 'Vi', name: 'Vi' },
  { id: 'Viego', name: 'Viego' },
  { id: 'Viktor', name: 'Viktor' },
  { id: 'Vladimir', name: 'Vladimir' },
  { id: 'Volibear', name: 'Volibear' },
  { id: 'Warwick', name: 'Warwick' },
  { id: 'Xayah', name: 'Xayah' },
  { id: 'Xerath', name: 'Xerath' },
  { id: 'XinZhao', name: 'Xin Zhao' },
  { id: 'Yasuo', name: 'Yasuo' },
  { id: 'Yone', name: 'Yone' },
  { id: 'Yorick', name: 'Yorick' },
  { id: 'Yunara', name: 'Yunara' },
  { id: 'Yuumi', name: 'Yuumi' },
  { id: 'Zac', name: 'Zac' },
  { id: 'Zed', name: 'Zed' },
  { id: 'Zeri', name: 'Zeri' },
  { id: 'Ziggs', name: 'Ziggs' },
  { id: 'Zilean', name: 'Zilean' },
  { id: 'Zoe', name: 'Zoe' },
  { id: 'Zyra', name: 'Zyra' },
]

// ============================================
// ITEM VERİTABANI — Community Dragon'dan
// ============================================

export type Item = {
  id: number
  name: string
}

// Tüm item'lar — `node scripts/fetch-items.mjs` ile güncellenir
// Kaynak: Community Dragon
export const COMMON_ITEMS: Item[] = ALL_ITEMS

// ============================================
// İKON URL FONKSİYONLARI
// ============================================

export function getChampionIconUrl(championId: string): string {
  return `${DDRAGON_IMG}/${DDRAGON_VERSION}/img/champion/${championId}.png`
}

export function getChampionSplashUrl(championId: string): string {
  return `${DDRAGON_IMG}/img/champion/splash/${championId}_0.jpg`
}

export function getItemIconUrl(itemId: number): string {
  return `${DDRAGON_IMG}/${DDRAGON_VERSION}/img/item/${itemId}.png`
}

export function findChampionId(name: string): string | null {
  const champ = CHAMPIONS.find(
    (c) =>
      c.name.toLowerCase() === name.toLowerCase() ||
      c.id.toLowerCase() === name.toLowerCase()
  )
  return champ?.id ?? null
}

export function findItem(name: string): Item | null {
  if (!name) return null
  const q = name.toLowerCase().trim().replace(/[^\w\s]/g, '')

  const exact = COMMON_ITEMS.find(
    (i) => i.name.toLowerCase().replace(/[^\w\s]/g, '') === q
  )
  if (exact) return exact

  const contains = COMMON_ITEMS.find((i) =>
    i.name.toLowerCase().replace(/[^\w\s]/g, '').includes(q)
  )
  if (contains) return contains

  const reverse = COMMON_ITEMS.find((i) => {
    const itemName = i.name.toLowerCase().replace(/[^\w\s]/g, '')
    return q.includes(itemName)
  })
  if (reverse) return reverse

  const queryWords = q.split(/\s+/).filter((w) => w.length > 2)
  if (queryWords.length === 0) return null

  const wordMatch = COMMON_ITEMS.find((i) => {
    const itemWords = i.name.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/)
    const matches = queryWords.filter((qw) =>
      itemWords.some((iw) => iw.includes(qw) || qw.includes(iw))
    )
    return matches.length >= 2
  })

  return wordMatch ?? null
}

// ============================================
// RÜN VERİTABANI
// ============================================

export type RuneTree = 'Precision' | 'Domination' | 'Sorcery' | 'Resolve' | 'Inspiration'

export type Rune = {
  id: string
  name: string
  icon: string
  tree: RuneTree
  type: 'keystone' | 'primary' | 'secondary'
}

export const RUNE_TREES: Record<RuneTree, { name: string; color: string; icon: string }> = {
  Precision: {
    name: 'Kesinlik',
    color: '#c8aa6e',
    icon: 'perk-images/Styles/7201_Precision.png',
  },
  Domination: {
    name: 'Hükmetme',
    color: '#ef4444',
    icon: 'perk-images/Styles/7200_Domination.png',
  },
  Sorcery: {
    name: 'Sihir',
    color: '#7b3fe4',
    icon: 'perk-images/Styles/7202_Sorcery.png',
  },
  Resolve: {
    name: 'Kararlılık',
    color: '#22c55e',
    icon: 'perk-images/Styles/7204_Resolve.png',
  },
  Inspiration: {
    name: 'İlham',
    color: '#06b6d4',
    icon: 'perk-images/Styles/7203_Whimsy.png',
  },
}

export const KEYSTONES: Rune[] = [
  { id: 'PressTheAttack', name: 'Press the Attack', icon: 'perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png', tree: 'Precision', type: 'keystone' },
  { id: 'LethalTempo', name: 'Lethal Tempo', icon: 'perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png', tree: 'Precision', type: 'keystone' },
  { id: 'FleetFootwork', name: 'Fleet Footwork', icon: 'perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png', tree: 'Precision', type: 'keystone' },
  { id: 'Conqueror', name: 'Conqueror', icon: 'perk-images/Styles/Precision/Conqueror/Conqueror.png', tree: 'Precision', type: 'keystone' },
  { id: 'Electrocute', name: 'Electrocute', icon: 'perk-images/Styles/Domination/Electrocute/Electrocute.png', tree: 'Domination', type: 'keystone' },
  { id: 'DarkHarvest', name: 'Dark Harvest', icon: 'perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png', tree: 'Domination', type: 'keystone' },
  { id: 'HailOfBlades', name: 'Hail of Blades', icon: 'perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png', tree: 'Domination', type: 'keystone' },
  { id: 'SummonAery', name: 'Summon Aery', icon: 'perk-images/Styles/Sorcery/SummonAery/SummonAery.png', tree: 'Sorcery', type: 'keystone' },
  { id: 'ArcaneComet', name: 'Arcane Comet', icon: 'perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png', tree: 'Sorcery', type: 'keystone' },
  { id: 'PhaseRush', name: 'Phase Rush', icon: 'perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png', tree: 'Sorcery', type: 'keystone' },
  { id: 'GraspOfTheUndying', name: 'Grasp of the Undying', icon: 'perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png', tree: 'Resolve', type: 'keystone' },
  { id: 'Aftershock', name: 'Aftershock', icon: 'perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png', tree: 'Resolve', type: 'keystone' },
  { id: 'Guardian', name: 'Guardian', icon: 'perk-images/Styles/Resolve/Guardian/Guardian.png', tree: 'Resolve', type: 'keystone' },
  { id: 'GlacialAugment', name: 'Glacial Augment', icon: 'perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png', tree: 'Inspiration', type: 'keystone' },
  { id: 'UnsealedSpellbook', name: 'Unsealed Spellbook', icon: 'perk-images/Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png', tree: 'Inspiration', type: 'keystone' },
  { id: 'FirstStrike', name: 'First Strike', icon: 'perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png', tree: 'Inspiration', type: 'keystone' },
]

export const COMMON_RUNES: Rune[] = [
  { id: 'Triumph', name: 'Triumph', icon: 'perk-images/Styles/Precision/Triumph.png', tree: 'Precision', type: 'primary' },
  { id: 'PresenceOfMind', name: 'Presence of Mind', icon: 'perk-images/Styles/Precision/PresenceOfMind/PresenceOfMind.png', tree: 'Precision', type: 'primary' },
  { id: 'LegendAlacrity', name: 'Legend: Alacrity', icon: 'perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png', tree: 'Precision', type: 'primary' },
  { id: 'LegendTenacity', name: 'Legend: Tenacity', icon: 'perk-images/Styles/Precision/LegendTenacity/LegendTenacity.png', tree: 'Precision', type: 'primary' },
  { id: 'CoupDeGrace', name: 'Coup de Grace', icon: 'perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png', tree: 'Precision', type: 'primary' },
  { id: 'CutDown', name: 'Cut Down', icon: 'perk-images/Styles/Precision/CutDown/CutDown.png', tree: 'Precision', type: 'primary' },
  { id: 'CheapShot', name: 'Cheap Shot', icon: 'perk-images/Styles/Domination/CheapShot/CheapShot.png', tree: 'Domination', type: 'primary' },
  { id: 'TasteOfBlood', name: 'Taste of Blood', icon: 'perk-images/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png', tree: 'Domination', type: 'primary' },
  { id: 'SuddenImpact', name: 'Sudden Impact', icon: 'perk-images/Styles/Domination/SuddenImpact/SuddenImpact.png', tree: 'Domination', type: 'primary' },
  { id: 'EyeballCollection', name: 'Eyeball Collection', icon: 'perk-images/Styles/Domination/EyeballCollection/EyeballCollection.png', tree: 'Domination', type: 'primary' },
  { id: 'UltimateHunter', name: 'Ultimate Hunter', icon: 'perk-images/Styles/Domination/UltimateHunter/UltimateHunter.png', tree: 'Domination', type: 'primary' },
  { id: 'RelentlessHunter', name: 'Relentless Hunter', icon: 'perk-images/Styles/Domination/RelentlessHunter/RelentlessHunter.png', tree: 'Domination', type: 'primary' },
  { id: 'ManaflowBand', name: 'Manaflow Band', icon: 'perk-images/Styles/Sorcery/ManaflowBand/ManaflowBand.png', tree: 'Sorcery', type: 'primary' },
  { id: 'NimbusCloak', name: 'Nimbus Cloak', icon: 'perk-images/Styles/Sorcery/NimbusCloak/6361.png', tree: 'Sorcery', type: 'primary' },
  { id: 'Transcendence', name: 'Transcendence', icon: 'perk-images/Styles/Sorcery/Transcendence/Transcendence.png', tree: 'Sorcery', type: 'primary' },
  { id: 'Scorch', name: 'Scorch', icon: 'perk-images/Styles/Sorcery/Scorch/Scorch.png', tree: 'Sorcery', type: 'primary' },
  { id: 'GatheringStorm', name: 'Gathering Storm', icon: 'perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png', tree: 'Sorcery', type: 'primary' },
  { id: 'Demolish', name: 'Demolish', icon: 'perk-images/Styles/Resolve/Demolish/Demolish.png', tree: 'Resolve', type: 'primary' },
  { id: 'FontOfLife', name: 'Font of Life', icon: 'perk-images/Styles/Resolve/FontOfLife/FontOfLife.png', tree: 'Resolve', type: 'primary' },
  { id: 'BonePlating', name: 'Bone Plating', icon: 'perk-images/Styles/Resolve/BonePlating/BonePlating.png', tree: 'Resolve', type: 'primary' },
  { id: 'SecondWind', name: 'Second Wind', icon: 'perk-images/Styles/Resolve/SecondWind/SecondWind.png', tree: 'Resolve', type: 'primary' },
  { id: 'Overgrowth', name: 'Overgrowth', icon: 'perk-images/Styles/Resolve/Overgrowth/Overgrowth.png', tree: 'Resolve', type: 'primary' },
  { id: 'Unflinching', name: 'Unflinching', icon: 'perk-images/Styles/Resolve/Unflinching/Unflinching.png', tree: 'Resolve', type: 'primary' },
  { id: 'MagicalFootwear', name: 'Magical Footwear', icon: 'perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png', tree: 'Inspiration', type: 'primary' },
  { id: 'PerfectTiming', name: 'Perfect Timing', icon: 'perk-images/Styles/Inspiration/PerfectTiming/PerfectTiming.png', tree: 'Inspiration', type: 'primary' },
  { id: 'BiscuitDelivery', name: 'Biscuit Delivery', icon: 'perk-images/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png', tree: 'Inspiration', type: 'primary' },
  { id: 'CosmicInsight', name: 'Cosmic Insight', icon: 'perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png', tree: 'Inspiration', type: 'primary' },
  { id: 'ApproachVelocity', name: 'Approach Velocity', icon: 'perk-images/Styles/Inspiration/ApproachVelocity/ApproachVelocity.png', tree: 'Inspiration', type: 'primary' },
]

export function getRuneIconUrl(iconPath: string): string {
  return `${DDRAGON_IMG}/img/${iconPath}`
}

export function getRuneTreeIconUrl(tree: RuneTree): string {
  return `${DDRAGON_IMG}/img/${RUNE_TREES[tree].icon}`
}

export function findRune(name: string): Rune | null {
  const q = name.toLowerCase().trim()
  if (!q) return null

  const keystone = KEYSTONES.find((r) => r.name.toLowerCase() === q)
  if (keystone) return keystone

  const common = COMMON_RUNES.find((r) => r.name.toLowerCase() === q)
  if (common) return common

  const partial = [...KEYSTONES, ...COMMON_RUNES].find((r) =>
    r.name.toLowerCase().includes(q) || q.includes(r.name.toLowerCase())
  )
  return partial ?? null
}

export function findRuneTree(name: string): RuneTree | null {
  const q = name.toLowerCase().trim()
  if (!q) return null

  const trees: RuneTree[] = ['Precision', 'Domination', 'Sorcery', 'Resolve', 'Inspiration']
  for (const tree of trees) {
    if (tree.toLowerCase().includes(q) || q.includes(tree.toLowerCase())) return tree
  }

  const turkishMap: Record<string, RuneTree> = {
    'kesinlik': 'Precision',
    'hükmetme': 'Domination',
    'sihir': 'Sorcery',
    'kararlılık': 'Resolve',
    'ilham': 'Inspiration',
  }
  for (const [tr, en] of Object.entries(turkishMap)) {
    if (q.includes(tr)) return en
  }

  return null
}

export function getRunesByTree(tree: RuneTree): {
  keystones: Rune[]
  primary: Rune[]
} {
  return {
    keystones: KEYSTONES.filter((r) => r.tree === tree),
    primary: COMMON_RUNES.filter((r) => r.tree === tree),
  }
}

// ============================================
// STAT SHARD'LAR
// ============================================

export type Shard = {
  id: string
  name: string
  row: number
}

export const SHARDS: Shard[] = [
  { id: 'adaptive-force', name: 'Adaptive Force', row: 0 },
  { id: 'attack-speed', name: 'Attack Speed', row: 0 },
  { id: 'ability-haste', name: 'Ability Haste', row: 0 },

  { id: 'adaptive-force-2', name: 'Adaptive Force', row: 1 },
  { id: 'movement-speed', name: 'Movement Speed', row: 1 },
  { id: 'health-scaling', name: 'Health Scaling', row: 1 },

  { id: 'health', name: 'Health', row: 2 },
  { id: 'tenacity', name: 'Tenacity and Slow Resist', row: 2 },
  { id: 'health-scaling-2', name: 'Health Scaling', row: 2 },
]

// ============================================
// RÜN YAPILANDIRMASI
// ============================================

export type RuneConfig = {
  primaryTree: RuneTree | null
  keystone: string | null
  primaryRunes: string[]
  secondaryTree: RuneTree | null
  secondaryRunes: string[]
  shards: string[]
}

export const EMPTY_RUNE_CONFIG: RuneConfig = {
  primaryTree: null,
  keystone: null,
  primaryRunes: [],
  secondaryTree: null,
  secondaryRunes: [],
  shards: [],
}

export function runeConfigToRaw(config: RuneConfig): string {
  const lines: string[] = []

  if (config.primaryTree) {
    lines.push(
      `Ana Ağaç: ${RUNE_TREES[config.primaryTree].name} (${config.primaryTree})`
    )
  }
  if (config.keystone) {
    lines.push(`Anahtar: ${config.keystone}`)
  }
  config.primaryRunes.forEach((r) => lines.push(r))
  if (config.secondaryTree) {
    lines.push(
      `Yan Ağaç: ${RUNE_TREES[config.secondaryTree].name} (${config.secondaryTree})`
    )
  }
  config.secondaryRunes.forEach((r) => lines.push(r))
  if (config.shards.length > 0) {
    lines.push(`Shard'lar: ${config.shards.join(', ')}`)
  }

  return lines.join('\n')
}

// ============================================
// RÜN PARSER (eski raw metinden RuneConfig'e)
// ============================================

export type ParsedRunes = {
  primaryTree: RuneTree | null
  keystone: Rune | null
  secondaryTree: RuneTree | null
  primaryRunes: Rune[]
  secondaryRunes: Rune[]
}

export function parseRunes(text: string): ParsedRunes {
  const lines = text
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const result: ParsedRunes = {
    primaryTree: null,
    keystone: null,
    secondaryTree: null,
    primaryRunes: [],
    secondaryRunes: [],
  }

  for (const line of lines) {
    const lower = line.toLowerCase()

    if (
      lower.includes('ana ağaç') ||
      lower.includes('ana ağac') ||
      lower.includes('primary')
    ) {
      const tree = findRuneTree(line)
      if (tree) result.primaryTree = tree
      continue
    }

    if (lower.includes('anahtar') || lower.includes('keystone')) {
      const rune = findRune(line)
      if (rune) {
        result.keystone = rune
        if (!result.primaryTree) result.primaryTree = rune.tree
      }
      continue
    }

    if (
      lower.includes('yan ağaç') ||
      lower.includes('yan ağac') ||
      lower.includes('secondary')
    ) {
      const tree = findRuneTree(line)
      if (tree) result.secondaryTree = tree
      continue
    }

    if (lower.includes('shard')) continue

    const rune = findRune(line)
    if (rune) {
      if (result.primaryTree && rune.tree === result.primaryTree) {
        if (rune.type === 'keystone' && !result.keystone) {
          result.keystone = rune
        } else {
          result.primaryRunes.push(rune)
        }
      } else if (result.secondaryTree && rune.tree === result.secondaryTree) {
        result.secondaryRunes.push(rune)
      } else if (!result.keystone && rune.type === 'keystone') {
        result.keystone = rune
      } else {
        result.primaryRunes.push(rune)
      }
    }
  }

  return result
}