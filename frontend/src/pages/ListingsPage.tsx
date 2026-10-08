import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FilterPill, Kicker, SectionTitle } from '../components/ui'
import { KindTag, LISTINGS, PawBadge } from '../lib/paw'
import type { ListingCard, ListingKind } from '../lib/paw'

const FILTERS = ['Hamısı', 'İtkin', 'Tapılmış'] as const
type Filter = (typeof FILTERS)[number]

const KIND_LABEL: Record<ListingKind, string> = {
  LOST: 'İtkin',
  FOUND: 'Tapılmış',
}

const MATCH_RING: Record<number, string> = {
  0: 'bg-sun-400 text-ink',
  1: 'bg-sea-500 text-white',
  2: 'bg-brand-600 text-white',
}

function metaChip(label: string, value: string) {
  return (
    <span className="flex items-center gap-1.5 text-xs font-bold">
      <span className="uppercase tracking-wider text-ink/40">{label}</span>
      <span className="text-ink">{value}</span>
    </span>
  )
}

function ListingCardView({ listing }: { listing: ListingCard }) {
  const { animal } = listing
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-pop-lg">
      <div className="relative overflow-hidden">
        <img
          src={animal.image}
          alt={`${animal.name} — ${animal.species === 'DOG' ? 'it' : animal.species === 'CAT' ? 'pişik' : 'heyvan'}`}
          loading="lazy"
          className="aspect-[4/3] w-full bg-brand-100 object-cover transition duration-500 group-hover:scale-[1.05]"
        />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <KindTag kind={listing.kind} />
          <span className="rounded-full border-2 border-ink bg-white/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ink">
            {listing.id}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="display text-2xl leading-tight text-ink">{animal.name}</h3>
            <p className="mt-0.5 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink/40">
              {animal.breed}
            </p>
          </div>
          <div
            className={`flex flex-col items-center rounded-2xl border-2 border-ink px-3 py-1.5 shadow-pop ${
              MATCH_RING[listing.matchScore >= 85 ? 2 : listing.matchScore >= 65 ? 1 : 0]
            }`}
          >
            <span className="display text-lg leading-none tabular-nums">{listing.matchScore}</span>
            <span className="text-[9px] font-extrabold uppercase tracking-widest opacity-80">bal</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
          {metaChip('Rəng', animal.color)}
          {metaChip('Ölçü', animal.size === 'SMALL' ? 'Kiçik' : animal.size === 'MEDIUM' ? 'Orta' : 'Böyük')}
          {metaChip('Yaş', `${animal.age} ay`)}
          {metaChip('Rayon', listing.district)}
        </div>

        <p className="mt-3 flex items-start gap-1.5 rounded-2xl bg-paper px-3 py-2 text-xs font-semibold leading-relaxed text-ink/65">
          <svg viewBox="0 0 24 24" className="mt-0.5 size-3.5 shrink-0 text-brand-600" fill="none" stroke="currentColor" strokeWidth="2">
            <path
              d="M12 21c-4.5-3.4-7-6.4-7-9.6a7 7 0 1 1 14 0c0 3.2-2.5 6.2-7 9.6zM10 11h4"
              strokeLinecap="round"
            />
          </svg>
          {listing.address}
        </p>

        <div className="card-rule mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="flex items-center gap-2 text-xs font-bold text-ink/45">
            <PawBadge status={listing.status} />
            {listing.eventTime}
          </span>
          <Link
            to="/register"
            className="pop-stick inline-flex items-center gap-1.5 rounded-full border-2 border-ink bg-brand-600 px-4 py-2 text-xs font-extrabold text-white"
          >
            Ətraflı bax
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function ListingsPage() {
  const [active, setActive] = useState<Filter>('Hamısı')
  const visible = active === 'Hamısı'
    ? LISTINGS
    : LISTINGS.filter((listing) => KIND_LABEL[listing.kind] === active)

  return (
    <div className="animate-fade-in">
      <SectionTitle
        kicker="İtkin & Tapılmış"
        title="Elanlar"
        description="Sistem növ, rəng, məsafə və vaxta görə uyğunluq balı hesablayır — sahibi və tapan tərəf avtomatik bildiriş alır."
        action={
          <div className="flex flex-wrap gap-2">
            {FILTERS.map((filter) => (
              <FilterPill key={filter} active={active === filter} onClick={() => setActive(filter)}>
                {filter}
              </FilterPill>
            ))}
          </div>
        }
      />

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-bold text-ink/50">
        <span>
          <span className="text-ink">{visible.length}</span> elan göstərilir
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-sea-500" /> aktiv elanlar hər gün 22:00-da yoxlanılır
        </span>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((listing) => (
          <ListingCardView key={listing.id} listing={listing} />
        ))}
      </div>

      {visible.length === 0 && (
        <div className="mt-8 rounded-[2rem] border-2 border-dashed border-ink/25 bg-white px-6 py-14 text-center">
          <p className="display text-2xl text-ink">Bu filtr üzrə elan yoxdur</p>
          <p className="mx-auto mt-1 max-w-sm text-sm font-medium text-ink/55">
            Filtrləri dəyişin və ya{' '}
            <Link to="/report" className="link-underline font-extrabold text-brand-700 hover:text-ink">
              kömək edin
            </Link>
            .
          </p>
        </div>
      )}

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        {[
          { value: '50 m', tint: 'text-sea-600', label: 'yer həssaslığı', text: 'Eyni növdə, 50 m radiusda uyğun elan axtarılır.' },
          { value: '24 h', tint: 'text-brand-600', label: 'təkrarlama pəncərəsi', text: 'Eyni heyvan üçün təkrar elan filtrasiyası.' },
          { value: '0,65', tint: 'text-sun-600', label: 'uyğunluq həddi', text: 'Bu baldan yuxarı hər iki tərəf bildiriş alır.' },
        ].map((item) => (
          <div key={item.label} className="pop-stick rounded-3xl border-2 border-ink bg-white px-6 py-5">
            <p className={`display text-4xl tabular-nums ${item.tint}`}>{item.value}</p>
            <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink/45">{item.label}</p>
            <p className="mt-1.5 text-xs font-medium leading-relaxed text-ink/55">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Kicker>İlk elanı siz verin</Kicker>
        <p className="display mt-2 text-3xl text-ink sm:text-4xl">
          Gördüyünüz an — <em className="not-italic text-brand-600">qeyd edin</em>
        </p>
        <div className="mt-6 inline-flex flex-wrap justify-center gap-3">
          <Link
            to="/register"
            className="pop-stick inline-flex items-center gap-2 rounded-full border-2 border-ink bg-brand-600 px-7 py-3 text-sm font-extrabold text-white"
          >
            Elan ver
            <span aria-hidden>→</span>
          </Link>
          <Link
            to="/report"
            className="inline-flex items-center rounded-full border-2 border-ink bg-white px-6 py-3 text-sm font-extrabold text-ink transition hover:bg-sun-100"
          >
            Kömək edin
          </Link>
        </div>
      </div>
    </div>
  )
}