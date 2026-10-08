import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Counter, Kicker, LinkButton, Reveal } from '../components/ui'
import { FEED, HERO_STATS, MARQUEE_ITEMS, PawBadge, PawGlyph, renderMarquee } from '../lib/paw'
import type { FeedItem } from '../lib/paw'
import { getStoredReports, mergeFeed } from '../lib/store'
import { fetchReports } from '../lib/api'
import { reportDtoToFeedItem } from '../lib/mappers'

const TRACK = [
  { title: 'Qeyd edin', text: 'Heyvanı xəritədə qeyd edin — şəkil, yer, vəziyyət.', tone: 'done' },
  { title: 'Doğrulanır', text: 'Moderator elanı yoxlayır, ehtiyac təsdiqlənir.', tone: 'done' },
  { title: 'Könüllü yolda', text: 'Yaxınlıqdakı könüllü bildiriş alır, yerə gedir.', tone: 'live' },
  { title: 'Həll', text: 'Baytar yardımı, ev, sağalma — son nəticə izlənilir.', tone: 'next' },
] as const

const MODULES: {
  no: string
  tint: string
  ring: string
  tag: string
  title: string
  text: string
  to: string
  stat: string
  soon?: boolean
}[] = [
  {
    no: '01',
    tint: 'bg-brand-50',
    ring: 'text-brand-600 bg-brand-500',
    tag: 'Elan + Matcher',
    title: 'İtkin & Tapılmış',
    text: 'Elan, şəkil, xəritə. Sistem növ, rəng, məsafə və vaxta görə uyğunluq balı hesablayır, hər iki tərəfə bildiriş göndərir.',
    to: '/listings',
    stat: '4 aktiv elan',
  },
  {
    no: '02',
    tint: 'bg-sea-50',
    ring: 'text-sea-600 bg-sea-500',
    tag: 'Axın',
    title: 'Övladlığa götürmə',
    text: 'Profil, ərizə, görüş, nəticə — sığınacaq və moderatorun doğrulaması ilə şəffaf axın.',
    to: '/adopt',
    stat: '2 bala ev axtarır',
  },
  {
    no: '03',
    tint: 'bg-sun-50',
    ring: 'text-sun-600 bg-sun-400',
    tag: 'Kömək',
    title: 'Küçə heyvanına kömək',
    text: 'Zədəli və ya ac heyvanı qeyd edin, statusu izləyin: təsdiq → könüllü → baytar → həll.',
    to: '/report',
    stat: 'Canlı qeydlər',
  },
  {
    no: '04',
    tint: 'bg-violet-50',
    ring: 'text-violet-600 bg-violet-500',
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
  // null = still loading → show the built-in demo tiles; the server feed replaces them once loaded.
  const [serverFeed, setServerFeed] = useState<FeedItem[] | null>(null)

  useEffect(() => {
    let active = true
    fetchReports()
      .then((reports) => {
        if (active) setServerFeed(reports.map((dto) => reportDtoToFeedItem(dto)))
      })
      .catch(() => {
        if (active) setServerFeed([])
      })
    return () => {
      active = false
    }
  }, [])

  const base = serverFeed === null ? FEED : serverFeed
  const feed = mergeFeed(base, getStoredReports())

  return (
    <div className="space-y-24">
      {/* ------------------------------------------------------------------ hero */}
      <section className="relative -mx-4 overflow-hidden sm:-mx-6">
        <span className="blob pointer-events-none absolute -right-28 -top-28 size-96 bg-brand-300/50" aria-hidden />
        <span
          className="pointer-events-none absolute -left-20 top-40 hidden size-52 animate-spin-slow items-center justify-center lg:flex"
          aria-hidden
        >
          <span className="size-52 rounded-full border-[18px] border-dashed border-sun-300/70" />
        </span>
        <div className="pointer-events-none absolute left-1/3 top-10 hidden size-40 lg:block dot-grid opacity-60" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-4 pb-0 pt-14 sm:px-6 sm:pt-20">
          <div className="lg:grid lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="max-w-2xl lg:col-span-6">
              <Reveal>
                <span className="pop-stick inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun-400 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-ink">
                  <PawGlyph className="size-4" />
                  Bakı · Heyvan platforması
                </span>
                <h1 className="display mt-6 text-[44px] leading-[0.98] text-ink sm:text-[68px]">
                  Hər pəncə{' '}
                  <span className="text-stroke">diqqətə</span>
                  <br />
                  <em className="not-italic text-brand-600">layiqdir.</em>
                </h1>
                <p className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-ink/70 sm:text-xl">
                  İtkin heyvanı tap, küçədə gördüyünə kömək et, sahibini gözləyənə{' '}
                  <span className="font-extrabold text-sea-700">yeni ev</span> tap. Sistem özü
                  uyğunlaşdırır və bildirir.
                </p>
              </Reveal>

              <Reveal delay={120}>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  {user ? (
                    <>
                      <LinkButton to="/report" size="lg" className="pop-stick">
                        Kömək edin
                        <span aria-hidden>→</span>
                      </LinkButton>
                      <Link
                        to="/listings"
                        className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-6 py-2.5 text-sm font-extrabold text-ink transition hover:bg-sun-100"
                      >
                        Elanlara bax
                      </Link>
                    </>
                  ) : (
                    <>
                      <LinkButton to="/register" size="lg" className="pop-stick">
                        Pulsuz qoşulun
                        <span aria-hidden>→</span>
                      </LinkButton>
                      <Link
                        to="/listings"
                        className="inline-flex items-center gap-2 rounded-full border-2 border-ink bg-white px-6 py-2.5 text-sm font-extrabold text-ink transition hover:bg-sun-100"
                      >
                        Elanlara bax
                      </Link>
                    </>
                  )}
                </div>
                <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold text-ink/55">
                  <li className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-rose-500" /> İtkin
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-brand-500" /> Kömək
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-sea-500" /> Övladlıq
                  </li>
                </ul>
              </Reveal>
            </div>

            <Reveal delay={200} className="lg:col-span-6">
              <div className="relative mx-auto mt-14 max-w-xl lg:mt-0">
                <figure className="relative overflow-hidden rounded-[2rem] border-4 border-white shadow-pop-lg">
                  <img
                    src="/hero-paw.jpg"
                    alt="PawBaku — kömək gözləyən korgi"
                    loading="eager"
                    fetchPriority="high"
                    className="aspect-[4/3] w-full bg-brand-100 object-cover"
                  />
                  <figcaption className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                    <span className="rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-extrabold text-ink">
                      “Reks” korgi — <span className="text-brand-600">87 bal</span> uyğunluq
                    </span>
                    <span className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-ink px-3 py-1 text-[11px] font-extrabold text-white">
                      <span className="relative flex size-2">
                        <span className="absolute inline-flex size-full animate-ping rounded-full bg-sea-400 opacity-70" />
                        <span className="relative inline-flex size-2 rounded-full bg-sea-400" />
                      </span>
                      Canlı
                    </span>
                  </figcaption>
                </figure>

                <img
                  src="/hero-paw-2.jpg"
                  alt="PawBaku — kiçik sahibini gözləyən bala"
                  loading="lazy"
                  className="float-soft absolute -left-4 -bottom-10 w-32 rounded-[1.6rem] border-[3px] border-ink object-cover shadow-pop sm:-left-8 sm:w-44"
                />

                <span
                  className="pop-stick absolute -right-3 -top-5 flex size-16 items-center justify-center rounded-full border-[3px] border-ink bg-sun-400 sm:size-20"
                  aria-hidden
                >
                  <PawGlyph className="size-8 sm:size-10" />
                </span>

                <span
                  className="absolute -bottom-5 right-6 flex items-center gap-2 rounded-full border-2 border-ink bg-sea-500 px-4 py-2 text-xs font-extrabold text-white shadow-pop"
                  aria-hidden
                >
                  <span className="text-[10px] uppercase tracking-wider">Uyğunlaşdırma</span>
                  <Counter to={90} /> bal
                </span>
              </div>
            </Reveal>
          </div>

          {/* --------------------------------------------------------------- stats */}
          <Reveal delay={80}>
            <div className="mt-20 grid gap-4 sm:grid-cols-3">
              {HERO_STATS.map((stat, index) => (
                <div
                  key={stat.label}
                  className="pop-stick flex items-center gap-4 rounded-3xl border-2 border-ink bg-white px-6 py-5"
                >
                  <span
                    className={`display text-4xl tabular-nums ${
                      index === 0
                        ? 'text-brand-600'
                        : index === 1
                          ? 'text-sea-600'
                          : 'text-sun-600'
                    }`}
                  >
                    <Counter to={stat.value} />
                    {stat.suffix}
                  </span>
                  <span>
                    <span className="block text-[13px] font-extrabold leading-tight text-ink">{stat.label}</span>
                    <span className="mt-0.5 block text-xs font-medium text-ink/50">{stat.hint}</span>
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------------- marquee */}
      <div className="marquee -mx-4 py-1 sm:-mx-6" aria-hidden>
        <div className="marquee-track gap-3">
          {[...renderMarquee(MARQUEE_ITEMS), ...renderMarquee(MARQUEE_ITEMS)].map((node, index) => (
            <span
              key={index}
              className="flex shrink-0 items-center gap-2 rounded-full border-2 border-ink bg-white px-5 py-2 text-sm font-extrabold text-ink shadow-pop"
            >
              {node}
            </span>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------- how it works */}
      <Reveal>
        <section className="relative">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Kicker>Bir xilasın yolu</Kicker>
              <h2 className="display mt-2 text-4xl text-ink sm:text-5xl">
                4 addımda <em className="not-italic text-brand-600">köməyə</em> çevrilir
              </h2>
            </div>
            <p className="max-w-sm text-sm font-medium leading-relaxed text-ink/55">
              Hər addım auditlə qeyd olunur — status keçidləri məcburi ardıcıllıqla, sistem nəzarətindədir.
            </p>
          </div>

          <div className="relative mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <span className="absolute left-0 right-0 top-9 hidden border-t-2 border-dashed border-ink/15 lg:block" aria-hidden />
            {TRACK.map((stage, index) => (
              <div
                key={stage.title}
                className="group relative rounded-3xl border-2 border-ink bg-white p-6 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-pop"
              >
                <span
                  className={`relative z-10 flex size-12 items-center justify-center rounded-full border-2 border-ink text-lg font-extrabold ${
                    stage.tone === 'live'
                      ? 'bg-sea-500 text-white shadow-[0_0_0_6px_rgb(16_169_140/0.15)]'
                      : 'bg-brand-100 text-ink'
                  }`}
                >
                  {index + 1}
                </span>
                <h3 className="display mt-4 text-xl text-ink">{stage.title}</h3>
                <p className="card-rule mt-2 pb-3 text-sm font-medium leading-relaxed text-ink/55">{stage.text}</p>
              </div>
            ))}
          </div>
        </section>
      </Reveal>

      {/* ---------------------------------------------------------- live feed */}
      <section className="relative">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>Canlı axın</Kicker>
            <h2 className="display mt-2 text-4xl text-ink sm:text-5xl">
              Bakıda <em className="not-italic text-brand-600">bu dəqiqələr</em>
            </h2>
          </div>
          <Link
            to="/report"
            className="link-underline text-sm font-extrabold text-brand-700 transition hover:text-ink"
          >
            Kömək edin →
          </Link>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {feed.map((item, index) => {
            const tints = ['bg-brand-100', 'bg-sea-100', 'bg-sun-100']
            const avatars = ['bg-brand-600', 'bg-sea-600', 'bg-sun-500']
            const trackable = item.id ? `/track/${item.id}` : null
            const card = (
              <article className="group h-full overflow-hidden rounded-3xl border-2 border-ink bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-pop">
                <span className={`block h-2 ${tints[index % tints.length]}`} aria-hidden />
                {item.photo && (
                  <div className="relative overflow-hidden">
                    <img
                      src={item.photo}
                      alt=""
                      loading="lazy"
                      className="aspect-[16/9] w-full bg-brand-100 object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`flex size-10 items-center justify-center rounded-full border-2 border-ink text-sm font-extrabold text-white ${avatars[index % avatars.length]}`}
                    >
                      {item.avatar}
                    </span>
                    <PawBadge status={item.status} />
                  </div>
                  <h3 className="display mt-4 text-2xl text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-ink/60">{item.description}</p>
                  <p className="card-rule mt-5 flex items-center justify-between gap-2 pb-1 pt-4 text-xs font-bold text-ink/45">
                    <span className="flex items-center gap-2">
                      <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path
                          d="M12 21c-4.5-3.4-7-6.4-7-9.6a7 7 0 1 1 14 0c0 3.2-2.5 6.2-7 9.6zM10 11h4"
                          strokeLinecap="round"
                        />
                      </svg>
                      {item.district} · {item.time}
                    </span>
                    {trackable && (
                      <span className="flex items-center gap-1 font-extrabold text-brand-600 opacity-0 transition group-hover:opacity-100">
                        İzlə <span aria-hidden>→</span>
                      </span>
                    )}
                  </p>
                </div>
              </article>
            )
            return (
              <Reveal key={item.title} delay={index * 90}>
                {trackable ? (
                  <Link to={trackable} className="block h-full">
                    {card}
                  </Link>
                ) : (
                  card
                )}
              </Reveal>
            )
          })}
        </div>

        {feed.length === 0 && (
          <div className="mt-10 rounded-[2rem] border-2 border-dashed border-ink/25 bg-white px-6 py-14 text-center">
            <p className="display text-2xl text-ink">İlk bildirişi siz qeyd edin</p>
            <p className="mx-auto mt-1 max-w-sm text-sm font-medium text-ink/55">
              Hazırda canlı axın boşdur — küçədə gördüyünüz heyvan üçün bildiriş verin.
            </p>
            <Link
              to="/report"
              className="pop-stick mt-6 inline-flex items-center gap-2 rounded-full border-2 border-ink bg-brand-600 px-7 py-3 text-sm font-extrabold text-white"
            >
              Kömək edin
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------- modules */}
      <section className="relative">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Kicker>Platformanın modulları</Kicker>
            <h2 className="display mt-2 text-4xl text-ink sm:text-5xl">
              Hər heyvana bir <em className="not-italic text-brand-600">yol</em>
            </h2>
          </div>
          <p className="max-w-sm text-sm font-medium leading-relaxed text-ink/55">
            İlk versiyada dörd istiqamət — hər biri müstəqil axını ilə. Milestone 2-də genişlənir.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {MODULES.map((module, index) => (
            <Reveal key={module.title} delay={index * 70}>
              <Link
                to={module.to}
                className={`group relative block overflow-hidden rounded-[2rem] border-2 border-ink p-8 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-pop ${module.tint} sm:p-10`}
              >
                <span
                  className={`text-stroke pointer-events-none absolute -right-3 -top-6 select-none font-display text-[7rem] leading-none opacity-40 sm:text-[9rem]`}
                  aria-hidden
                >
                  {module.no}
                </span>
                <span className={`absolute inset-x-0 bottom-0 h-2 ${module.ring.split(' ')[1]}`} aria-hidden />
                <div className="relative">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`flex size-10 items-center justify-center rounded-2xl border-2 border-ink text-white shadow-pop ${module.ring.split(' ')[1]}`}
                    >
                      <PawGlyph className="size-5" />
                    </span>
                    <span className="rounded-full border-2 border-ink bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-ink">
                      {module.tag}
                      {module.soon && ' · M2'}
                    </span>
                  </div>
                  <h3 className="display mt-5 text-3xl text-ink">{module.title}</h3>
                  <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-ink/65">{module.text}</p>
                  <p className="card-rule mt-6 flex items-center justify-between pb-3 pt-4">
                    <span className="text-sm font-extrabold text-ink">{module.stat}</span>
                    <span className="inline-flex items-center gap-1.5 text-sm font-extrabold text-brand-700 transition group-hover:gap-3">
                      Daxil ol <span aria-hidden>→</span>
                    </span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------------ CTA */}
      <Reveal>
        <section className="relative overflow-hidden rounded-[2.5rem] border-2 border-ink bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 px-8 py-16 text-white shadow-lift sm:px-14">
          <span className="absolute inset-0 dot-grid-light opacity-60" aria-hidden />
          <span className="blob pointer-events-none absolute -right-20 -top-24 size-80 bg-sun-400/40" aria-hidden />
          <span className="pointer-events-none absolute -bottom-14 -left-10 size-56 rounded-full bg-white/10" aria-hidden />
          <PawGlyph className="pointer-events-none absolute -right-4 -bottom-6 size-40 rotate-12 text-white/10" />
          <div className="relative flex flex-wrap items-end justify-between gap-8">
            <div className="max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border-2 border-white/80 px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-white">
                <PawGlyph className="size-4" /> Başlamaq üçün
              </span>
              <h2 className="display mt-5 text-4xl leading-tight text-white sm:text-6xl">
                Bugün köməyə{' '}
                <span className="text-stroke-white">başla</span>
              </h2>
              <p className="mt-4 max-w-md text-base font-semibold leading-relaxed text-white/80">
                Qeydiyyat bir dəqiqədən az çəkir — qeyd et, bildir, izlə. Hər pəncə bir ümiddir.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {!user && (
                <Link
                  to="/register"
                  className="pop-stick inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun-400 px-8 py-3 text-[15px] font-extrabold text-ink"
                >
                  Pulsuz qoşulun
                  <span aria-hidden>→</span>
                </Link>
              )}
              <Link
                to="/report"
                className="inline-flex items-center rounded-full border-2 border-white/70 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/10"
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