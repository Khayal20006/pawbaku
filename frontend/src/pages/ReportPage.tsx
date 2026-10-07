import { Link } from 'react-router-dom'
import { SectionTitle } from '../components/ui'

const STEPS = [
  { title: 'Qeyd edin', text: 'Şəkil + xəritədə yer + vəziyyət (zədə/açlıq).' },
  { title: 'Doğrulanır', text: 'Moderator təsdiqləyir, təcili hal bölünür.' },
  { title: 'Könüllü götürdü', text: 'Yaxınlıqdakı könüllüyə dərhal bildiriş.' },
  { title: 'Baytar → Həll', text: 'Müalicə, qidalanma və ya ev tapılır — izlənilir.' },
]

export default function ReportPage() {
  return (
    <div className="animate-fade-in">
      <SectionTitle
        kicker="Küçə heyvanına kömək"
        title="Kömək edin"
        description="Zədəli və ya yeməyə ehtiyacı olan heyvanı xəritədə qeyd edin. Status axını ilə hər addım görünür — təsdiq → könüllü → baytar → həll."
      />

      <div className="card p-7 sm:p-10">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">
          Biznes axını
        </p>
        <div className="mt-6 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <div key={step.title} className="bg-paper p-6">
              <span className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-700">
                S0{index + 1}
              </span>
              <h3 className="display mt-3 text-lg text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-ink/10 bg-parchment px-6 py-5">
          <p className="max-w-lg text-sm leading-relaxed text-ink/65">
            Bu modul Pillə 3-də backend-ə qoşulur: report CRUD, status keçid yoxlaması və
            Telegram bildiriş outbox-ı artıq spesifikasiyadadır.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-parchment transition hover:bg-brand-700"
          >
            Köməyə başla
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}