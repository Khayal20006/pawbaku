import { Link, useParams } from 'react-router-dom'
import ReportTracker from '../components/ReportTracker'
import { LinkButton, SectionTitle } from '../components/ui'
import { getReport } from '../lib/store'

export default function TrackPage() {
  const { id } = useParams<{ id: string }>()
  const report = id ? getReport(id) : null

  if (!report) {
    return (
      <div className="animate-fade-in text-center">
        <SectionTitle
          kicker="Canlı axın"
          title="Bildiriş tapılmadı"
          description="Bu bildiriş bu brauzerdə yoxdur — baş səhifədən yenidən yoxlayın və ya yeni bildiriş verin."
        />
        <LinkButton to="/report" className="pop-stick">
          Kömək edin
          <span aria-hidden>→</span>
        </LinkButton>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <SectionTitle
        kicker="Canlı axın"
        title="Bildirişin izi"
        description="Hər addım məcburi ardıcıllıqla və yalnız buna hüququ olan rol tərəfindən edilir."
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
          <ReportTracker reportId={report.id} />
        </div>
      </div>

      <p className="mx-auto mt-6 max-w-2xl text-center text-xs font-medium leading-relaxed text-ink/50">
        Bu demo axını brauzerdə (localStorage) saxlanılır. Backend Pill 3-də qoşulanda hər addım
        müvafiq rol tərəfindən, audit zaman damğası ilə ediləcək.
      </p>
    </div>
  )
}