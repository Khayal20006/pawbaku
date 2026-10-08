import type { ReactNode } from 'react'

/** PawBaku domain helpers, status chips and mock data for the Pill 1 frontend. */

export function PawGlyph({ className = 'size-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2">
      <path
        d="M12 8.5c-1 2-2.2 3.4-3.6 4.6M12 8.5c1 2 2.2 3.4 3.6 4.6m0-6a1.4 1.4 0 1 0 .01 0m-7.2 0a1.4 1.4 0 1 0 .01 0"
        strokeLinecap="round"
      />
      <path
        d="M6 18c1 .8 2.4 1.4 3.6 2.2 1 .6 2 .6 2.4.6.4 0 1.4 0 2.4-.6 1.2-.8 2.6-1.4 3.6-2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

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
  numericId: number
  kind: ListingKind
  status: ListingStatus
  animal: AnimalProfile
  district: string
  address: string
  eventTime: string
  matchScore: number
}

export interface FeedItem {
  id?: string
  title: string
  description: string
  status: ReportStatus
  district: string
  time: string
  avatar: string
  photo?: string | null
}

export const MARQUEE_ITEMS = [
  'İtkin & Tapılmış',
  'Övladlığa götürmə',
  'Küçə heyvanına kömək',
  'Uyğunluq balı',
  'Bildirişlər · Milestone 2',
  'Foster · Milestone 2',
  'Sığınacaq · Milestone 2',
  'Sahibsiz heyvanlar',
] as const

export const LISTINGS: ListingCard[] = [
  {
    id: 'L-1042',
    numericId: 1042,
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
    address: 'Xətai metrosu, çıxış yanı',
    eventTime: '2 saat əvvəl',
    matchScore: 87,
  },
  {
    id: 'L-1041',
    numericId: 1041,
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
    numericId: 1040,
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
    numericId: 1039,
    kind: 'LOST',
    status: 'ACTIVE',
    animal: {
      name: 'Pəncə',
      species: 'DOG',
      breed: 'Qızıl retriver',
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
    title: 'Ac it',
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
  REPORTED: 'bg-brand-500 text-white',
  VERIFIED: 'bg-sea-600 text-white',
  VOLUNTEER_ASSIGNED: 'bg-sun-500 text-ink',
  VET_CARE: 'bg-violet-600 text-white',
  RESOLVED: 'bg-ink text-parchment',
  ACTIVE: 'bg-sea-600 text-white',
  MATCHED: 'bg-violet-600 text-white',
  CLOSED: 'bg-ink/10 text-ink/50',
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
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide shadow-sm ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}

export function KindTag({ kind }: { kind: ListingKind }) {
  const lost = kind === 'LOST'
  return (
    <span
      className={`pop-stick inline-flex items-center gap-1 rounded-full border-2 border-ink px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-white ${
        lost ? 'bg-rose-600' : 'bg-sea-500'
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