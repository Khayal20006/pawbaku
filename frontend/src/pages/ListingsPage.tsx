import { Link } from 'react-router-dom'
import { useState } from 'react'
import { FilterPill, Kicker, SectionTitle } from '../components/ui'
import { KindTag, LISTINGS, PawBadge } from '../lib/paw'
import type { ListingCard, ListingKind } from '../lib/paw'

const FILTERS = ['Hamısı', 'İtkin', 'Tapılmış'] as const
type Filter = (typeof FILTERS)[number]

const KIND_LABEL: Record<ListingKind, string> = {
  LOST: 'İtkin',
  FOUND: 'Tapılıb',
}

function metaRow(label: string, value: string) {
  return (
    <li className="flex items-center justify-between gap-3 text-sm">
      <span className="font-semibold text-ink/45">{label}</span>
      <span className="truncate font-medium text-ink/85">{value}</span>
    </li>
  )
}

function ListingCardView({ listing }: { listing: ListingCard }) {
  const { animal } = listing
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-parchment shadow-card ring-1 ring-ink/10 transition duration-300 hover:-translate-y-1 hover:shadow-lift">
      <div className="relative overflow-hidden">
        <img
          src={animal.image}
          alt={`${animal.name} — ${animal.species === 'DOG' ? 'it' : animal.species === 'CAT' ? 'pişik' : 'heyvan'}`}
          loading="lazy"
          className="aspect-[4/3] w-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          <KindTag kind={listing.kind} />
          <span className="rounded-full bg-paper/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-ink/70 backdrop-blur">
            {listing.id}
          </span>
        </div>
        <span className="absolute right-3 top-3 mt-9 inline-flex">
          <PawBadge status={listing.status} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="display text-2xl leading-tight text-ink">{animal.name}</h3>
            <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.14em] text-ink/45">
              {animal.breed}
            </p>
          </div>
          <div className="rounded-lg bg-brand-700 px-2.5 py-1.5 text-center text-white shadow-card">
            <span className="block text-sm font-bold tabular-nums">{listing.matchScore}</span>
            <span className="block text-[9px] font-semibold uppercase tracking-widest opacity-80">bal</span>
          </div>
        </div>

        <ul className="mt-4 space-y-2">
          {metaRow('Rəng', animal.color)}
          {metaRow('Ölçü', animal.size === 'SMALL' ? 'Kiçik' : animal.size === 'MEDIUM' ? 'Orta' : 'Böyük')}
          {metaRow('Yaş', `${animal.age} ay`)}
          {metaRow('Rayon', listing.district)}
        </ul>

        <p className="mt-3 flex items-start gap-1.5 text-xs leading-relaxed text-ink/55">
          <svg viewBox="0 0 24 24" className="mt-0.5 size-3.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.7">
            <path
              d="M12 21c-4.5-3.4-7-6.4-7-9.6a7 7 0 1 1 14 0c0 3.2-2.5 6.2-7 9.6zM10 11h4"
              strokeLinecap="round"
            />
          </svg>
          {listing.address}
        </p>

        <div className="card-rule mt-4 flex items-center justify-between pt-4">
          <span className="text-xs text-ink/45">{listing.eventTime}</span>
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-parchment transition hover:bg-brand-700"
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

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-ink/50">
        <span>
          <span className="font-bold tabular-nums text-ink">{visible.length}</span> elan göstərilir
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-1.5 rounded-full bg-emerald-600" /> aktiv elanlar hər gün 22:00-da yoxlanılır
        </span>
      </div>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((listing) => (
          <ListingCardView key={listing.id} listing={listing} />
        ))}
      </div>

      {visible.length === 0 && (
        <div className="mt-8 rounded-2xl border border-dashed border-ink/15 bg-parchment px-6 py-14 text-center">
          <p className="display text-2xl text-ink">Bu filtrdə elan yoxdur</p>
          <p className="mx-auto mt-1 max-w-sm text-sm text-ink/55">
            Filtrləri dəyişin və ya{' '}
            <Link to="/report" className="link-underline font-semibold text-brand-800 hover:text-ink">
              kömək edin
            </Link>
            .
          </p>
        </div>
      )}

      <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-ink/10 ring-1 ring-ink/10 sm:grid-cols-3">
        {[
          { value: '50 m', label: 'yer həssaslığı', text: 'Eyni növdə, 50 m radiusda cütləşmə axtarılır.' },
          { value: '24 saat', label: 'təkrarlama pəncərəsi', text: 'Eyni heyvan üçün təkrar elan filtrasiyası.' },
          { value: '0,65', label: 'uyğunluq həddi', text: 'Bu baldan yuxarı hər iki tərəf bildiriş alır.' },
        ].map((item) => (
          <div key={item.label} className="bg-paper px-6 py-5">
            <p className="display text-3xl font-semibold tabular-nums text-brand-700">{item.value}</p>
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-ink/45">{item.label}</p>
            <p className="mt-1.5 text-xs leading-relaxed text-ink/55">{item.text}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Kicker>İlk elanı siz verin</Kicker>
        <p className="display mt-2 text-3xl text-ink sm:text-4xl">
          Gördüyünüz an — <em className="font-medium text-brand-600">qeyd edin</em>
        </p>
        <div className="mt-6 inline-flex flex-wrap justify-center gap-3">
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-7 py-3 text-sm font-semibold text-parchment transition hover:bg-brand-700"
          >
            Elan ver
            <span aria-hidden>→</span>
          </Link>
          <Link
            to="/report"
            className="inline-flex items-center rounded-full px-6 py-3 text-sm font-semibold text-ink ring-1 ring-ink/20 transition hover:bg-ink/5"
          >
            Kömək edin
          </Link>
        </div>
      </div>
    </div>
  )
}