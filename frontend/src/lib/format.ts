import type { Role } from './types'

export const ROLE_LABELS: Record<Role, string> = {
  CITIZEN: 'Vətəndaş',
  VOLUNTEER: 'Könüllü',
  SHELTER_STAFF: 'Sığınacaq əməkdaşı',
  VET: 'Baytar',
  MODERATOR: 'Moderator',
  ADMIN: 'Administrator',
}

export const BAKU_DISTRICTS = [
  'Xəzər',
  'Sabunçu',
  'Nəsimi',
  'Yasamal',
  'Binəqədi',
  'Nizami',
  'Nərimanov',
  'Suraxanı',
  'Xətai',
  'Sabail',
  'Qaradağ',
  'Pirallahı',
]

export const BAKU_CENTER: [number, number] = [40.4093, 49.8671]

const dateFormatter = new Intl.DateTimeFormat('az-AZ', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('az-AZ', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  return dateFormatter.format(new Date(value))
}

export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  return dateTimeFormatter.format(new Date(value))
}

/** "3 dəqiqə əvvəl" — reads better on a dashboard than a raw timestamp. */
export function formatRelative(value: string | null | undefined): string {
  if (!value) return '—'
  const seconds = Math.round((Date.now() - new Date(value).getTime()) / 1000)
  if (seconds < 60) return 'indi'
  const minutes = Math.round(seconds / 60)
  if (minutes < 60) return `${minutes} dəqiqə əvvəl`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} saat əvvəl`
  const days = Math.round(hours / 24)
  if (days < 30) return `${days} gün əvvəl`
  const months = Math.round(days / 30)
  if (months < 12) return `${months} ay əvvəl`
  return `${Math.round(months / 12)} il əvvəl`
}

export function initials(fullName: string | null, fallback: string): string {
  const source = fullName?.trim() || fallback
  return source.slice(0, 2).toUpperCase()
}