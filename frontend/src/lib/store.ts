import type { FeedItem, ReportStatus } from './paw'

/**
 * localStorage-backed store so the "Kömək edin" flow works end-to-end
 * without backend wiring (backend Pill 3 will replace this).
 */

const KEY = 'pawbaku.reports'

export interface NewReportInput {
  title: string
  description: string
  district: string
}

export interface StoredReport extends FeedItem {
  id: string
}

/** The full report lifecycle, in order. Each step advances by its own actor. */
export const REPORT_FLOW: { status: ReportStatus; label: string; act: string; by: string }[] = [
  { status: 'REPORTED', label: 'Şəkil + yer qeyd olundu', act: 'Qeyd edildi', by: 'Bildirici (siz)' },
  { status: 'VERIFIED', label: 'Moderator təsdiqlədi', act: 'Doğrulanıb', by: 'Moderator' },
  { status: 'VOLUNTEER_ASSIGNED', label: 'Könüllü yola çıxdı', act: 'Könüllü yoldadır', by: 'Könüllü' },
  { status: 'VET_CARE', label: 'Baytar qəbulu bitəndə', act: 'Baytar qəbulu', by: 'Baytar' },
  { status: 'RESOLVED', label: 'Axın bağlanır', act: 'Həll olundu', by: 'İdarə' },
]

/** Allowed transitions: REPORTED → VERIFIED → VOLUNTEER_ASSIGNED → VET_CARE → RESOLVED. */
const NEXT: Record<ReportStatus, ReportStatus | null> = {
  REPORTED: 'VERIFIED',
  VERIFIED: 'VOLUNTEER_ASSIGNED',
  VOLUNTEER_ASSIGNED: 'VET_CARE',
  VET_CARE: 'RESOLVED',
  RESOLVED: null,
}

function isStoredReport(value: unknown): value is StoredReport {
  if (!value || typeof value !== 'object') return false
  const item = value as StoredReport
  return (
    typeof item.id === 'string' &&
    item.id.length > 0 &&
    typeof item.title === 'string' &&
    typeof item.district === 'string' &&
    typeof item.description === 'string' &&
    typeof item.time === 'string' &&
    typeof item.avatar === 'string'
  )
}

export function getStoredReports(): StoredReport[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isStoredReport)
  } catch {
    return []
  }
}

function persist(reports: StoredReport[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(reports))
  } catch {
    // Storage full or unavailable — updates stay visible for this session only.
  }
}

export function getReport(id: string): StoredReport | null {
  return getStoredReports().find((item) => item.id === id) ?? null
}

export function addReport(input: NewReportInput): StoredReport[] {
  const report: StoredReport = {
    id: `rep-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    title: input.title,
    description: input.description,
    status: 'REPORTED',
    district: input.district,
    time: 'indi',
    avatar: 'S',
  }
  const next = [report, ...getStoredReports()].slice(0, 12)
  persist(next)
  return next
}

/** Advance a report to its next lifecycle step. Returns the updated report. */
export function advanceReport(id: string): StoredReport | null {
  const reports = getStoredReports()
  const index = reports.findIndex((item) => item.id === id)
  if (index === -1) return null
  const nextStatus = NEXT[reports[index].status]
  if (!nextStatus) return reports[index]
  const updated: StoredReport = { ...reports[index], status: nextStatus }
  const next = [...reports]
  next[index] = updated
  persist(next)
  return updated
}

/** Return a report to its first step so the demo can be replayed. */
export function resetReport(id: string): StoredReport | null {
  const reports = getStoredReports()
  const index = reports.findIndex((item) => item.id === id)
  if (index === -1) return null
  const updated: StoredReport = { ...reports[index], status: 'REPORTED', time: 'indi' }
  const next = [...reports]
  next[index] = updated
  persist(next)
  return updated
}

/** Stored (newest) reports win; dedupe by content against the demo feed. */
export function mergeFeed(base: FeedItem[], local: StoredReport[]): FeedItem[] {
  const seen = new Set<string>()
  const merged: FeedItem[] = []
  for (const item of [...local, ...base]) {
    const key = `${item.title}|${item.district}|${item.description}`
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(item)
  }
  return merged
}