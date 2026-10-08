import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Field, ImageUpload, LinkButton, SectionTitle } from '../components/ui'
import { ApiError, createPet } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import type { AnimalSize, AnimalSpecies } from '../lib/types'

const SPECIES_OPTIONS: { value: AnimalSpecies; label: string }[] = [
  { value: 'DOG', label: 'İt' },
  { value: 'CAT', label: 'Pişik' },
  { value: 'OTHER', label: 'Digər' },
]

const SIZE_OPTIONS: { value: AnimalSize; label: string }[] = [
  { value: 'SMALL', label: 'Kiçik' },
  { value: 'MEDIUM', label: 'Orta' },
  { value: 'LARGE', label: 'Böyük' },
]

function chipClass(active: boolean) {
  return active
    ? 'rounded-full border-2 px-4 py-1.5 text-sm font-extrabold text-ink shadow-pop border-brand-600 bg-brand-100'
    : 'rounded-full border-2 border-ink/15 bg-white px-4 py-1.5 text-sm font-bold text-ink/55 transition hover:border-ink/40 hover:text-ink'
}

export default function NewPetPage() {
  const { user } = useAuth()
  const [name, setName] = useState('')
  const [species, setSpecies] = useState<AnimalSpecies>('CAT')
  const [breed, setBreed] = useState('')
  const [color, setColor] = useState('')
  const [size, setSize] = useState<AnimalSize>('MEDIUM')
  const [age, setAge] = useState('')
  const [about, setAbout] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [created, setCreated] = useState<{ id: number; name: string } | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!user) {
      setError('Profil açmaq üçün hesabınıza daxil olun.')
      return
    }
    const trimmed = name.trim()
    if (trimmed.length < 2) {
      setError('Heyvanın adını yazın.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const years = Number.parseInt(age, 10)
      const pet = await createPet({
        name: trimmed,
        species,
        breed: breed.trim() || undefined,
        color: color.trim() || undefined,
        size,
        ageMonths: Number.isFinite(years) && years > 0 ? years * 12 : undefined,
        about: about.trim() || undefined,
        photoUrl: photoUrl ?? undefined,
      })
      setCreated({ id: pet.id, name: pet.name })
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Profil yaradılmadı.')
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-xl animate-fade-in">
        <SectionTitle
          kicker="Övladlığa götürmə"
          title="Övladı paylaşın"
          description="Saxladığınız və ya baxdığınız heyvanı övladlığa götürmə bölməsinə əlavə edin."
        />
        <Alert tone="info" title="Hesab tələb olunur">
          <Link to="/login" className="font-extrabold underline underline-offset-2">
            Daxil ol
          </Link>{' '}
          və ya{' '}
          <Link to="/register" className="font-extrabold underline underline-offset-2">
            qeydiyyatdan keç
          </Link>{' '}
          — profillər yalnız üzvlər tərəfindən açılır.
        </Alert>
      </div>
    )
  }

  if (created != null) {
    return (
      <div className="mx-auto max-w-xl animate-fade-in">
        <div className="overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-lift">
          <span className="block h-2 bg-gradient-to-r from-brand-500 via-sun-400 to-sea-500" aria-hidden />
          <div className="p-8 text-center sm:p-10">
            <p className="display text-3xl text-ink">Profil yaradıldı</p>
            <p className="mt-2 text-sm font-medium text-ink/55">
              «{created.name}» indi övladlığa götürmə bölməsində sahibini gözləyir.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <LinkButton to="/adopt" className="pop-stick">
                Övladlığa götürmə <span aria-hidden>→</span>
              </LinkButton>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="animate-fade-in">
      <SectionTitle
        kicker="Övladlığa götürmə"
        title="Övladı paylaşın"
        description="Heyvanın profilini hazırlayın — ad, şəkil, xarakter. Maraqlı şəxslər sizinlə profil üzərindən əlaqə saxlayır."
      />

      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-card">
        <span className="block h-2 bg-gradient-to-r from-brand-500 via-sun-400 to-sea-500" aria-hidden />
        <div className="grid gap-6 p-7 sm:p-8 lg:grid-cols-2">
          <div>
            <span className="field-label">Heyvan növü</span>
            <div className="flex flex-wrap gap-2">
              {SPECIES_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSpecies(option.value)}
                  className={chipClass(species === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <Field label="Ad *">
            <input
              className="field-input"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={120}
              placeholder="Məs: Mila"
            />
          </Field>

          <Field label="Cins">
            <input
              className="field-input"
              value={breed}
              onChange={(event) => setBreed(event.target.value)}
              maxLength={80}
              placeholder="Məs: Hans pişik"
            />
          </Field>

          <Field label="Rəng">
            <input
              className="field-input"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              maxLength={60}
              placeholder="Məs: boz-ağ"
            />
          </Field>

          <div>
            <span className="field-label">Ölçü</span>
            <div className="flex flex-wrap gap-2">
              {SIZE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setSize(option.value)}
                  className={chipClass(size === option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <Field label="Təxmini yaş (illərlə)">
            <input
              type="number"
              min={0}
              max={30}
              className="field-input"
              value={age}
              onChange={(event) => setAge(event.target.value)}
              placeholder="Məs: 2"
            />
          </Field>

          <div className="lg:col-span-2">
            <Field label="Haqqında — xarakter, vərdişlər, ehtiyaclar">
              <textarea
                className="field-input resize-none"
                rows={4}
                value={about}
                onChange={(event) => setAbout(event.target.value)}
                maxLength={1200}
                placeholder="Məs: sakit və ünsiyyətcil, uşaqlarla yola gedir…"
              />
            </Field>
          </div>

          <div className="lg:col-span-2">
            <span className="field-label">Şəkil</span>
            <ImageUpload value={photoUrl} onChange={setPhotoUrl} />
          </div>

          {error && <Alert tone="error">{error}</Alert>}

          <div className="lg:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="pop-stick inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-brand-600 px-7 py-3.5 text-[15px] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Yaradılır…' : 'Profilin sayta əlavə et'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}