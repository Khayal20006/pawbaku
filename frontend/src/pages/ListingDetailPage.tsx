import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Button, EmptyState, LinkButton, PageLoader, SectionTitle } from '../components/ui'
import { ApiError, fetchListing, setListingStatus } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { KindTag, PawBadge, PawGlyph } from '../lib/paw'
import { formatDateTime } from '../lib/format'
import type { ListingDto, ListingStatus as BackendListingStatus } from '../lib/types'

const SPECIES_LABEL = { DOG: 'İt', CAT: 'Pişik', OTHER: 'Digər' } as const
const SIZE_LABEL = { SMALL: 'Kiçik', MEDIUM: 'Orta', LARGE: 'Böyük' } as const

function toBadgeStatus(status: BackendListingStatus) {
  if (status === 'REOPENED' || status === 'ACTIVE') return 'ACTIVE' as const
  if (status === 'MATCHED') return 'MATCHED' as const
  return 'CLOSED' as const
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-ink/8 py-2.5 last:border-0">
      <span className="text-xs font-extrabold uppercase tracking-[0.14em] text-ink/40">{label}</span>
      <span className="text-right text-sm font-bold text-ink">{value}</span>
    </div>
  )
}

function ListingDetailView({
  listing,
  canManage = false,
  busy = false,
  manageError = null,
  onToggleStatus,
}: {
  listing: ListingDto
  canManage?: boolean
  busy?: boolean
  manageError?: string | null
  onToggleStatus?: () => void
}) {
  const animal = listing.animal
  const creator = listing.createdBy
  const closable = listing.status === 'ACTIVE' || listing.status === 'REOPENED'
  const reopenable = listing.status === 'CLOSED'
  return (
    <div>
      <div className="overflow-hidden rounded-[2.5rem] border-2 border-ink bg-white shadow-card">
        <div className="grid lg:grid-cols-2">
          <div className="relative overflow-hidden">
            <img
              src={animal.photoUrl || '/hero-paw.jpg'}
              alt={animal.name || 'Heyvan'}
              className="h-72 w-full bg-brand-100 object-cover lg:h-full"
            />
            <span className="absolute left-4 top-4 flex gap-2">
              <KindTag kind={listing.kind} />
            </span>
          </div>
          <div className="flex flex-col p-7 sm:p-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-600">
                Elan #{listing.id} · {listing.district}
              </p>
              <PawBadge status={toBadgeStatus(listing.status)} />
            </div>
            <h1 className="display mt-3 text-4xl leading-none text-ink sm:text-5xl">
              {animal.name || 'Adsız dost'}
            </h1>
            <p className="mt-2 text-sm font-bold text-ink/50">
              {animal.breed || 'Cins məlum deyil'} · {SPECIES_LABEL[animal.species]}
            </p>

            <div className="mt-6">
              <DetailRow label="Rəng" value={animal.color || '—'} />
              <DetailRow label="Ölçü" value={animal.size ? SIZE_LABEL[animal.size] : '—'} />
              <DetailRow label="Yaş" value={animal.ageMonths != null ? `${animal.ageMonths} ay` : '—'} />
              <DetailRow label="Rayon" value={listing.district || '—'} />
              <DetailRow label="Ünvan" value={listing.address || '—'} />
              <DetailRow label="Qeyd olundu" value={formatDateTime(listing.createdAt)} />
            </div>

            {listing.matchListingId != null ? (
              <div className="mt-6 flex items-center gap-4 rounded-2xl border-2 border-ink/15 bg-sun-100/60 p-4">
                <span
                  className={`flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-ink text-base font-extrabold tabular-nums ${
                    listing.matchScore >= 65 ? 'bg-emerald-500 text-white' : 'bg-white text-ink'
                  }`}
                >
                  {listing.matchScore}
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-ink/45">
                    Ən yaxşı uyğunluq {listing.matchScore >= 65 ? '· güclü' : ''}
                  </p>
                  <p className="truncate text-sm font-extrabold text-ink">
                    {listing.matchListingName || 'Adsız dost'} — elan #{listing.matchListingId}
                  </p>
                  <p className="text-xs font-semibold text-ink/55">
                    Növ, rəng, ölçü, məsafə və vaxt ölçüləri ilə hesablanıb.
                  </p>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border-2 border-dashed border-ink/20 bg-paper p-4">
                <p className="text-xs font-semibold text-ink/55">
                  İndiyədək bu elana yaxın uyğun elan qeydə alınmayıb — yeni elan verildikcə bal avtomatik
                  hesablanır.
                </p>
              </div>
            )}

            <div className="mt-6 flex items-center gap-4 rounded-2xl bg-paper p-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-brand-600 text-sm font-extrabold text-white">
                {(creator.fullName || creator.username).slice(0, 2).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-ink">{creator.fullName || creator.username}</p>
                <p className="truncate text-xs font-semibold text-ink/55">
                  {creator.phoneNumber ? `☎ ${creator.phoneNumber}` : 'Əlaqə üçün profildə telefon qeyd edin'}
                </p>
              </div>
            </div>

            {listing.description && (
              <p className="card-rule mt-5 pb-4 pt-5 text-[15px] font-medium leading-relaxed text-ink/70">
                {listing.description}
              </p>
            )}

            <div className="mt-auto flex flex-wrap gap-3 pt-6">
              {canManage && (closable || reopenable) && (
                <>
                  <button
                    type="button"
                    onClick={onToggleStatus}
                    disabled={busy}
                    className={`pop-stick inline-flex items-center gap-2 rounded-full border-2 border-ink px-5 py-2.5 text-sm font-extrabold disabled:cursor-not-allowed disabled:opacity-60 ${
                      closable ? 'bg-rose-600 text-white' : 'bg-sea-600 text-white'
                    }`}
                  >
                    {busy ? 'İşlənir…' : closable ? 'Elanı bağla' : 'Yenidən aç'}
                  </button>
                  <span className="self-center text-xs font-bold text-ink/45">
                    {closable ? 'Bağlandıqda aktiv hovuzdan çıxır.' : 'Bağlanmış elanı yenidən aktivləşdir.'}
                  </span>
                </>
              )}
              <LinkButton to="/report" className="pop-stick">
                <PawGlyph className="size-4" /> Kömək edin
              </LinkButton>
              <Link
                to="/listings"
                className="inline-flex items-center rounded-full border-2 border-ink bg-white px-5 py-2.5 text-sm font-extrabold text-ink transition hover:bg-sun-100"
              >
                Bütün elanlar
              </Link>
            </div>
            {manageError && (
              <p className="mt-3 rounded-2xl bg-rose-50 px-4 py-2.5 text-sm font-bold text-rose-700 ring-1 ring-rose-200" role="alert">
                {manageError}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border-2 border-dashed border-ink/25 bg-white px-6 py-6">
        <p className="max-w-xl text-xs font-semibold leading-relaxed text-ink/55">
          Bu elan sizə aiddir və ya heyvanı tanıyırsınız? Əlaqə məlumatı yuxarıdakı profildədir; sahib
          tapıldıqda sahib özü elanı <strong>bağlaya</strong> bilər — elan aktiv uyğunluq hovuzundan çıxır.
        </p>
        <Link
          to="/listings/new"
          className="pop-stick inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun-400 px-5 py-2.5 text-sm font-extrabold text-ink"
        >
          Elan ver <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  )
}

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuth()
  const [listing, setListing] = useState<ListingDto | null>(null)
  const [error, setError] = useState(false)
  const [busy, setBusy] = useState(false)
  const [manageError, setManageError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    let active = true
    fetchListing(id)
      .then((dto) => {
        if (active) setListing(dto)
      })
      .catch(() => {
        if (active) setError(true)
      })
    return () => {
      active = false
    }
  }, [id])

  async function handleToggleStatus() {
    if (!listing) return
    const target = listing.status === 'CLOSED' ? 'REOPENED' : 'CLOSED'
    setBusy(true)
    setManageError(null)
    try {
      const updated = await setListingStatus(listing.id, target)
      setListing(updated)
    } catch (cause) {
      setManageError(cause instanceof ApiError ? cause.message : 'Status dəyişdirilə bilmədi.')
    } finally {
      setBusy(false)
    }
  }

  if (error) {
    return (
      <EmptyState
        title="Elan tapılmadı"
        description="Bu elan silinib və ya mövcud deyil."
        action={<LinkButton to="/listings">Elanlara qayıt</LinkButton>}
      />
    )
  }

  if (!listing) return <PageLoader label="Elan yüklənir…" />

  const canManage =
    !!listing && !!user && (user.id === listing.createdBy.id || ['ADMIN', 'MODERATOR'].includes(user.role))

  return (
    <div className="animate-fade-in">
      <SectionTitle
        kicker="İtkin & Tapılmış"
        title="Elan məlumatı"
        action={<Button variant="secondary" onClick={() => window.history.back()}>← Geri</Button>}
      />
      <ListingDetailView
        listing={listing}
        canManage={canManage}
        busy={busy}
        manageError={manageError}
        onToggleStatus={handleToggleStatus}
      />
    </div>
  )
}