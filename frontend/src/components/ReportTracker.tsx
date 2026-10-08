import { useEffect, useState } from 'react'
import { PawBadge, PawGlyph } from '../lib/paw'
import { advanceReport, getReport, REPORT_FLOW, resetReport } from '../lib/store'
import type { StoredReport } from '../lib/store'

/**
 * Interactive tracker for a stored street-animal report. Lets the demo user
 * replay the whole lifecycle: REPORTED → VERIFIED → VOLUNTEER_ASSIGNED →
 * VET_CARE → RESOLVED, advancing each step as its responsible role.
 */
export default function ReportTracker({ reportId }: { reportId: string }) {
  const [report, setReport] = useState<StoredReport | null>(() => getReport(reportId))

  useEffect(() => {
    setReport(getReport(reportId))
  }, [reportId])

  if (!report) return null

  const currentIndex = REPORT_FLOW.findIndex((step) => step.status === report.status)
  const finished = report.status === 'RESOLVED'

  function handleNext() {
    setReport(advanceReport(reportId))
  }

  function handleReset() {
    setReport(resetReport(reportId))
  }

  const nextStep = REPORT_FLOW[currentIndex + 1]

  return (
    <div className="flex flex-col">
      <div className="mt-5 flex items-center gap-3">
        <span className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-brand-600 text-base font-extrabold text-white shadow-pop">
          {report.avatar}
        </span>
        <div>
          <p className="display text-xl leading-tight text-ink">{report.title}</p>
          <p className="text-xs font-bold text-ink/50">
            {report.district} · {report.time}
          </p>
        </div>
        <span className="ml-auto">
          <PawBadge status={report.status} />
        </span>
      </div>

      <p className="mt-4 rounded-2xl bg-paper px-4 py-3 text-sm font-medium leading-relaxed text-ink/70">
        {report.description}
      </p>

      <ol className="mt-6 space-y-1">
        {REPORT_FLOW.map((step, index) => {
          const reached = index <= currentIndex
          const active = index === currentIndex && !finished
          return (
            <li key={step.status} className="relative flex gap-4 pb-4">
              {index < REPORT_FLOW.length - 1 && (
                <span
                  className={`absolute left-[9px] top-5 h-full border-l-2 border-dashed ${
                    index < currentIndex ? 'border-sea-500' : 'border-brand-200'
                  }`}
                  aria-hidden
                />
              )}
              <span
                className={`relative mt-1.5 flex size-5 shrink-0 items-center justify-center rounded-full border-[3px] text-[9px] font-extrabold ${
                  reached
                    ? 'border-ink bg-white text-ink'
                    : 'border-ink/20 bg-white text-transparent'
                } ${active ? 'shadow-[0_0_0_5px_rgb(255_111_35/0.15)]' : ''}`}
              >
                {reached && <span className="size-2 rounded-full bg-brand-500" />}
              </span>
              <div className="flex flex-1 flex-wrap items-center justify-between gap-x-2 gap-y-1">
                <div>
                  <p className={`text-sm font-semibold ${reached ? 'text-ink' : 'text-ink/40'}`}>
                    {step.label}
                  </p>
                  <p className="text-[11px] font-bold text-ink/40">{step.by}</p>
                </div>
                <PawBadge status={step.status} />
              </div>
            </li>
          )
        })}
      </ol>

      <div className="mt-2">
        {finished ? (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-sea-500 bg-sea-50 px-4 py-3">
            <svg viewBox="0 0 24 24" className="size-5 text-sea-600" fill="none" stroke="currentColor" strokeWidth="2.6">
              <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="flex-1 text-sm font-extrabold text-sea-800">Axın tamamlandı — həll olundu.</p>
            <button
              type="button"
              onClick={handleReset}
              className="rounded-full border-2 border-ink bg-white px-4 py-1.5 text-xs font-extrabold text-ink transition hover:bg-sun-100"
            >
              Yenidən başlat
            </button>
          </div>
        ) : nextStep ? (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-paper px-4 py-3">
            <div className="flex-1">
              <p className="text-[11px] font-extrabold uppercase tracking-wider text-ink/45">Növbəti addım</p>
              <p className="text-sm font-extrabold text-ink">
                {nextStep.by}: {nextStep.act}
              </p>
            </div>
            <button
              type="button"
              onClick={handleNext}
              className="pop-stick inline-flex items-center gap-2 rounded-full border-2 border-ink bg-brand-600 px-5 py-2 text-sm font-extrabold text-white"
            >
              <PawGlyph className="size-4" />
              İrəli apar
              <span aria-hidden>→</span>
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}