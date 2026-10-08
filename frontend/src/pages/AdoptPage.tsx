import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Alert, LinkButton, SectionTitle } from '../components/ui'
import { ApiError, applyToAdopt, fetchAdoptions } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { PawGlyph } from '../lib/paw'
import type { PetDto } from '../lib/types'

const SPECIES_LABEL = { DOG: 'İt', CAT: 'Pişik', OTHER: 'Digər' } as const
const SIZE_LABEL = { SMALL: 'Kiçik', MEDIUM: 'Orta', LARGE: 'Böyük' } as const
const AGE_LABEL = (months: number | null) =>
  months == null ? 'Yaşı məlum deyil' : months < 12 ? `${months} ay` : `${Math.round(months / 12)} yaş`

function NotFound() {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {[0, 1, 2].map((item) => (
        <div key={item} className="animate-pulse overflow-hidden rounded-[2rem] border-2 border-ink/10 bg-white shadow-card">
          <div className="aspect-[4/3] w-full bg-ink/5" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-1/2 rounded-full bg-ink/10" />
            <div className="h-3 w-2/3 rounded-full bg-ink/5" />
            <div className="h-10 w-full rounded-2xl bg-ink/5" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdoptPage() {
  const { user } = useAuth()
  const [pets, setPets] = useState<PetDto[] | null>(null)
  const [applying, setApplying] = useState<PetDto | null>(null)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<{ petName: string; id: number } | null>(null)

  useEffect(() => {
    let active = true
    fetchAdoptions()
      .then((items) => {
        if (active) setPets(items)
      })
      .catch(() => {
        if (active) setPets([])
      })
    return () => {
      active = false
    }
  }, [])

  async function handleApply(event: FormEvent) {
    event.preventDefault()
    if (!applying || !user) return
    setError(null)
    setSubmitting(true)
    try {
      const created = await applyToAdopt(applying.id, message)
      setSuccess({ petName: applying.name, id: created.id })
      setApplying(null)
      setMessage('')
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Ərizə göndərilə bilmədi.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <SectionTitle
        kicker="Övladlığa götürmə"
        title="Yeni ev, yeni dost"
        description="Şəffaf axın: profil → ərizə → görüş → nəticə. Sığınacaq rəyi əsasında nəticə statusa çevrilir."
        action={
          <LinkButton to="/adopt/new" size="lg" className="pop-stick">
            Övladı paylaşın
            <span aria-hidden>→</span>
          </LinkButton>
        }
      />

      {success && (
        <Alert tone="success" title="Ərizə göndərildi">
          «{success.petName}» üçün ərizəniz qeydə alındı. Statusunuzu{' '}
          <Link to="/profile" className="underline underline-offset-2">
            profil
          </Link>{' '}
          səhifəsindən izləyə bilərsiniz.
        </Alert>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {(pets ?? []).map((pet) => (
          <article
            key={pet.id}
            className="group flex h-full flex-col overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-pop-lg"
          >
            <div className="relative overflow-hidden">
              <img
                src={pet.photoUrl || '/hero-paw.jpg'}
                alt={`${pet.name} — övladlığa götürmə`}
                loading="lazy"
                className="aspect-[4/3] w-full bg-brand-100 object-cover transition duration-500 group-hover:scale-[1.05]"
              />
              <span className="pop-stick absolute left-3 top-3 rounded-full border-2 border-ink bg-sea-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                Sahibini gözləyir
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-ink/40">
                    {SPECIES_LABEL[pet.species]} {pet.breed ? `· ${pet.breed}` : ''}
                  </p>
                  <h3 className="display mt-1 text-2xl text-ink">{pet.name}</h3>
                </div>
                <span className="rounded-full bg-paper px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-ink/55">
                  №{pet.id}
                </span>
              </div>

              {pet.about && (
                <p className="mt-3 text-sm font-medium leading-relaxed text-ink/60">{pet.about}</p>
              )}

              <p className="card-rule mt-4 pb-4 pt-3 text-xs font-bold text-ink/45">
                {pet.color ? `${pet.color} · ` : ''}
                {pet.size ? `${SIZE_LABEL[pet.size]} · ` : ''}
                {AGE_LABEL(pet.ageMonths)}
              </p>

              <button
                type="button"
                onClick={() => setApplying(pet)}
                className="pop-stick mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-brand-600 px-5 py-2.5 text-sm font-extrabold text-white"
              >
                Ərizə göndər
                <span aria-hidden>→</span>
              </button>
            </div>
          </article>
        ))}
      </div>

      {pets !== null && pets.length === 0 && (
        <div className="mt-6 rounded-[2rem] border-2 border-dashed border-ink/25 bg-white px-6 py-16 text-center">
          <p className="display text-3xl text-ink">Hələ heyvan yoxdur</p>
          <p className="mx-auto mt-2 max-w-sm text-sm font-medium text-ink/55">
            Otel və ya sığınacaqdakı dostlarınızı paylaşın — ilk profili siz aça bilərsiniz.
          </p>
          <LinkButton to="/adopt/new" className="pop-stick mt-6">
            Övladı paylaşın <span aria-hidden>→</span>
          </LinkButton>
        </div>
      )}

      {pets === null && <NotFound />}

      {/* stay involved */}
      <div className="mt-12 flex flex-wrap items-center justify-between gap-6 rounded-[2rem] border-2 border-ink bg-gradient-to-br from-sea-600 via-sea-700 to-sea-800 px-8 py-10 text-white shadow-lift">
        <div className="max-w-md">
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/70">
            İcma rəyi, moderator nəzarəti
          </p>
          <h3 className="display mt-2 text-3xl text-white">Sahibsiz deyil, gözləyirik</h3>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-white/80">
            Hər profil bir ərizəçi üçün açılır; görüş və təsdiqdən sonra status ADOPTED olur.
          </p>
        </div>
        <Link
          to="/listings"
          className="pop-stick inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sun-400 px-6 py-3 text-sm font-extrabold text-ink"
        >
          <PawGlyph className="size-4" /> Elanlara bax
        </Link>
      </div>

      {/* apply sheet */}
      {applying && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 p-4 sm:items-center" onClick={() => setApplying(null)}>
          <div
            role="dialog"
            aria-label={`${applying.name} üçün ərizə`}
            className="w-full max-w-md overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-lift"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="relative">
              <img
                src={applying.photoUrl || '/hero-paw.jpg'}
                alt=""
                className="aspect-[4/3] w-full bg-brand-100 object-cover"
              />
              <button
                type="button"
                aria-label="Bağla"
                onClick={() => setApplying(null)}
                className="absolute right-3 top-3 rounded-full border-2 border-ink bg-white px-3 py-1 text-xs font-extrabold text-ink shadow-pop"
              >
                Bağla
              </button>
              <span className="absolute left-3 top-3 rounded-full border-2 border-ink bg-sea-500 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">
                {applying.name} · {SPECIES_LABEL[applying.species]}
              </span>
            </div>
            <form onSubmit={handleApply} className="space-y-4 p-6">
              <div>
                <p className="display text-xl text-ink">Ərizə göndər</p>
                <p className="text-xs font-semibold text-ink/50">
                  {user ? `Hesab: ${user.fullName || user.username}` : 'Ərizə üçün hesab tələb olunur'}
                </p>
              </div>

              {!user && (
                <Alert tone="info">
                  <Link to="/login" className="font-extrabold underline underline-offset-2">
                    Daxil olun
                  </Link>{' '}
                  və ya{' '}
                  <Link to="/register" className="font-extrabold underline underline-offset-2">
                    qeydiyyatdan keçin
                  </Link>{' '}
                  — ərizələr yalnız hesabla verilir.
                </Alert>
              )}

              <label className="block">
                <span className="field-label">Mesaj (əlverişli)</span>
                <textarea
                  className="field-input resize-none"
                  rows={4}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  maxLength={1200}
                  placeholder="Ev şəraiti, təcrübə, niyə məhz bu dost?"
                />
              </label>

              {error && <Alert tone="error">{error}</Alert>}

              <button
                type="submit"
                disabled={!user || submitting}
                className="pop-stick inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-brand-600 px-6 py-3 text-sm font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Göndərilir…' : 'Ərizəni göndər'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}