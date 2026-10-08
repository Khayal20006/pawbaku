import type { AnimalSpecies, ReportDto, ReportStatus } from './types'
import { advanceReportStatus, fetchReport } from './api'
import { formatRelative } from './format'
import {
  advanceReport as advanceLocalReport,
  getReport as getLocalReport,
  REPORT_FLOW,
  resetReport as resetLocalReport,
  type StoredReport,
} from './store'

/**
 * Tracker adapter that hides the storage backend (localStorage offline vs API)
 * behind one shape, so the tracker UI works for both local demo reports and
 * server-persisted reports.
 */
export interface TrackerReport {
  id: string
  title: string
  description: string
  status: ReportStatus
  district: string
  time: string
  avatar: string
  photo?: string | null
  address?: string | null
  events?: TrackerEvent[]
}

/** A single audit entry: who moved the report, from which to which status. */
export interface TrackerEvent {
  from: ReportStatus | null
  to: ReportStatus
  actor: string | null
  note: string | null
  createdAt: string
}

export const isLocalReport = (id: string): boolean => id.startsWith('rep-')

export function toTrackerReport(report: StoredReport | ReportDto): TrackerReport {
  if (typeof report.id === 'string') {
    const stored = report as StoredReport
    return {
      id: stored.id,
      title: stored.title,
      description: stored.description,
      status: stored.status,
      district: stored.district,
      time: stored.time,
      avatar: stored.avatar,
    }
  }
  const dto = report as ReportDto
  return {
    id: String(dto.id),
    title: dto.title,
    description: dto.description,
    status: dto.status,
    district: dto.district,
    time: formatRelative(dto.createdAt),
    avatar: (dto.reporter.fullName?.trim() || dto.reporter.username).slice(0, 1).toUpperCase() || 'S',
    photo: dto.photoUrl,
    address: dto.address,
    events: (dto.events ?? []).map((event) => ({
      from: event.fromStatus,
      to: event.toStatus,
      actor: event.actor,
      note: event.note,
      createdAt: event.createdAt,
    })),
  }
}

export async function loadTrackerReport(id: string): Promise<TrackerReport | null> {
  if (isLocalReport(id)) {
    const stored = getLocalReport(id)
    return stored ? toTrackerReport(stored) : null
  }
  try {
    return toTrackerReport(await fetchReport(id))
  } catch {
    return null
  }
}

export async function advanceTrackerReport(report: TrackerReport): Promise<TrackerReport> {
  if (isLocalReport(report.id)) {
    const updated = advanceLocalReport(report.id)
    if (!updated) throw new Error('Bildiriş tapılmadı.')
    return toTrackerReport(updated)
  }
  const index = REPORT_FLOW.findIndex((step) => step.status === report.status)
  const nextStatus = REPORT_FLOW[index + 1]?.status
  if (!nextStatus) throw new Error('Axın artıq tamamlanıb.')
  return toTrackerReport(await advanceReportStatus(report.id, nextStatus))
}

export function resetTrackerReport(report: TrackerReport): TrackerReport | null {
  if (!isLocalReport(report.id)) return null
  const updated = resetLocalReport(report.id)
  return updated ? toTrackerReport(updated) : null
}

export function speciesToMarketCode(species: 'İt' | 'Pişik' | 'Digər'): AnimalSpecies {
  if (species === 'İt') return 'DOG'
  if (species === 'Pişik') return 'CAT'
  return 'OTHER'
}