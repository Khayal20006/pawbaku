import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Kicker, LinkButton, Reveal } from '../components/ui'

const TRACK = [
  { title: 'Qeyd edin', text: 'Heyvanı xəritədə qeyd edin — şəkil, yer, vəziyyət.', tone: 'done' },
  { title: 'Doğrulanır', text: 'Moderator elanı yoxlayır, ehtiyac təsdiqlənir.', tone: 'done' },
  { title: 'Könüllü yola çıxır', text: 'Yaxınlıqdakı könüllü bildiriş alır, yerə gedir.', tone: 'live' },
  { title: 'Həll', text: 'Baytar yardımı, ev, sağalma — son nəticə izlənilir.', tone: 'next' },
] as const

const MODULES: {
  no: string
  title: string
  text: string
  to: string
  soon?: boolean
}[] = [
  {
    no: '01',
    title: 'İtkin & Tapılmış',
    text: 'Elan, şəkil, xəritə. Sistem növ, rəng, məsafə və vaxta görə uyğunluq balı hesablayır, hər iki tərəfə bildiriş göndərir.',
    to: '/listings',
  },
  {
    no: '02',
    title: 'Övladlığa götürmə',
    text: 'Profil, ərizə, görüş, nəticə — sığınacaq və moderatorun doğrulaması ilə şəffaf axın.',
    to: '/adopt',
  },
  {
    no: '03',
    title: 'Küçə heyvanına kömək',
    text: 'Zədəli və ya ac heyvanı qeyd edin, statusu izləyin: təsdiq → könüllü → baytar → həll.',
    to: '/report',
  },
  {
    no: '04',
    title: 'Müvəqqəti baxıcı',
    text: 'Foster şəbəkəsi — evində müvəqqəti saxlayan könüllülər. Milestone 2.',
    to: '/report',
    soon: true,
  },
]

