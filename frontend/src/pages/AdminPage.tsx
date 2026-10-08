import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Badge, Card, CardHeader, PageLoader, SectionTitle, StatCard } from '../components/ui'
import { advanceReportStatus, fetchAdoptions, fetchHealth, fetchListings, fetchReports } from '../lib/api'
import { ApiError } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { formatRelative } from '../lib/format'
import type { ReportDto, ReportStatus } from '../lib/types'

const STAFF_ROLES = ['ADMIN', 'MODERATOR', 'SHELTER_STAFF']

const NEXT_STATUS: Record<ReportStatus, ReportStatus | null> = {
  REPORTED: 'VERIFIED',
  VERIFIED: 'VOLUNTEER_ASSIGNED',
  VOLUNTEER_ASSIGNED: 'VET_CARE',
  VET_CARE: 'RESOLVED',
  RESOLVED: null,
}

export default function AdminPage() {
  const { user } = useAuth()
  const [health, setHealth] = useState<{ status: string } | null>(null)
  const [counts, setCounts] = useState<{ listings: number; adoptions: number; reports: number } | null>(null)
  const [reports, setReports] = useState<ReportDto[] | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    fetchHealth().then((h) => active && setHealth(h)).catch(() => active && setHealth({ status: 'offline' }))
    Promise.all([
      fetchListings({ status: 'ACTIVE' }),
      fetchAdoptions(),
      fetchReports(),
    ])
      .then(([listings, adoptions, reportList]) => {
        if (!active) return
        setCounts({ listings: listings.length, adoptions: adoptions.length, reports: reportList.length })
        setReports(reportList)
      })
      .catch(() => active && setCounts({ listings: 0, adoptions: 0, reports: 0 }))
    return () => {
      active = false
    }
  }, [])

  if (!user) return null
  if (!STAFF_ROLES.includes(user.role)) {
    return (
      <div className="mx-auto max-w-xl animate-fade-in">
        <SectionTitle kicker="İdarəetmə" title="Giriş məhdudiyyətli" />
        <Alert tone="error" title="Hüquq yoxdur">
          Bu bölmə yalnız moderator, sığınacaq əməkdaşı və ya administratorlar üçün açıqdır.
          <Link to="/profile" className="link-underline mt-2 block font-extrabold text-brand-700 hover:text-ink">
            Profilə qayıt →
          </Link>
        </Alert>
      </div>
    )
  }

  const canAdvanceFront = user.role === 'ADMIN' || user.role === 'MODERATOR'

  async function advance(report: ReportDto) {
    setBusyId(report.id)
    setActionError(null)
    const status = NEXT_STATUS[report.status]
    if (!status) {
      setBusyId(null)
      return
    }
    try {
      const updated = await advanceReportStatus(report.id, status)
      setReports((items) => (items ?? []).map((item) => (item.id === updated.id ? updated : item)))
    } catch (cause) {
      setActionError(cause instanceof ApiError ? cause.message : 'Status dəyişdirilə bilmədi.')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="animate-fade-in">
      <SectionTitle
        kicker="İdarəetmə paneli"
        title="Sistem vəziyyəti"
        description="Backend, məlumat həcmi və son bildirişlər — status keçidləri rol hüquqları ilə məhdudlaşır."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Backend"
          value={health?.status ?? 'Yüklənir…'}
          hint={health?.status === 'UP' ? 'canlı və sağlam' : 'qovulmuş / xəta'}
          tone={health?.status === 'UP' ? 'emerald' : 'rose'}
        />
        <StatCard label="Aktiv elanlar" value={counts?.listings ?? '…'} hint="itkin & tapılmış" tone="brand" />
        <StatCard label="Övladlığa · profillər" value={counts?.adoptions ?? '…'} hint="sahibini gözləyir" tone="emerald" />
        <StatCard label="Bildirişlər · ümumi" value={counts?.reports ?? '…'} hint="küçə heyvanları" tone="amber" />
      </div>

      <div className="mt-8">
        <Card>
          <CardHeader
            title="Son bildirişlər"
            subtitle={
              canAdvanceFront
                ? 'Növbəti pilləyə keçirmək üçün düyməni basın — ardıcıllıq məcbiridir.'
                : 'Panelə baxış rejimindəsiniz — keçid düymələri yalnız moderator/admin üçündür.'
            }
          />
          {actionError && <div className="px-5 pt-4"><Alert tone="error">{actionError}</Alert></div>}
          <div className="divide-y divide-ink/8">
            {reports === null && (
              <div className="p-8">
                <PageLoader label="Bildirişlər yüklənir…" />
              </div>
            )}
            {(reports ?? []).map((report) => {
              const stuck = report.status === 'RESOLVED'
              const allowed = !stuck && canAdvanceFront
              return (
                <div key={report.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-600/10 text-xs font-extrabold text-brand-700">
                    #{report.id}
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link to={`/track/${report.id}`} className="display text-base text-ink hover:underline">
                      {report.title}
                    </Link>
                    <p className="mt-0.5 truncate text-xs font-semibold text-ink/50">
                      {report.district} · {(report.reporter.fullName || report.reporter.username)} ·{' '}
                      {formatRelative(report.createdAt)}
                    </p>
                  </div>
                  <Badge
                    className={
                      report.status === 'RESOLVED'
                        ? 'bg-ink text-white ring-ink/20'
                        : 'bg-sun-400/40 text-ink ring-sun-500/40'
                    }
                  >
                    {report.status}
                  </Badge>
                  <button
                    type="button"
                    disabled={!allowed || busyId === report.id}
                    onClick={() => void advance(report)}
                    className="pop-stick inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-sea-600 px-4 py-1.5 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {busyId === report.id ? 'İşlənir…' : stuck ? 'Bağlanıb' : 'Növbəti →'}
                  </button>
                  {!canAdvanceFront && !stuck && (
                    <span className="text-[11px] font-bold text-ink/40">Yalnız moderator/admin keçirə bilər</span>
                  )}
                </div>
              )
            })}
            {reports !== null && reports.length === 0 && (
              <div className="p-8 text-center text-sm font-medium text-ink/50">Hazırda bildiriş yoxdur.</div>
            )}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink/50">Status axını</p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-ink/65">
            REPORTED → VERIFIED → VOLUNTEER_ASSIGNED → VET_CARE → RESOLVED. Hər keçid rol səlahiyyətinə
            bağlıdır və hadisə jurnalına yazılır.
          </p>
        </div>
        <div className="card p-6">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-ink/50">Sizin rol</p>
          <p className="mt-2 text-sm font-medium leading-relaxed text-ink/65">
            {user.fullName || user.username} · <strong>{user.role}</strong> — bu sessiyada icazəli
            keçidlərlə məhdudlaşır.
          </p>
        </div>
      </div>
    </div>
  )
}