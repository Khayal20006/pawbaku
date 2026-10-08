import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ImageUpload, Kicker, LinkButton, SectionTitle } from '../components/ui'
import ReportTracker from '../components/ReportTracker'
import { PawBadge, PawGlyph } from '../lib/paw'
import { BAKU_DISTRICTS } from '../lib/format'
import { ApiError, createReport } from '../lib/api'
import {
  advanceTrackerReport,
  resetTrackerReport,
  speciesToMarketCode,
  toTrackerReport,
  type TrackerReport,
} from '../lib/reports'
import { addReport, type NewReportInput } from '../lib/store'
import { useAuth } from '../context/AuthContext'

const TIMELINE: { label: string; status: 'REPORTED' | 'VERIFIED' | 'VOLUNTEER_ASSIGNED' | 'VET_CARE' | 'RESOLVED' }[] = [
  { label: 'Şəkil + yer qeyd olundu', status: 'REPORTED' },
  { label: 'Moderator təsdiqlədi', status: 'VERIFIED' },
  { label: 'Könüllü yola çıxdı', status: 'VOLUNTEER_ASSIGNED' },
  { label: 'Baytar qəbulu bitəndə', status: 'VET_CARE' },
  { label: 'Axın bağlanır', status: 'RESOLVED' },
]

const SPECIES = [
  { value: 'İt', label: 'İt' },
  { value: 'Pişik', label: 'Pişik' },
  { value: 'Digər', label: 'Digər' },
] as const

const MOODS = [
  { value: 'Zədəli', label: 'Zədəli', tint: 'border-brand-600 bg-brand-100' },
  { value: 'Ac', label: 'Ac', tint: 'border-sun-500 bg-sun-100' },
  { value: 'Təcili', label: 'Təcili', tint: 'border-rose-600 bg-rose-100' },
  { value: 'Digər', label: 'Digər', tint: 'border-sea-600 bg-sea-100' },
] as const

function chipClass(active: boolean, tint: string) {
  return active
    ? `rounded-full border-2 px-4 py-1.5 text-sm font-extrabold text-ink shadow-pop ${tint}`
    : 'rounded-full border-2 border-ink/15 bg-white px-4 py-1.5 text-sm font-bold text-ink/55 transition hover:border-ink/40 hover:text-ink'
}

