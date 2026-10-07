import { Link } from 'react-router-dom'
import { LinkButton, SectionTitle } from '../components/ui'
import { PawGlyph } from './HomePage'

const FLOW = [
  { title: 'Profil', text: 'Sığınacaq heyvanın profilini paylaşır — şəkil, xarakter, sağlamlıq.', tint: 'bg-brand-50', ring: 'bg-brand-600' },
  { title: 'Ərizə', text: 'Maraqlı şəxs övladlığa götürmə ərizəsi verir.', tint: 'bg-sea-50', ring: 'bg-sea-500' },
  { title: 'Baxış + görüş', text: 'Sığınacaq nəzərdən keçirir, evə/yerə görüş təyin edir.', tint: 'bg-sun-50', ring: 'bg-sun-500' },
  { title: 'Nəticə', text: 'Təsdiq → ADOPTED, yaxud növbəti addım üçün qeyd.', tint: 'bg-violet-50', ring: 'bg-violet-600' },
] as const

const PREVIEWS = [
  {
    image: '/mock-1108099.jpg',
    name: 'Balaca sarı',
    text: 'Günəşdə çiçək içində tapılıb — sakit və ünsiyyətcil.',
    where: 'Nizami rayonu',
  },
  {
    image: '/hero-paw-2.jpg',
    name: 'Pəncə',
    text: 'Yağışda titrəyib, indi quru və sağlam. Qucaq sevir.',
    where: 'Sığınacaq №3',
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
          <LinkButton to="/register" size="lg" className="pop-stick">
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
              className="group overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-pop-lg"
            >
              <div className="relative overflow-hidden">
                <img
                  src={pet.image}
                  alt={`${pet.name} — övladlığa götürmə`}
                  loading="lazy"
                  className="aspect-[4/3] w-full bg-brand-100 object-cover transition duration-500 group-hover:scale-[1.05]"
                />
                <span className="pop-stick absolute left-3 top-3 rounded-full border-2 border-ink bg-sea-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                  Sahibini gözləyir
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="display text-2xl text-ink">{pet.name}</h3>
                  <span className="rounded-full bg-paper px-2.5 py-1 text-[11px] font-extrabold text-ink/55">
                    {pet.where}
                  </span>
                </div>
                <p className="card-rule mt-3 pb-2 text-sm font-medium leading-relaxed text-ink/55">{pet.text}</p>
              </div>
            </article>
          ))}
        </div>

        {/* flow */}
        <div className="grid gap-4 sm:grid-cols-2 lg:col-span-5">
          {FLOW.map((step, index) => (
            <div
              key={step.title}
              className={`relative rounded-[2rem] border-2 border-ink p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-pop ${step.tint}`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`flex size-10 items-center justify-center rounded-xl border-2 border-ink text-sm font-extrabold text-white ${step.ring}`}
                >
                  {index + 1}
                </span>
              </div>
              <h3 className="display mt-4 text-xl text-ink">{step.title}</h3>
              <p className="card-rule mt-2 pb-3 text-sm font-medium leading-relaxed text-ink/60">{step.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* roadmap note */}
      <section className="relative mt-8 overflow-hidden rounded-[2.5rem] border-2 border-ink bg-gradient-to-br from-sea-600 via-sea-700 to-sea-800 px-8 py-12 text-white shadow-lift sm:px-12">
        <span className="absolute inset-0 dot-grid-light opacity-60" aria-hidden />
        <span className="blob pointer-events-none absolute -right-16 -top-20 size-72 bg-brand-400/30" aria-hidden />
        <PawGlyph className="pointer-events-none absolute -left-4 -bottom-5 size-36 rotate-12 text-white/10" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-lg">
            <span className="inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-white">
              <PawGlyph className="size-4" /> Milestone axınları
            </span>
            <h3 className="display mt-4 text-3xl text-white sm:text-4xl">
              Sığınacaq profili və <span className="text-stroke-white">foster şəbəkəsi</span>
            </h3>
            <p className="mt-3 text-sm font-semibold leading-relaxed text-white/80">
              İlk versiyada yeniyetmə axın (profil → ərizə → görüş → nəticə) işləyir; sığınacaq
              paneli, baytar rəyi və müvəqqəti baxıcı modulu Milestone 2-də aktivləşir.
            </p>
          </div>
          <Link
            to="/report"
            className="pop-stick inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun-400 px-6 py-3 text-sm font-extrabold text-ink"
          >
            <PawGlyph className="size-4" /> Kömək edin
          </Link>
        </div>
      </section>
    </div>
  )
}