import { Kicker, LinkButton, SectionTitle } from '../components/ui'
import { PawBadge } from '../lib/paw'

const STEPS = [
  { title: 'Qeyd edin', text: 'Şəkil + xəritədə yer + vəziyyət (zədə/açlıq).', tone: 'live' },
  { title: 'Doğrulanır', text: 'Moderator təsdiqləyir, təcili hal bölünür.', tone: 'done' },
  { title: 'Könüllü götürdü', text: 'Yaxınlıqdakı könüllüyə dərhal bildiriş.', tone: 'done' },
  { title: 'Baytar → Həll', text: 'Müalicə, qidalanma və ya ev tapılır — izlənilir.', tone: 'next' },
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
          <LinkButton to="/register" size="lg">
            Köməyə başla
            <span aria-hidden>→</span>
          </LinkButton>
        }
      />

      <div className="mt-4 grid gap-5 lg:grid-cols-5">
        {/* steps */}
        <div className="grid gap-px overflow-hidden rounded-2xl bg-ink/10 ring-1 ring-ink/10 lg:col-span-3 lg:grid-cols-2">
          {STEPS.map((step, index) => (
            <div key={step.title} className="relative bg-paper p-7">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-700">
                  S0{index + 1}
                </span>
                <span
                  className={`size-2 rounded-full ${
                    step.tone === 'live'
                      ? 'bg-emerald-500 shadow-[0_0_0_5px_rgb(16_185_129/0.15)]'
                      : 'bg-ink/20'
                  }`}
                />
              </div>
              <h3 className="display mt-4 text-2xl text-ink">{step.title}</h3>
              <p className="card-rule mt-2 pb-3 text-sm leading-relaxed text-ink/55">{step.text}</p>
            </div>
          ))}
        </div>

        {/* demo tracked case */}
        <div className="card flex flex-col p-6 lg:col-span-2 lg:p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">
            Demo hal · izlənən axın
          </p>
          <div className="mt-5 flex items-center gap-3">
            <span className="flex size-11 items-center justify-center rounded-full bg-brand-700 font-display text-base font-semibold text-white">
              A
            </span>
            <div>
              <p className="display text-lg leading-tight text-ink">Zədəli it</p>
              <p className="text-xs text-ink/50">Binəqədi · 12 dəq əvvəl</p>
            </div>
          </div>

          <ol className="mt-6 space-y-1">
            {TIMELINE.map((step, index) => (
              <li key={step.label} className="relative flex gap-4 pb-4">
                {index < TIMELINE.length - 1 && (
                  <span
                    className="absolute left-[7px] top-4 h-full w-px bg-ink/10"
                    aria-hidden
                  />
                )}
                <span
                  className={`relative mt-1.5 size-3.5 shrink-0 rounded-full border-[3px] ${
                    index === 0 ? 'border-emerald-500 bg-parchment' : 'border-brand-200 bg-parchment'
                  }`}
                />
                <div className="flex flex-1 flex-wrap items-center justify-between gap-x-2 gap-y-1">
                  <span
                    className={`text-sm ${
                      index === 0 ? 'font-semibold text-ink' : 'text-ink/55'
                    }`}
                  >
                    {step.label}
                  </span>
                  <PawBadge status={step.status} />
                </div>
              </li>
            ))}
          </ol>

          <p className="mt-auto pt-2 text-xs leading-relaxed text-ink/50">
            Status keçidi yalnız məcburi ardıcıllıqla — söz hüququ olduğu rolun mötərizəsindədir.
          </p>
        </div>
      </div>

      {/* urgent tone */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-5 overflow-hidden rounded-2xl bg-rose-50 px-7 py-6 ring-1 ring-rose-200 sm:px-9">
        <div className="flex items-start gap-4">
          <span className="inline-flex shrink-0 animate-pulse items-center gap-1.5 rounded-full bg-rose-700 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white">
            <span className="size-1.5 rounded-full bg-white" />
            Təcili
          </span>
          <p className="max-w-xl text-sm leading-relaxed text-rose-900/80">
            Heyvanın həyatı üçün risk varsa <strong className="font-semibold">təcili</strong> qeyd edin —
            sistem bildirişi əvvəlcədən müəyyən qönçə könüllüyə və yaxınlıqdakı baytara çatdırır.
          </p>
        </div>
        <Kicker className="shrink-0 !text-rose-700">Pillə 3 · canlı ehtiyac</Kicker>
      </div>
    </div>
  )
}