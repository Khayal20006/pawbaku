import type { FeedItem } from './paw'

/**
 * Tiny localStorage-backed store so the "Kömək edin" flow works end-to-end
 * without backend wiring (backend Pill 3 will replace this).
 */

const KEY = 'pawbaku.reports'

export interface NewReportInput {
  title: string
  description: string
  district: string
}

export function getStoredReports(): FeedItem[] {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is FeedItem =>
        !!item &&
        typeof item === 'object' &&
        typeof (item as FeedItem).title === 'string' &&
        typeof (item as FeedItem).district === 'string',
    )
  } catch {
    return []
  }
}

export function addReport(input: NewReportInput): FeedItem[] {
  const report: FeedItem = {
    title: input.title,
    description: input.description,
    status: 'REPORTED',
    district: input.district,
    time: 'indi',
    avatar: 'S',
  }
  const next = [report, ...getStoredReports()].slice(0, 12)
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // Storage full or unavailable — report stays visible for this session only.
  }
  return next
}

/** Stored (newest) reports win; dedupe by content against the demo feed. */
export function mergeFeed(base: FeedItem[], local: FeedItem[]): FeedItem[] {
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