export default function ReportPage() {
  const { user } = useAuth()
  const [species, setSpecies] = useState<(typeof SPECIES)[number]['value']>('İt')
  const [mood, setMood] = useState<(typeof MOODS)[number]['value']>('Zədəli')
  const [district, setDistrict] = useState(BAKU_DISTRICTS[0])
  const [description, setDescription] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<TrackerReport | null>(null)
  const [offline, setOffline] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [advancing, setAdvancing] = useState(false)
  const [advanceError, setAdvanceError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const text = description.trim()
    if (text.length < 5) {
      setError('Heyvanla bağlı az xəbər, yeri dəqiq göstərin.')
      return
    }
    if (!user) {
      setError('Bildiriş vermək üçün əvvəlcə hesabınıza daxil olun.')
      return
    }
    setError(null)
    setSubmitting(true)
    const input: NewReportInput = {
      title: mood === 'Digər' ? species : `${mood} ${species.toLowerCase()}`,
      description: text,
      district,
    }
    try {
      const created = await createReport({
        ...input,
        species: speciesToMarketCode(species),
        photoUrl: photoUrl ?? undefined,
      })
      setOffline(false)
      setDone(toTrackerReport(created))
      setPhotoUrl(null)
    } catch (cause) {
      // Only a genuine network failure (status 0) falls back to this browser's
      // offline store; a server rejection (validation, 403, …) is shown as-is.
      if (cause instanceof ApiError && cause.status !== 0) {
        setError(cause.message)
        return
      }
      setOffline(true)
      const created = addReport(input)
      setDone(toTrackerReport(created[0]))
    } finally {
      setSubmitting(false)
      setDescription('')
    }
  }

  async function handleAdvance() {
    if (!done) return
    setAdvancing(true)
    setAdvanceError(null)
    try {
      setDone(await advanceTrackerReport(done))
    } catch (cause) {
      setAdvanceError(cause instanceof ApiError ? cause.message : 'Addım tamamlanmadı, yenidən yoxlayın.')
    } finally {
      setAdvancing(false)
    }
  }

  function handleReset() {
    if (!done) return
    setDone((current) => {
      if (!current) return current
      return resetTrackerReport(current) ?? current
    })
  }

  if (done) {
    return (
      <div className="animate-fade-in">
        <SectionTitle
          kicker="Küçə heyvanına kömək"
          title="Qeyd alındı"
          description={
            offline
              ? 'Server hazırda əlçatmazdır — bildiriş yalnız bu brauzerdə saxlanıldı.'
              : 'Bildirişiniz canlı axına əlavə olundu. Status moderator təsdiqi ilə izləniləcək.'
          }
        />

        <div className="mx-auto max-w-xl overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-lift">
          <span className="block h-2 bg-gradient-to-r from-brand-500 via-sun-400 to-sea-500" aria-hidden />
          <div className="flex flex-col p-7 sm:p-9">
            <ReportTracker
              report={done}
              busy={advancing}
              advanceError={advanceError}
              onAdvance={handleAdvance}
              onReset={handleReset}
            />

            <div className="mt-6 flex flex-wrap gap-3">
              <LinkButton to="/listings" className="pop-stick">
                Elanlara bax
                <span aria-hidden>→</span>
              </LinkButton>
              <button
                type="button"
                onClick={() => setDone(null)}
                className="inline-flex items-center rounded-full border-2 border-ink bg-white px-6 py-2.5 text-sm font-extrabold text-ink transition hover:bg-sun-100"
              >
                Başqa bildiriş
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <SectionTitle
        kicker="Küçə heyvanına kömək"
        title="Kömək edin"
        description="Zədəli və ya yeməyə ehtiyacı olan heyvanı qeyd edin — bildirişiniz canlı axında görünür, ardından moderator doğrulaması davam edir."
      />

      <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-5">
        <div className="overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-card lg:col-span-3">
          <span className="block h-2 bg-gradient-to-r from-brand-500 via-sun-400 to-sea-500" aria-hidden />
          <div className="space-y-6 p-7 sm:p-8">
            <div>
              <span className="field-label">Heyvan</span>
              <div className="flex flex-wrap gap-2">
                {SPECIES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setSpecies(item.value)}
                    className={chipClass(species === item.value, 'border-brand-600 bg-brand-100')}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="field-label">Vəziyyət</span>
              <div className="flex flex-wrap gap-2">
                {MOODS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => setMood(item.value)}
                    className={chipClass(mood === item.value, item.tint)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <label className="block">
              <span className="field-label">Rayon</span>
              <select
                value={district}
                onChange={(event) => setDistrict(event.target.value)}
                className="field-input"
              >
                {BAKU_DISTRICTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="field-label">Nə olub? Yerini və halını yazın</span>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                required
                minLength={5}
                placeholder="Məs: bazarın arxa yolu, sağ arxa ayağından yaralı, insanlardan qorxur…"
                className="field-input resize-none"
              />
              <span className="field-hint">Ən azı 5 simvol — yer dəqiq olsa bildiriş daha tez həll olur.</span>
            </label>

            <div>
              <span className="field-label">Şəkil (əlverişli)</span>
              <ImageUpload value={photoUrl} onChange={setPhotoUrl} disabled={!user} />
              {!user && (
                <p className="mt-2 text-xs font-medium text-ink/50">
                  Şəkil üçün{' '}
                  <Link to="/login" className="link-underline font-extrabold text-brand-700 hover:text-ink">
                    daxil olun
                  </Link>
                  .
                </p>
              )}
            </div>

            {error && (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 ring-1 ring-rose-200" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="pop-stick inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-brand-600 px-7 py-3.5 text-[15px] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              <PawGlyph className="size-5" /> {submitting ? 'Göndərilir…' : 'Bildirişi göndər'}
              {!submitting && <span aria-hidden>→</span>}
            </button>
          </div>
        </div>

        <div className="space-y-5 lg:col-span-2">
          {/* demo tracked case */}
          <div className="overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-card">
            <span className="block h-2 bg-gradient-to-r from-brand-500 via-sun-400 to-sea-500" aria-hidden />
            <div className="flex flex-col p-6 lg:p-7">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-600">
                Axın necə işləyir
              </p>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-brand-600 text-base font-extrabold text-white shadow-pop">
                  A
                </span>
                <div>
                  <p className="display text-lg leading-tight text-ink">Zədəli it</p>
                  <p className="text-xs font-bold text-ink/50">Binəqədi · 12 dəq əvvəl</p>
                </div>
              </div>

              <ol className="mt-6 space-y-1">
                {TIMELINE.map((step, index) => (
                  <li key={step.label} className="relative flex gap-4 pb-4">
                    {index < TIMELINE.length - 1 && (
                      <span className="absolute left-[7px] top-4 h-full border-l-2 border-dashed border-brand-200" aria-hidden />
                    )}
                    <span
                      className={`relative mt-2 size-3.5 shrink-0 rounded-full border-[3px] border-white shadow ${
                        index === 0 ? 'bg-brand-500' : 'bg-sun-300'
                      }`}
                    />
                    <div className="flex flex-1 flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <span className={`text-sm font-semibold ${index === 0 ? 'text-ink' : 'text-ink/55'}`}>
                        {step.label}
                      </span>
                      <PawBadge status={step.status} />
                    </div>
                  </li>
                ))}
              </ol>

              <p className="mt-auto pt-2 text-xs font-medium leading-relaxed text-ink/50">
                Hər status keçidini yalnız buna hüququ olan rol edə bilər — ardıcıllıq məcburidir.
              </p>
            </div>
          </div>

          {/* urgent tone */}
          <div className="overflow-hidden rounded-[2rem] border-2 border-ink bg-rose-600 px-6 py-5 text-white shadow-card">
            <div className="flex items-start gap-3">
              <span className="inline-flex shrink-0 animate-wiggle items-center gap-1.5 rounded-full border-2 border-white bg-white/15 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white">
                <span className="size-1.5 rounded-full bg-white" /> Təcili
              </span>
              <p className="text-sm font-semibold leading-relaxed text-white/90">
                Heyvanın həyatı üçün risk varsa <strong className="font-extrabold">Təcili</strong>{' '}
                seçin — növbəti pillədə bildiriş yaxınlıqdakı baytara düşəcək.
              </p>
            </div>
          </div>

          <div className="rounded-[2rem] border-2 border-dashed border-ink/25 bg-white px-6 py-5">
            <Kicker>İndi aktiv</Kicker>
            <p className="mt-2 text-sm font-medium leading-relaxed text-ink/55">
              Bildiriş canlı axınla sinxronlaşır, şəkil yüklənir; qoşulma mümkün olmasa,
              bu brauzerdə yadda qalır.
            </p>
            <Link
              to="/listings"
              className="link-underline mt-3 inline-block text-sm font-extrabold text-brand-700 hover:text-ink"
            >
              Elanlara bax →
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}