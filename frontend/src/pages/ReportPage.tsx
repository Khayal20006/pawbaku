import { Kicker, LinkButton, SectionTitle } from '../components/ui'
import { PawBadge } from '../lib/paw'
import { PawGlyph } from './HomePage'

const STEPS = [
  { title: 'Qeyd edin', text: 'Şəkil + xəritədə yer + vəziyyət (zədə/açlıq).', tint: 'bg-brand-50', ring: 'bg-brand-600', tone: 'live' },
  { title: 'Doğrulanır', text: 'Moderator təsdiqləyir, təcili hal bölünür.', tint: 'bg-sea-50', ring: 'bg-sea-500', tone: 'done' },
  { title: 'Könüllü yolda', text: 'Yaxınlıqdakı könüllüyə dərhal bildiriş.', tint: 'bg-sun-50', ring: 'bg-sun-500', tone: 'done' },
  { title: 'Baytar → Həll', text: 'Müalicə, qidalanma və ya ev tapılır — izlənilir.', tint: 'bg-violet-50', ring: 'bg-violet-600', tone: 'next' },
] as const

const TIMELINE: { label: string; status: 'REPORTED' | 'VERIFIED' | 'VOLUNTEER_ASSIGNED' | 'VET_CARE' | 'RESOLVED' }[] = [
  { label: 'Şəkil + yer qeyd olundu', status: 'REPORTED' },
  { label: 'Moderator təsdiqlədi', status: 'VERIFIED' },
  { label: 'Könüllü yola çıxdı', status: 'VOLUNTEER_ASSIGNED' },
  { label: 'Baytar qəbulu bitəndə', status: 'VET_CARE' },
  { label: 'Axın bağlanır', status: 'RESOLVED' },
]

export default function ReportPage() {
  return (
    <div className="animate-fade-in">
      <SectionTitle
        kicker="Küçə heyvanına kömək"
        title="Kömək edin"
        description="Zədəli və ya yeməyə ehtiyacı olan heyvanı xəritədə qeyd edin. Status axını ilə hər addım görünür — təsdiq → könüllü → baytar → həll."
        action={
          <LinkButton to="/register" size="lg" className="pop-stick">
            Köməyə başla
            <span aria-hidden>→</span>
          </LinkButton>
        }
      />

      <div className="mt-4 grid gap-5 lg:grid-cols-5">
        {/* steps */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-3">
          {STEPS.map((step, index) => (
            <div
              key={step.title}
              className={`relative overflow-hidden rounded-[2rem] border-2 border-ink p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-pop ${step.tint}`}
            >
              <span
                className={`flex size-11 items-center justify-center rounded-full border-2 border-ink text-base font-extrabold text-white shadow-[0_0_0_5px_rgb(255_255_255/0.6)] ${step.ring} ${
                  step.tone === 'live' ? 'animate-wiggle' : ''
                }`}
              >
                {index + 1}
              </span>
              <h3 className="display mt-4 text-2xl text-ink">{step.title}</h3>
              <p className="card-rule mt-2 pb-3 text-sm font-medium leading-relaxed text-ink/60">{step.text}</p>
            </div>
          ))}
        </div>

        {/* demo tracked case */}
        <div className="overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-card lg:col-span-2">
          <span className="block h-2 bg-gradient-to-r from-brand-500 via-sun-400 to-sea-500" aria-hidden />
          <div className="flex flex-col p-6 lg:p-7">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-600">
              Demo hal · izlənən axın
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
                    <span
                      className={`text-sm font-semibold ${
                        index === 0 ? 'text-ink' : 'text-ink/55'
                      }`}
                    >
                      {step.label}
                    </span>
                    <PawBadge status={step.status} />
                  </div>
                </li>
              ))}
            </ol>

            <p className="mt-auto pt-2 text-xs font-medium leading-relaxed text-ink/50">
              Status keçidi yalnız məcburi ardıcıllıqla — söz hüququ olduğu rolun mötərizəsindədir.
            </p>
          </div>
        </div>
      </div>

      {/* urgent tone */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-[2rem] border-2 border-ink bg-rose-600 px-7 py-6 text-white shadow-card sm:px-9">
        <div className="flex items-start gap-4">
          <span className="inline-flex shrink-0 animate-wiggle items-center gap-1.5 rounded-full border-2 border-white bg-white/15 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white">
            <span className="size-1.5 rounded-full bg-white" />
            Təcili
          </span>
          <p className="max-w-xl text-sm font-semibold leading-relaxed text-white/90">
            Heyvanın həyatı üçün risk varsa <strong className="font-extrabold">təcili</strong> qeyd edin —
            sistem bildirişi əvvəlcədən müəyyən köhnə könüllüyə və yaxınlıqdakı baytara çatdırır.
          </p>
        </div>
        <Kicker className="shrink-0 inline-flex items-center gap-2 !text-white">
          <PawGlyph className="size-4" /> Pillə 3 · canlı ehtiyac
        </Kicker>
      </div>
    </div>
  )
}