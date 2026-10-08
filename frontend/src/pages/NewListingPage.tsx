import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Alert, Field, ImageUpload, LinkButton, SectionTitle } from '../components/ui'
import { createListing } from '../lib/api'
import { ApiError } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { BAKU_CENTER, BAKU_DISTRICTS } from '../lib/format'
import type { AnimalGender, AnimalSize, AnimalSpecies, ListingKind } from '../lib/types'

const KIND_OPTIONS: { value: ListingKind; label: string }[] = [
  { value: 'FOUND', label: 'Tapılmış heyvan' },
  { value: 'LOST', label: 'İtkin heyvan' },
]

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

const GENDER_OPTIONS: { value: AnimalGender; label: string }[] = [
  { value: 'FEMALE', label: 'Dişi' },
  { value: 'MALE', label: 'Erkək' },
  { value: 'UNKNOWN', label: 'Bilinmir' },
]

function chipClass(active: boolean, tint: string) {
  return active
    ? `rounded-full border-2 px-4 py-1.5 text-sm font-extrabold text-ink shadow-pop ${tint}`
    : 'rounded-full border-2 border-ink/15 bg-white px-4 py-1.5 text-sm font-bold text-ink/55 transition hover:border-ink/40 hover:text-ink'
}

export default function NewListingPage() {
  const { user } = useAuth()
  const [kind, setKind] = useState<ListingKind>('FOUND')
  const [species, setSpecies] = useState<AnimalSpecies>('DOG')
  const [name, setName] = useState('')
  const [breed, setBreed] = useState('')
  const [color, setColor] = useState('')
  const [size, setSize] = useState<AnimalSize>('MEDIUM')
  const [gender, setGender] = useState<AnimalGender>('UNKNOWN')
  const [age, setAge] = useState('')
  const [district, setDistrict] = useState(BAKU_DISTRICTS[0])
  const [address, setAddress] = useState('')
  const [description, setDescription] = useState('')
  const [photoUrl, setPhotoUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [createdId, setCreatedId] = useState<number | null>(null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!user) {
      setError('Elan vermək üçün hesabınıza daxil olun.')
      return
    }
    setError(null)
    setSubmitting(true)
    try {
      const years = Number.parseInt(age, 10)
      const created = await createListing({
        kind,
        latitude: BAKU_CENTER[0],
        longitude: BAKU_CENTER[1],
        district,
        address: address.trim(),
        description: description.trim() || undefined,
        animal: {
          name: name.trim() || undefined,
          species,
          breed: breed.trim() || undefined,
          color: color.trim() || undefined,
          size,
          gender,
          ageMonths: Number.isFinite(years) && years > 0 ? years * 12 : undefined,
          photoUrl: photoUrl ?? undefined,
        },
      })
      setCreatedId(created.id)
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Elan yaradılmadı.')
    } finally {
      setSubmitting(false)
    }
  }

  if (createdId != null) {
    return (
      <div className="mx-auto max-w-xl animate-fade-in">
        <div className="overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-lift">
          <span className="block h-2 bg-gradient-to-r from-brand-500 via-sun-400 to-sea-500" aria-hidden />
          <div className="p-8 text-center sm:p-10">
            <p className="display text-3xl text-ink">Elan yaradıldı</p>
            <p className="mt-2 text-sm font-medium text-ink/55">
              Elanınız canlı elanlar bölməsinə əlavə olundu və moderator tərəfindən yoxlanılır.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <LinkButton to={`/listings/${createdId}`} className="pop-stick">
                Elana bax <span aria-hidden>→</span>
              </LinkButton>
              <LinkButton to="/listings" variant="secondary">
                Bütün elanlar
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
        kicker="İtkin & Tapılmış"
        title="Elan ver"
        description="Gördüyünüz heyvanı qeyd edin və ya itkin dostunuzu axtarın — görünürlük bütün istifadəçilərə açıqdır."
      />

      <form onSubmit={handleSubmit} className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-6 overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-card lg:col-span-2">
          <span className="block h-2 bg-gradient-to-r from-brand-500 via-sun-400 to-sea-500" aria-hidden />
          <div className="grid gap-6 p-7 sm:p-8 lg:grid-cols-2">
            <div>
              <span className="field-label">Elan növü</span>
              <div className="flex flex-wrap gap-2">
                {KIND_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setKind(option.value)}
                    className={chipClass(kind === option.value,
                      option.value === 'LOST' ? 'border-rose-600 bg-rose-100' : 'border-sea-600 bg-sea-100')}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="field-label">Heyvan növü</span>
              <div className="flex flex-wrap gap-2">
                {SPECIES_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSpecies(option.value)}
                    className={chipClass(species === option.value, 'border-brand-600 bg-brand-100')}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <Field label="Heyvanın adı (bilinsə)">
              <input
                className="field-input"
                value={name}
                onChange={(event) => setName(event.target.value)}
                maxLength={80}
                placeholder="Məs: Reks"
              />
            </Field>

            <Field label="Cins">
              <input
                className="field-input"
                value={breed}
                onChange={(event) => setBreed(event.target.value)}
                maxLength={80}
                placeholder="Məs: Korgi"
              />
            </Field>

            <Field label="Rəng">
              <input
                className="field-input"
                value={color}
                onChange={(event) => setColor(event.target.value)}
                maxLength={60}
                placeholder="Məs: kürən-ağ"
              />
            </Field>

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

            <div>
              <span className="field-label">Ölçü</span>
              <div className="flex flex-wrap gap-2">
                {SIZE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSize(option.value)}
                    className={chipClass(size === option.value, 'border-sea-600 bg-sea-100')}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="field-label">Cinsi</span>
              <div className="flex flex-wrap gap-2">
                {GENDER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setGender(option.value)}
                    className={chipClass(gender === option.value, 'border-sea-600 bg-sea-100')}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-card">
          <div className="space-y-5 p-7 sm:p-8">
            <Field label="Rayon">
              <select value={district} onChange={(event) => setDistrict(event.target.value)} className="field-input">
                {BAKU_DISTRICTS.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Təxmini ünvan">
              <input
                className="field-input"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                maxLength={300}
                placeholder="Məs: Xətai metrosu, çıxış yanı"
              />
            </Field>

            <Field label="Ətraflı təsvir">
              <textarea
                className="field-input resize-none"
                rows={5}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                maxLength={4000}
                placeholder="Heyvanın görünüşü, davranışı, sonuncu görülən yer…"
              />
            </Field>

            {error && <Alert tone="error">{error}</Alert>}

            <button
              type="submit"
              disabled={submitting}
              className="pop-stick inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-ink bg-brand-600 px-7 py-3.5 text-[15px] font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Yaradılır…' : 'Elanı qeyd et'}
            </button>
          </div>
        </div>

        <div className="space-y-6 overflow-hidden rounded-[2rem] border-2 border-ink bg-white shadow-card">
          <div className="p-7 sm:p-8">
            <span className="field-label">Şəkil</span>
            <ImageUpload value={photoUrl} onChange={setPhotoUrl} disabled={!user} />
            {!user && (
              <p className="mt-3 rounded-2xl bg-sun-100 px-4 py-3 text-xs font-bold text-ink/65">
                Şəkil yükləmək üçün{' '}
                <Link to="/login" className="link-underline font-extrabold text-brand-700 hover:text-ink">
                  daxil olun
                </Link>{' '}
                və ya{' '}
                <Link to="/register" className="link-underline font-extrabold text-brand-700 hover:text-ink">
                  qeydiyyatdan keçin
                </Link>
                .
              </p>
            )}
            <p className="field-hint mt-3 block">
              Şəkil olan elanlar — uyğunluq balı hesablamasında daha dəqiq görünür.
            </p>
          </div>
        </div>
      </form>
    </div>
  )
}