import { Link } from 'react-router-dom'
import { SectionTitle } from '../components/ui'

const FLOW = [
  { title: 'Profil', text: 'Sığınacaq heyvanın profilini paylaşır.' },
  { title: 'Ərizə', text: 'Maraqlı şəxs övladlığa götürmə ərizəsi verir.' },
  { title: 'Baxış + görüş', text: 'Sığınacaq nəzərdən keçirir, görüş təyin edir.' },
  { title: 'Nəticə', text: 'Təsdiq → ADOPTED, yaxud növbəti addım.' },
]

export default function AdoptPage() {
  return (
    <div className="animate-fade-in">
      <SectionTitle
        kicker="Övladlığa götürmə"
        title="Yeni ev, yeni dost"
        description="Şəffaf axın: profil → ərizə → baxış → görüş → nəticə. Hər mərhələ moderator doğrulaması ilə işləyir."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="grid gap-px bg-ink/10 sm:grid-cols-2 lg:col-span-2">
          {FLOW.map((step, index) => (
            <div key={step.title} className="bg-paper p-6">
              <span className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-700">
                0{index + 1}
              </span>
              <h3 className="display mt-3 text-lg text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/55">{step.text}</p>
            </div>
          ))}
        </div>

        <div className="card flex flex-col gap-4 p-7">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/45">
            Pillə 1 statusu
          </p>
          <p className="text-sm leading-relaxed text-ink/60">
            Övladlığa götürmə modulu ilk versiyada azaldılmış formada işləyir: yeniyetmə axını
            (profil, ərizə, görüş, nəticə). Sığınacaq paneli və foster şəbəkəsi milestone 2-dədir.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-parchment transition hover:bg-brand-700"
          >
            Profilə keç
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}