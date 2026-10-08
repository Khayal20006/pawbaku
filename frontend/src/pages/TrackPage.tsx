import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ReportTracker from '../components/ReportTracker'
import { LinkButton, SectionTitle } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../lib/api'
import type { ReportStatus, Role } from '../lib/types'
import {
  advanceTrackerReport,
  isLocalReport,
  loadTrackerReport,
  resetTrackerReport,
  type TrackerReport,
} from '../lib/reports'

/** Who may take the NEXT step from the given report status. */
const NEXT_STEP_ROLES: Record<ReportStatus, Role[]> = {
  REPORTED: ['MODERATOR', 'ADMIN'],
  VERIFIED: ['VOLUNTEER', 'MODERATOR', 'ADMIN'],
  VOLUNTEER_ASSIGNED: ['VET', 'MODERATOR', 'ADMIN'],
  VET_CARE: ['VET', 'MODERATOR', 'ADMIN'],
  RESOLVED: [],
}

export default function TrackPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [report, setReport] = useState<TrackerReport | null>(null)
  const [loading, setLoading] = useState(true)
  const [advancing, setAdvancing] = useState(false)
  const [advanceError, setAdvanceError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    setReport(null)
    if (!id) {
      setLoading(false)
      return
    }
    loadTrackerReport(id).then((loaded) => {
      if (!active) return
      setReport(loaded)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [id])

  async function handleAdvance() {
    if (!report) return
    setAdvancing(true)
    setAdvanceError(null)
    try {
      setReport(await advanceTrackerReport(report))
    } catch (cause) {
      setAdvanceError(cause instanceof ApiError ? cause.message : 'Addım tamamlanmadı, yenidən yoxlayın.')
    } finally {
      setAdvancing(false)
    }
  }

  function handleReset() {
    if (!report) return
    setReport(resetTrackerReport(report) ?? report)
  }

  if (loading) {
    return (
      <div className="animate-fade-in text-center">
        <SectionTitle
          kicker="Canlı axın"
          title="Yüklənir…"
          description="Bildirişin izi getirilir — bir dəqiqə."
        />
      </div>
    )
  }

  if (!report) {
    return (
      <div className="animate-fade-in text-center">
        <SectionTitle
          kicker="Canlı axın"
          title="Bildiriş tapılmadı"
          description="Bu bildiriş mövcud deyil və ya bu brauzerdə saxlanılmayıb — baş səhifədən yenidən yoxlayın."
        />
        <LinkButton to="/report" className="pop-stick">
          Kömək edin
          <span aria-hidden>→</span>
        </LinkButton>
      </div>
    )
  }

  const canAdvance =
    isLocalReport(report.id) ||
    (!!user && report.status !== 'RESOLVED' && NEXT_STEP_ROLES[report.status].includes(user.role))

  return (
    <div className="animate-fade-in">
      <SectionTitle
        kicker="Canlı axın"
        title="Bildirişin izi"
        description="Hər addım məcburi ardıcıllıqla və yalnız buna hüququ olan rol tərəfindən, audit zaman damğası ilə edilir."
        action={
          <Link
            to="/report"
            className="rounded-full border-2 border-ink bg-white px-5 py-2 text-sm font-extrabold text-ink transition hover:bg-sun-100"
          >
            Yeni bildiriş
          </Link>
        }
      />

      <div className="mx-auto max-w-2xl overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-lift">
        <span className="block h-2 bg-gradient-to-r from-brand-500 via-sun-400 to-sea-500" aria-hidden />
        <div className="p-7 sm:p-9">
          <ReportTracker
            report={report}
            busy={advancing}
            advanceError={advanceError}
            canAdvance={canAdvance}
            onAdvance={handleAdvance}
            onReset={handleReset}
          />
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs font-medium leading-relaxed text-ink/50">
        Bildirişlər canlı axından gəlir; əlaqə yoxdur, bu brauzerdəki qeyd göstərilir.
        Hər status keçidini yalnız hüquqlu rol edə bilər.
      </p>
    </div>
  )
}