export default function HomePage() {
  const { user } = useAuth()

  return (
    <div className="space-y-28">
      {/* ------------------------------------------------------------------ hero */}
      <section className="relative -mx-4 overflow-hidden border-b border-ink/10 sm:-mx-6">
        <img
          src="/hero-baku.jpg"
          alt=""
          aria-hidden
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-paper via-paper/80 to-paper/10"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="max-w-2xl lg:col-span-6">
              <Reveal>
                <Kicker>PawBaku · Heyvan platforması</Kicker>
                <h1 className="display mt-4 text-[46px] leading-[1.02] text-ink sm:text-[72px]">
                  Küçədə gördüyünüz hər heyvan —{' '}
                  <em className="font-medium text-brand-600">diqqətə layiqdir</em>.
                </h1>
                <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink/75 sm:text-xl">
                  İtkin və ya tapılmış heyvanı qeyd edin, küçə heyvanına köməyi xəritədə başladın,
                  övladlığa götürməni şəffaf axınla tamamlayın. Sistem özü uyğunlaşdırır və bildirir.
                </p>
              </Reveal>

              <Reveal delay={120}>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  {user ? (
                    <>
                      <LinkButton to="/report" size="lg">
                        Kömək edin
                        <span aria-hidden>→</span>
                      </LinkButton>
                      <Link
                        to="/listings"
                        className="link-underline text-sm font-semibold text-brand-800 transition hover:text-ink"
                      >
                        Elanlara bax
                      </Link>
                    </>
                  ) : (
                    <>
                      <LinkButton to="/register" size="lg">
                        Pulsuz qoşulun
                        <span aria-hidden>→</span>
                      </LinkButton>
                      <Link
                        to="/listings"
                        className="link-underline text-sm font-semibold text-ink/75 transition hover:text-ink"
                      >
                        Elanlara bax
                      </Link>
                    </>
                  )}
                </div>
              </Reveal>
            </div>

            <Reveal delay={200} className="lg:col-span-6">
              <div className="relative mx-auto mt-12 max-w-xl lg:mt-0 lg:pl-10">
                <div className="pointer-events-none absolute -left-4 -top-10 hidden size-32 opacity-40 lg:block dot-grid" />
                <span className="pointer-events-none absolute -right-2 -top-7 select-none font-display text-[10rem] font-bold leading-none text-ink/[0.05] lg:text-[13rem]">
                  01
                </span>

                <figure className="relative overflow-hidden rounded-2xl shadow-card ring-1 ring-ink/15">
                  <img
                    src="/hero-paw.jpg"
                    alt="PawBaku — kömək gözləyən it"
                    loading="eager"
                    fetchPriority="high"
                    className="aspect-[4/3] w-full object-cover"
                  />
                </figure>

                <img
                  src="/hero-paw-2.jpg"
                  alt="PawBaku — kiçik sahibini gözləyən bala"
                  loading="lazy"
                  className="float-soft absolute -bottom-8 -left-5 w-36 rounded-xl object-cover ring-2 ring-paper shadow-card sm:-left-10 sm:w-52"
                />

                <div className="absolute -top-5 right-3 inline-flex items-center gap-1.5 rounded-full bg-ink/90 px-3.5 py-2 text-[11px] font-semibold text-white shadow-card backdrop-blur sm:-right-4">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                    <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
                  </span>
                  Canlı · elanlar
                </div>

                <div className="absolute -bottom-6 right-4 flex items-center gap-3 rounded-xl bg-paper/90 px-4 py-3 shadow-card ring-1 ring-ink/10 backdrop-blur sm:right-8">
                  <span className="text-[10px] font-semibold uppercase leading-tight tracking-[0.16em] text-ink/50">
                    Uyğunlaşdırma
                    <br />
                    sistemi
                  </span>
                  <span className="display text-2xl font-semibold tabular-nums text-brand-700">
                    bal
                  </span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- how it works */}
      <Reveal>
        <section className="relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker>Bir xilasın yolu</Kicker>
              <h2 className="display mt-2 text-4xl text-ink sm:text-5xl">Axın izlənilir, kimsə çəkilmir</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink/55">
              Hər addım auditlə qeyd olunur — şikayət portalından köçürülmüş status keçid məntiqi ilə.
            </p>
          </div>

          <div className="mt-10 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {TRACK.map((stage, index) => (
              <div key={stage.title} className="group relative bg-paper p-7">
                <span className="display text-3xl font-semibold tabular-nums text-ink/15">
                  S0{index + 1}
                </span>
                <span
                  className={`mt-5 block size-2 rounded-full ${
                    stage.tone === 'live'
                      ? 'bg-emerald-500 shadow-[0_0_0_5px_rgb(16_185_129/0.15)]'
                      : 'bg-ink/20'
                  }`}
                />
                <h3 className="display mt-4 text-xl text-ink">{stage.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/55">{stage.text}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ------------------------------------------------------------- modules */}
      <section className="relative">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>Platformanın modulları</Kicker>
            <h2 className="display mt-2 text-4xl text-ink sm:text-5xl">Hər heyvan üçün bir yer</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-ink/55">
            İlk versiyada dörd istiqamət — hər biri müstəqil axını ilə. Milestone 2-də genişlənir.
          </p>
        </div>

        <div className="mt-10 grid gap-px bg-ink/10 sm:grid-cols-2">
          {MODULES.map((module, index) => (
            <Reveal key={module.title} delay={index * 80} className="bg-paper">
              <Link
                to={module.to}
                className="group relative block overflow-hidden p-8 transition-colors hover:bg-parchment"
              >
                <span className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-700">
                  {module.no}
                </span>
                <h3 className="display mt-4 text-2xl text-ink transition group-hover:text-brand-800">
                  {module.title}
                  {module.soon && (
                    <span className="ml-2 align-middle rounded-full bg-ink/5 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">
                      Milestone 2
                    </span>
                  )}
                </h3>
                <p className="card-rule mt-4 pb-4 text-sm leading-relaxed text-ink/55">{module.text}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ CTA */}
      <Reveal>
        <section className="relative overflow-hidden rounded-2xl bg-ink px-8 py-16 text-white shadow-lift sm:px-14">
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-brand-600/30 blur-3xl" />
          <p className="pointer-events-none absolute bottom-0 right-6 select-none font-display text-[10rem] font-semibold leading-none text-white/[0.04]">
            paw
          </p>
          <div className="relative flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-xl">
              <Kicker className="text-brand-300">Başlamaq üçün</Kicker>
              <h2 className="display mt-3 text-4xl text-white sm:text-5xl">
                Heç bir heyvan görünmədən
                <br />
                <em className="font-medium text-brand-300">göz ardı edilməməlidir</em>
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Qeydiyyat bir dəqiqədən az çəkir — köməyi elə indi başla.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {!user && (
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-600 px-8 py-3 text-sm font-semibold text-white shadow-[0_16px_40px_-16px_rgb(0_0_0/0.5)] transition hover:bg-brand-700"
                >
                  Pulsuz qoşulun
                  <span aria-hidden>→</span>
                </Link>
              )}
              <Link
                to="/report"
                className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10"
              >
                Kömək edin
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}