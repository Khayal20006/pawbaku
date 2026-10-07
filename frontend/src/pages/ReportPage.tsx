import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Kicker, LinkButton, SectionTitle } from '../components/ui'
import { PawBadge, PawGlyph } from '../lib/paw'
import { BAKU_DISTRICTS } from '../lib/format'
import { addReport, type NewReportInput } from '../lib/store'
import type { FeedItem } from '../lib/paw'

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
  const [species, setSpecies] = useState<(typeof SPECIES)[number]['value']>('İt')
  const [mood, setMood] = useState<(typeof MOODS)[number]['value']>('Zədəli')
  const [district, setDistrict] = useState(BAKU_DISTRICTS[0])
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<FeedItem | null>(null)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const text = description.trim()
    if (text.length < 5) {
      setError('Heyvanla bağlı az xəbər, yeri dəqiq göstərin.')
      return
    }
    setError(null)
    const input: NewReportInput = {
      title: mood === 'Digər' ? species : `${mood} ${species.toLowerCase()}`,
      description: text,
      district,
    }
    const created = addReport(input)
    setDone(created[0])
    setDescription('')
  }

  if (done) {
    return (
      <div className="animate-fade-in">
        <SectionTitle
          kicker="Küçə heyvanına kömək"
          title="Qeyd alındı"
          description="Bildirişiniz canlı axına əlavə olundu. Status moderator təsdiqi ilə izləniləcək."
        />

        <div className="mx-auto max-w-xl overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-lift">
          <span className="block h-2 bg-gradient-to-r from-brand-500 via-sun-400 to-sea-500" aria-hidden />
          <div className="flex flex-col p-7 sm:p-9">
            <span className="inline-flex size-14 items-center justify-center rounded-full border-2 border-ink bg-sea-500 text-white shadow-pop">
              <svg viewBox="0 0 24 24" className="size-7" fill="none" stroke="currentColor" strokeWidth="2.4">
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>

            <div className="mt-5 flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-full border-2 border-ink bg-brand-600 text-base font-extrabold text-white shadow-pop">
                S
              </span>
              <div>
                <p className="display text-xl leading-tight text-ink">{done.title}</p>
                <p className="text-xs font-bold text-ink/50">
                  {done.district} · {done.time}
                </p>
              </div>
            </div>

            <p className="mt-4 rounded-2xl bg-paper px-4 py-3 text-sm font-medium leading-relaxed text-ink/70">
              {done.description}
            </p>

            <p className="mt-5 flex items-center gap-2">
              <PawBadge status="REPORTED" />
              <span className="text-xs font-bold text-ink/45">indi izlənir</span>
            </p>

            <ol className="mt-5 space-y-1">
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
                  <span className={`text-sm font-semibold ${index === 0 ? 'text-ink' : 'text-ink/55'}`}>
                    {step.label}
                  </span>
                </li>
              ))}
            </ol>

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

            {error && (
              <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700 ring-1 ring-rose-200" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="pop-stick inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-brand-600 px-7 py-3.5 text-[15px] font-extrabold text-white"
            >
              <PawGlyph className="size-5" /> Bildirişi göndər
              <span aria-hidden>→</span>
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
            <Kicker>Növbəti pillə</Kicker>
            <p className="mt-2 text-sm font-medium leading-relaxed text-ink/55">
              Şəkil yükləmə və xəritədə dəqiq yer backend Pill 3-də formu backend-ə birləşdirərkən
              açılacaq — indi bildirişlər bu brauzerdə saxlanılır.
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