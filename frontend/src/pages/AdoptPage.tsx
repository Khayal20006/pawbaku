import { Link } from 'react-router-dom'
import { Kicker, LinkButton, SectionTitle } from '../components/ui'

const FLOW = [
  { title: 'Profil', text: 'Sığınacaq heyvanın profilini paylaşır — şəkil, xarakter, sağlamlıq.' },
  { title: 'Ərizə', text: 'Maraqlı şəxs övladlığa götürmə ərizəsi verir.' },
  { title: 'Baxış + görüş', text: 'Sığınacaq nəzərdən keçirir, evə/yerə görüş təyin edir.' },
  { title: 'Nəticə', text: 'Təsdiq → ADOPTED, yaxud növbəti addım üçün qeyd.' },
]

const PREVIEWS = [
  {
    image: '/mock-1108099.jpg',
    name: 'Balaca sarı',
    text: 'Günəşdə çiçək içində tapılıb — sakit və ünsiyyətcil.',
    district: 'Nizami rayonu',
  },
  {
    image: '/hero-paw-2.jpg',
    name: 'Pəncə',
    text: 'Yağışda titrəyib, indi quru və sağlam. Qucaq sevir.',
    district: 'Sığınacaq №3',
  },
] as const

export default function AdoptPage() {
  return (
    <div className="animate-fade-in">
      <SectionTitle
        kicker="Övladlığa götürmə"
        title="Yeni ev, yeni dost"
        description="Şəffaf axın: profil → ərizə → baxış → görüş → nəticə. Hər mərhələ moderator doğrulaması ilə işləyir."
        action={
          <LinkButton to="/register" size="lg">
            Profilə keç
            <span aria-hidden>→</span>
          </LinkButton>
        }
      />

      <div className="mt-4 grid gap-5 lg:grid-cols-12">
        {/* preview cards */}
        <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
          {PREVIEWS.map((pet) => (
            <article
              key={pet.name}
              className="group overflow-hidden rounded-2xl bg-parchment shadow-card ring-1 ring-ink/10 transition duration-300 hover:-translate-y-1 hover:shadow-lift"
            >
              <div className="relative overflow-hidden">
                <img
                  src={pet.image}
                  alt={`${pet.name} — övladlığa götürmə`}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute left-3 top-3 rounded-full bg-paper/85 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-ink/70 backdrop-blur">
                  Sahibini gözləyir
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="display text-2xl text-ink">{pet.name}</h3>
                  <span className="text-xs text-ink/45">{pet.district}</span>
                </div>
                <p className="card-rule mt-3 pb-2 text-sm leading-relaxed text-ink/55">{pet.text}</p>
              </div>
            </article>
          ))}
        </div>

        {/* flow */}
        <div className="grid gap-px overflow-hidden rounded-2xl bg-ink/10 ring-1 ring-ink/10 sm:grid-cols-2 lg:col-span-5">
          {FLOW.map((step, index) => (
            <div key={step.title} className="relative bg-paper p-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-700">
                  0{index + 1}
                </span>
                <span
                  className={`size-2 rounded-full ${
                    index === 2 ? 'bg-emerald-500 shadow-[0_0_0_5px_rgb(16_185_129/0.15)]' : 'bg-ink/20'
                  }`}
                />
              </div>
              <h3 className="display mt-4 text-xl text-ink">{step.title}</h3>
              <p className="card-rule mt-2 pb-3 text-sm leading-relaxed text-ink/55">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* roadmap note */}
      <div className="relative mt-8 overflow-hidden rounded-2xl bg-ink px-8 py-10 text-white shadow-lift sm:px-12">
        <div className="absolute inset-0 dot-grid-light opacity-60" aria-hidden />
        <p className="pointer-events-none absolute bottom-0 right-4 select-none font-display text-[7rem] font-semibold leading-none text-white/[0.04]">
          ev
        </p>
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-lg">
            <Kicker className="text-brand-300">Milestone axınları</Kicker>
            <h3 className="display mt-2 text-3xl text-white sm:text-4xl">
              Sığınacaq profili və <em className="font-medium text-brand-300">foster şəbəkəsi</em>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">
              İlk versiyada yeniyetmə axın (profil → ərizə → görüş → nəticə) işləyir; sığınacaq
              paneli, baytar rəyi və müvəqqəti baxıcı modulu Milestone 2-də aktivləşir.
            </p>
          </div>
          <Link
            to="/report"
            className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
          >
            Kömək edin
          </Link>
        </div>
      </div>
    </div>
  )
}