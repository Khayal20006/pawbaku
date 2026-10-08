import { useEffect, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { api, ApiError, fetchMyApplications, fetchMyReports } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { ROLE_LABELS, formatDate, formatRelative } from '../lib/format'
import type { ApplicationDto, ReportDto, User } from '../lib/types'
import { Alert, Badge, Button, Card, CardHeader, EmptyState, Field, SectionTitle } from '../components/ui'
import { PawBadge, PawGlyph } from '../lib/paw'

const STAFF_ROLES = ['ADMIN', 'MODERATOR', 'SHELTER_STAFF']
const APP_STATUS_LABEL = { PENDING: 'Gözləyir', APPROVED: 'Təsdiqləndi', REJECTED: 'Rədd edildi' } as const

type Tab = 'overview' | 'reports' | 'applications'

export default function ProfilePage() {
  const { user, refresh } = useAuth()
  const [tab, setTab] = useState<Tab>('reports')
  const [form, setForm] = useState({
    email: user?.email ?? '',
    fullName: user?.fullName ?? '',
    phoneNumber: user?.phoneNumber ?? '',
  })
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving] = useState(false)
  const [reports, setReports] = useState<ReportDto[] | null>(null)
  const [applications, setApplications] = useState<ApplicationDto[] | null>(null)

  useEffect(() => {
    if (!user) return
    let active = true
    fetchMyReports()
      .then((items) => active && setReports(items))
      .catch(() => active && setReports([]))
    fetchMyApplications()
      .then((items) => active && setApplications(items))
      .catch(() => active && setApplications([]))
    return () => {
      active = false
    }
  }, [user])

  if (!user) return null

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSuccess(false)
    setSaving(true)
    try {
      await api.put<User>(`/api/users/${user!.id}`, {
        email: form.email.trim() || undefined,
        fullName: form.fullName.trim() || undefined,
        phoneNumber: form.phoneNumber.trim() || undefined,
      })
      await refresh()
      setSuccess(true)
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Məlumatlar yenilənmədi')
    } finally {
      setSaving(false)
    }
  }

  const tabs: { key: Tab; label: string; count?: number }[] = [
    { key: 'reports', label: 'Bildirişlərim', count: reports?.length },
    { key: 'applications', label: 'Ərizələrim', count: applications?.length },
    { key: 'overview', label: 'Məlumatlar' },
  ]

  return (
    <div className="mx-auto max-w-4xl animate-fade-in">
      <SectionTitle
        title="Profil"
        description="Şəxsi məlumatlar, bildirişləriniz və övladlığa götürmə ərizələriniz."
        action={
          STAFF_ROLES.includes(user.role) ? (
            <Link
              to="/admin"
              className="pop-stick inline-flex items-center gap-2 rounded-full border-2 border-ink bg-sea-600 px-6 py-3 text-sm font-extrabold text-white"
            >
              İdarəetmə paneli
              <span aria-hidden>→</span>
            </Link>
          ) : undefined
        }
      />

      <div className="card mb-6 flex flex-wrap items-center gap-4 p-6">
        <span className="flex size-16 items-center justify-center rounded-2xl bg-ink text-xl font-semibold text-parchment">
          {(user.fullName || user.username).slice(0, 2).toUpperCase()}
        </span>
        <div>
          <p className="display text-xl text-ink">{user.fullName || user.username}</p>
          <p className="mt-0.5 text-sm text-ink/55">{user.email}</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge className="bg-brand-600/10 text-brand-700 ring-brand-600/25">{ROLE_LABELS[user.role]}</Badge>
            <Badge
              className={
                user.active
                  ? 'bg-emerald-600/10 text-emerald-700 ring-emerald-600/25'
                  : 'bg-rose-600/10 text-rose-700 ring-rose-600/25'
              }
            >
              {user.active ? 'Aktiv' : 'Bloklanıb'}
            </Badge>
          </div>
        </div>
        <p className="ml-auto text-xs text-ink/45">Qeydiyyat: {formatDate(user.createdAt)}</p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            type="button"
            onClick={() => setTab(item.key)}
            className={`rounded-full border-2 px-4 py-1.5 text-sm font-extrabold transition ${
              tab === item.key
                ? 'border-ink bg-sun-400 text-ink shadow-pop -translate-y-0.5'
                : 'border-ink/10 bg-white text-ink/60 hover:border-ink/30 hover:text-ink'
            }`}
          >
            {item.label}
            {typeof item.count === 'number' && <span className="ml-1.5 text-xs opacity-70">({item.count})</span>}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="space-y-5">
          <Card>
            <CardHeader title="Məlumatları redaktə et" />
            <form onSubmit={handleSubmit} className="space-y-4 p-6">
              {error && <Alert tone="error">{error}</Alert>}
              {success && <Alert tone="success">Məlumatlar yeniləndi</Alert>}

              <Field label="Ad, soyad">
                <input
                  className="field-input"
                  value={form.fullName}
                  onChange={(event) => setForm({ ...form, fullName: event.target.value })}
                  maxLength={120}
                />
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  className="field-input"
                  value={form.email}
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  maxLength={150}
                />
              </Field>

              <Field label="Telefon">
                <input
                  className="field-input"
                  value={form.phoneNumber}
                  onChange={(event) => setForm({ ...form, phoneNumber: event.target.value })}
                  maxLength={20}
                  placeholder="+994 50 123 45 67"
                />
              </Field>

              <Button type="submit" loading={saving}>
                Yadda saxla
              </Button>
            </form>
          </Card>

          <Alert tone="info" title="Təhlükəsizlik">
            Parol dəyişdirmək üçün{' '}
            <a href="mailto:komak@pawbaku.az" className="font-semibold underline">
              komak@pawbaku.az
            </a>{' '}
            ünvanına müraciət edin.
          </Alert>
        </div>
      )}

      {tab === 'reports' && (
        <div className="space-y-4">
          {reports === null && (
            <div className="card p-8 text-center text-sm font-medium text-ink/50">Yüklənir…</div>
          )}
          {reports?.length === 0 && (
            <Card>
              <EmptyState
                title="Bildiriş yoxdur"
                description="Küçədə gördüyünüz heyvan üçün ilk bildirişi siz verin."
                action={<Link to="/report" className="link-underline text-sm font-extrabold text-brand-700 hover:text-ink">Kömək edin →</Link>}
              />
            </Card>
          )}
          {(reports ?? []).map((report) => (
            <Link key={report.id} to={`/track/${report.id}`} className="block">
              <article className="card group flex flex-wrap items-center gap-4 p-5 transition duration-300 hover:-translate-y-0.5 hover:shadow-lift">
                <span className="flex size-11 items-center justify-center rounded-xl bg-brand-600/10 text-brand-600">
                  <PawGlyph className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="display text-lg text-ink">{report.title}</h3>
                    <PawBadge status={report.status} />
                  </div>
                  <p className="mt-0.5 truncate text-sm font-medium text-ink/55">
                    {report.description}
                  </p>
                  <p className="mt-1 text-xs font-bold text-ink/40">
                    {report.district} · {formatRelative(report.createdAt)}
                  </p>
                </div>
                <span className="opacity-0 transition group-hover:opacity-100">
                  <span className="text-sm font-extrabold text-brand-600">İzlə →</span>
                </span>
              </article>
            </Link>
          ))}
        </div>
      )}

      {tab === 'applications' && (
        <div className="space-y-4">
          {applications === null && (
            <div className="card p-8 text-center text-sm font-medium text-ink/50">Yüklənir…</div>
          )}
          {applications?.length === 0 && (
            <Card>
              <EmptyState
                title="Ərizə yoxdur"
                description="Övladlığa götürmə bölməsindən bir dosta ərizə göndərə bilərsiniz."
                action={<Link to="/adopt" className="link-underline text-sm font-extrabold text-brand-700 hover:text-ink">Övladlığa götürmə →</Link>}
              />
            </Card>
          )}
          {(applications ?? []).map((application) => (
            <article key={application.id} className="card p-5">
              <div className="flex flex-wrap items-center gap-3">
                <p className="display text-lg text-ink">{application.petName}</p>
                <Badge
                  className={
                    application.status === 'PENDING'
                      ? 'bg-sun-400/40 text-ink ring-sun-500/40'
                      : application.status === 'APPROVED'
                        ? 'bg-emerald-600/10 text-emerald-700 ring-emerald-600/25'
                        : 'bg-rose-600/10 text-rose-700 ring-rose-600/25'
                  }
                >
                  {APP_STATUS_LABEL[application.status]}
                </Badge>
                <span className="ml-auto text-xs font-bold text-ink/40">
                  {formatRelative(application.createdAt)}
                </span>
              </div>
              {application.message && (
                <p className="mt-2 text-sm font-medium leading-relaxed text-ink/60">{application.message}</p>
              )}
              <p className="mt-3 text-xs font-semibold leading-relaxed text-ink/45">
                Əlaqə üçün profil panelindən məlumatlarınız yenilənmiş olmalıdır; nəticə out-of-band
                bildirilir.
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}