import type { ReactNode } from 'react'

/** PawBaku domain helpers, status chips and mock data for the Pill 1 frontend. */

export type ListingKind = 'LOST' | 'FOUND'
export type ListingStatus = 'ACTIVE' | 'MATCHED' | 'CLOSED'
export type ReportStatus =
  | 'REPORTED'
  | 'VERIFIED'
  | 'VOLUNTEER_ASSIGNED'
  | 'VET_CARE'
  | 'RESOLVED'

export interface AnimalProfile {
  name: string
  species: 'DOG' | 'CAT' | 'OTHER'
  breed: string
  color: string
  size: 'SMALL' | 'MEDIUM' | 'LARGE'
  age: number
  image: string
}

export interface ListingCard {
  id: string
  kind: ListingKind
  status: ListingStatus
  animal: AnimalProfile
  district: string
  address: string
  eventTime: string
  matchScore: number
}

export interface FeedItem {
  title: string
  description: string
  status: ReportStatus
  district: string
  time: string
  avatar: string
}

export const MARQUEE_ITEMS = [
  'İtkin & Tapılmış',
  'Övladlığa götürmə',
  'Küçə heyvanına kömək',
  'Uyğunluq balı',
  'Telegram bildiriş',
  'Foster · Milestone 2',
  'Sığınacaq · Milestone 2',
  'Sahibsiz heyvanlar',
] as const

export const LISTINGS: ListingCard[] = [
  {
    id: 'L-1042',
    kind: 'FOUND',
    status: 'ACTIVE',
    animal: {
      name: 'Reks',
      species: 'DOG',
      breed: 'Korgi',
      color: 'Kürən-ağ',
      size: 'SMALL',
      age: 18,
      image: '/hero-paw.jpg',
    },
    district: 'Xətai',
    address: 'Xətai metrosu, "Gənclik" mall yanı',
    eventTime: '2 saat əvvəl',
    matchScore: 87,
  },
  {
    id: 'L-1041',
    kind: 'LOST',
    status: 'ACTIVE',
    animal: {
      name: 'Balaca sarı',
      species: 'DOG',
      breed: 'Labrador',
      color: 'Sarı',
      size: 'LARGE',
      age: 8,
      image: '/mock-1108099.jpg',
    },
    district: 'Nizami',
    address: 'Azadlıq prospekti 7, park sektor',
    eventTime: '4 saat əvvəl',
    matchScore: 72,
  },
  {
    id: 'L-1040',
    kind: 'FOUND',
    status: 'ACTIVE',
    animal: {
      name: 'Sabir',
      species: 'DOG',
      breed: 'Alman Çoban',
      color: 'Qara-sarı',
      size: 'LARGE',
      age: 36,
      image: '/mock-333083.jpg',
    },
    district: 'Sabunçu',
    address: 'Bakıxanov qəsəbəsi, məktəb qarşısı',
    eventTime: '5 saat əvvəl',
    matchScore: 91,
  },
  {
    id: 'L-1039',
    kind: 'LOST',
    status: 'ACTIVE',
    animal: {
      name: 'Pəncə',
      species: 'DOG',
      breed: 'Qızıl quşcuq',
      color: 'Qızılı',
      size: 'MEDIUM',
      age: 6,
      image: '/hero-paw-2.jpg',
    },
    district: 'Nəsimi',
    address: 'Koroğlu körpüsü, həyət',
    eventTime: '1 gün əvvəl',
    matchScore: 64,
  },
]

export const FEED: FeedItem[] = [
  {
    title: 'Zədəli it',
    description: 'Sağ arxa ayağından yaralı — yerindəcə kömək lazımdır.',
    status: 'REPORTED',
    district: 'Binəqədi',
    time: '12 dəq əvvəl',
    avatar: 'A',
  },
  {
    title: 'Aç it',
    description: 'Bazar ətrafında üç gündür yemək axtarır, qorxaq.',
    status: 'VERIFIED',
    district: 'Yasamal',
    time: '1 saat əvvəl',
    avatar: 'L',
  },
  {
    title: 'Bala tapıldı',
    description: 'Yağışda titrəyən bala kölgəliyə aparılıb, sahibi axtarılır.',
    status: 'VOLUNTEER_ASSIGNED',
    district: 'Suraxanı',
    time: '3 saat əvvəl',
    avatar: 'G',
  },
]

const STATUS_STYLES: Record<string, string> = {
  REPORTED: 'bg-rose-50 text-rose-800 ring-rose-200',
  VERIFIED: 'bg-sky-50 text-sky-800 ring-sky-200',
  VOLUNTEER_ASSIGNED: 'bg-amber-50 text-amber-800 ring-amber-200',
  VET_CARE: 'bg-violet-50 text-violet-800 ring-violet-200',
  RESOLVED: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  ACTIVE: 'bg-emerald-50 text-emerald-800 ring-emerald-200',
  MATCHED: 'bg-sky-50 text-sky-800 ring-sky-200',
  CLOSED: 'bg-ink/5 text-ink/55 ring-ink/10',
}

const STATUS_LABELS: Record<string, string> = {
  REPORTED: 'Qeyd edildi',
  VERIFIED: 'Doğrulanıb',
  VOLUNTEER_ASSIGNED: 'Könüllü yoldadır',
  VET_CARE: 'Baytar qəbulu',
  RESOLVED: 'Həll olundu',
  ACTIVE: 'Aktiv',
  MATCHED: 'Uyğunlaşdı',
  CLOSED: 'Bağlandı',
}

export function PawBadge({ status }: { status: ReportStatus | ListingStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

export function KindTag({ kind }: { kind: ListingKind }) {
  const lost = kind === 'LOST'
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white shadow-card ${
        lost ? 'bg-rose-700' : 'bg-emerald-700'
      }`}
    >
      {lost ? 'İtkin' : 'Tapıldı'}
    </span>
  )
}

export interface Stat {
  value: number
  suffix?: string
  label: string
  hint: string
}

export const HERO_STATS: Stat[] = [
  { value: 24, suffix: '/7', label: 'Canlı axın', hint: 'Platforma istənilən saat aktivdir' },
  { value: 3, label: 'Modul', hint: 'İtkin, kömək, övladlığa götürmə' },
  { value: 50, suffix: ' m', label: 'Uyğunluq həssaslığı', hint: 'Yer radiusu və vaxt çəkisi' },
]

/** Simple type-safe chip list used by the marquee ticker. */
export const renderMarquee = (items: readonly string[]): ReactNode[] =>
  items.map((item, index) => (
    <span
      key={index}
      className="mx-5 inline-flex items-center gap-3 whitespace-nowrap text-sm font-semibold tracking-wide text-ink/70"
    >
      <span className="size-1.5 rounded-full bg-brand-600/70" />
      {item}
    </span>
  ))