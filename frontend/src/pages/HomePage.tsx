import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Counter, Kicker, LinkButton, Reveal } from '../components/ui'
import { FEED, HERO_STATS, MARQUEE_ITEMS, PawBadge, renderMarquee } from '../lib/paw'

const TRACK = [
  { title: 'Qeyd edin', text: 'Heyvanı xəritədə qeyd edin — şəkil, yer, vəziyyət.', tone: 'done' },
  { title: 'Doğrulanır', text: 'Moderator elanı yoxlayır, ehtiyac təsdiqlənir.', tone: 'done' },
  { title: 'Könüllü yola çıxır', text: 'Yaxınlıqdakı könüllü bildiriş alır, yerə gedir.', tone: 'live' },
  { title: 'Həll', text: 'Baytar yardımı, ev, sağalma — son nəticə izlənilir.', tone: 'next' },
] as const

const MODULES: {
  no: string
  tag: string
  title: string
  text: string
  to: string
  stat: string
  soon?: boolean
}[] = [
  {
    no: '01',
    tag: 'Elan + Matcher',
    title: 'İtkin & Tapılmış',
    text: 'Elan, şəkil, xəritə. Sistem növ, rəng, məsafə və vaxta görə uyğunluq balı hesablayır, hər iki tərəfə bildiriş göndərir.',
    to: '/listings',
    stat: '4 aktiv elan',
  },
  {
    no: '02',
    tag: 'Axın',
    title: 'Övladlığa götürmə',
    text: 'Profil, ərizə, görüş, nəticə — sığınacaq və moderatorun doğrulaması ilə şəffaf axın.',
    to: '/adopt',
    stat: '3 səpələnmiş bala',
  },
  {
    no: '03',
    tag: 'Kömək',
    title: 'Küçə heyvanına kömək',
    text: 'Zədəli və ya ac heyvanı qeyd edin, statusu izləyin: təsdiq → könüllü → baytar → həll.',
    to: '/report',
    stat: 'Canlı qeydlər',
  },
  {
    no: '04',
    tag: 'Milestone 2',
    title: 'Müvəqqəti baxıcı',
    text: 'Foster şəbəkəsi — evində müvəqqəti saxlayan könüllülər. Milestone 2.',
    to: '/report',
    stat: 'Gəlmək üzrə',
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
          className="absolute inset-0 bg-gradient-to-r from-paper via-paper/85 to-paper/10"
          aria-hidden
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-4 pb-10 pt-16 sm:px-6 sm:pb-12 sm:pt-24">
          <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-12">
            <div className="max-w-2xl lg:col-span-6">
              <Reveal>
                <Kicker>PawBaku · Heyvan platforması</Kicker>
                <h1 className="display mt-4 text-[44px] leading-[1.02] text-ink sm:text-[72px]">
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
              <div className="relative mx-auto mt-14 max-w-xl lg:mt-0 lg:pl-10">
                <div className="pointer-events-none absolute -left-4 -top-12 hidden size-36 opacity-40 lg:block dot-grid" />
                <span className="pointer-events-none absolute -right-4 -top-9 select-none font-display text-[9rem] font-bold leading-none text-ink/[0.05] lg:text-[12rem]">
                  PB
                </span>

                <figure className="relative overflow-hidden rounded-2xl shadow-card ring-1 ring-ink/15">
                  <img
                    src="/hero-paw.jpg"
                    alt="PawBaku — kömək gözləyən korgi"
                    loading="eager"
                    fetchPriority="high"
                    className="aspect-[4/3] w-full object-cover"
                  />
                  <figcaption className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-lg bg-paper/85 px-3 py-2 backdrop-blur">
                    <span className="text-[11px] font-semibold tracking-wide text-ink/70">
                      Xətai · 'Reks' — tapıldı
                    </span>
                    <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Uyğunluq 87
                    </span>
                  </figcaption>
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
                    <Counter to={90} /> bal
                  </span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* --------------------------------------------------------------- stats */}
          <Reveal delay={80}>
            <dl className="mt-16 grid gap-px overflow-hidden rounded-xl bg-ink/10 ring-1 ring-ink/10 sm:grid-cols-3">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="bg-paper/85 px-6 py-5 backdrop-blur">
                  <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-ink/45">
                    {stat.label}
                  </dt>
                  <dd className="mt-1 display text-4xl font-semibold tabular-nums text-ink">
                    <Counter to={stat.value} />
                    {stat.suffix}
                  </dd>
                  <dd className="mt-1 text-xs leading-relaxed text-ink/50">{stat.hint}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------------- marquee */}
      <div className="group -mx-4 overflow-hidden border-y border-ink/10 bg-parchment py-4 sm:-mx-6" aria-hidden>
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          <div className="flex w-max items-center">{renderMarquee(MARQUEE_ITEMS)}</div>
          <div className="flex w-max items-center">{renderMarquee(MARQUEE_ITEMS)}</div>
        </div>
      </div>

      {/* --------------------------------------------------------- how it works */}
      <Reveal>
        <section className="relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker>Bir xilasın yolu</Kicker>
              <h2 className="display mt-2 text-4xl text-ink sm:text-5xl">Axın izlənilir, kimsə çəkilmir</h2>
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-ink/55">
              Hər addım auditlə qeyd olunur — status keçidləri məcburi ardıcıllıqla, sistem nəzarətindədir.
            </p>
          </div>

          <div className="mt-10 grid gap-px bg-ink/10 sm:grid-cols-2 lg:grid-cols-4">
            {TRACK.map((stage, index) => (
              <div key={stage.title} className="group relative bg-paper p-7">
                <span className="display text-3xl font-semibold tabular-nums text-ink/15">S0{index + 1}</span>
                <span
                  className={`mt-5 block size-2 rounded-full ${
                    stage.tone === 'live'
                      ? 'bg-emerald-500 shadow-[0_0_0_5px_rgb(16_185_129/0.15)]'
                      : 'bg-ink/20'
                  }`}
                />
                <h3 className="display mt-4 text-xl text-ink">{stage.title}</h3>
                <p className="card-rule mt-2 pb-4 text-sm leading-relaxed text-ink/55">{stage.text}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ---------------------------------------------------------- live feed */}
      <section className="relative">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>Canlı axın · demo</Kicker>
            <h2 className="display mt-2 text-4xl text-ink sm:text-5xl">Bakıda bu dəqiqələr</h2>
          </div>
          <Link
            to="/report"
            className="link-underline text-sm font-semibold text-brand-800 transition hover:text-ink"
          >
            Kömək edin →
          </Link>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {FEED.map((item, index) => (
            <Reveal key={item.title} delay={index * 90}>
              <article className="card group h-full p-6 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
                <div className="flex items-center justify-between gap-3">
                  <span className="flex size-9 items-center justify-center rounded-full bg-brand-700 font-display text-sm font-semibold text-white">
                    {item.avatar}
                  </span>
                  <PawBadge status={item.status} />
                </div>
                <h3 className="display mt-4 text-2xl text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/60">{item.description}</p>
                <p className="card-rule mt-5 flex items-center gap-2 pb-1 pt-4 text-xs text-ink/45">
                  <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path
                      d="M12 21c-4.5-3.4-7-6.4-7-9.6a7 7 0 1 1 14 0c0 3.2-2.5 6.2-7 9.6zM10 11h4"
                      strokeLinecap="round"
                    />
                  </svg>
                  {item.district} · {item.time}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

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

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-ink/10 ring-1 ring-ink/10 sm:grid-cols-2">
          {MODULES.map((module, index) => (
            <Reveal key={module.title} delay={index * 70} className="bg-paper">
              <Link
                to={module.to}
                className="group relative block overflow-hidden p-8 transition-colors hover:bg-parchment sm:p-10"
              >
                <span className="pointer-events-none absolute -right-6 -top-8 select-none font-display text-[8rem] font-bold leading-none text-ink/[0.04] transition group-hover:text-brand-600/10">
                  {module.no}
                </span>
                <div className="relative flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-semibold tracking-[0.2em] text-brand-700">/{module.no}</span>
                  <span className="rounded-full bg-ink/4 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink/45 ring-1 ring-inset ring-ink/10">
                    {module.tag}
                  </span>
                </div>
                <h3 className="relative display mt-5 text-2xl text-ink transition group-hover:text-brand-800">
                  {module.title}
                  {module.soon && (
                    <span className="ml-2 rounded-full bg-ink/5 px-2 py-1 align-middle text-[10px] font-semibold uppercase tracking-[0.14em] text-ink/40">
                      Milestone 2
                    </span>
                  )}
                </h3>
                <p className="relative mt-3 max-w-md text-sm leading-relaxed text-ink/55">{module.text}</p>
                <p className="relative card-rule mt-6 flex items-center justify-between pb-2 pt-4">
                  <span className="text-xs font-semibold text-brand-800">{module.stat}</span>
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-ink/60 transition group-hover:gap-2 group-hover:text-ink">
                    Daxil ol
                    <span aria-hidden>→</span>
                  </span>
                </p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ CTA */}
      <Reveal>
        <section className="relative overflow-hidden rounded-2xl bg-ink px-8 py-16 text-white shadow-lift sm:px-14">
          <div className="absolute inset-0 dot-grid-light opacity-70" aria-hidden />
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