import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ApiError, sendOtp } from '../lib/api'
import AuthShell from '../components/AuthShell'
import { Alert, Button, Field } from '../components/ui'

const OTP_COOLDOWN_SECONDS = 60

export default function RegisterPage() {
  const { register, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phoneNumber: '',
  })
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [details, setDetails] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  const [otpState, setOtpState] = useState<{
    email: string | null
    previewCode: string | null
    error: string | null
    sending: boolean
    cooldown: number
  }>({ email: null, previewCode: null, error: null, sending: false, cooldown: 0 })

  useEffect(() => {
    if (otpState.cooldown <= 0) return
    const timer = window.setInterval(() => {
      setOtpState((state) => ({ ...state, cooldown: Math.max(0, state.cooldown - 1) }))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [otpState.cooldown])

  if (user) {
    return <Navigate to="/" replace />
  }

  function update(field: keyof typeof form, value: string) {
    setForm((previous) => ({ ...previous, [field]: value }))
  }

  const currentEmail = form.email.trim().toLowerCase()
  // The code is only valid for the email it was sent to — editing the email resets the step.
  const otpMatchesEmail = otpState.email !== null && otpState.email === currentEmail
  const showCodeField = otpMatchesEmail && otpState.previewCode !== undefined
  const emailReady = form.email.includes('@') && form.email.includes('.')

  async function handleSendOtp() {
    if (!emailReady) {
      setOtpState((state) => ({ ...state, error: 'Doğrulama kodu üçün əvvəlcə emaili daxil edin' }))
      return
    }
    setOtpState((state) => ({ ...state, sending: true, error: null }))
    try {
      const result = await sendOtp(currentEmail)
      setOtpState({
        email: currentEmail,
        previewCode: result.previewCode ?? null,
        error: null,
        sending: false,
        cooldown: OTP_COOLDOWN_SECONDS,
      })
    } catch (cause) {
      setOtpState((state) => ({
        ...state,
        sending: false,
        error: cause instanceof ApiError ? cause.message : 'Kod göndərilə bilmədi',
      }))
    }
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setDetails([])
    setSubmitting(true)
    try {
      await register({
        username: form.username.trim(),
        email: currentEmail,
        password: form.password,
        fullName: form.fullName.trim() || undefined,
        phoneNumber: form.phoneNumber.trim() || undefined,
        verificationCode: code.trim(),
      })
      navigate('/', { replace: true })
    } catch (cause) {
      if (cause instanceof ApiError) {
        setError(cause.message)
        setDetails(cause.details)
      } else {
        setError('Qeydiyyat mümkün olmadı')
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      kicker="Qeydiyyat"
      title="Pulsuz hesab yaradın"
      subtitle="Ad və telefon vacib deyil. Emailinizə gələn 6 rəqəmli kodla hesabınızı doğrulayın."
      footer={
        <>
          Artıq hesabınız var?{' '}
          <Link to="/login" className="font-semibold text-brand-700 hover:text-brand-800">
            Daxil olun
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert tone="error">
            <p>{error}</p>
            {details.length > 0 && (
              <ul className="mt-1.5 list-disc space-y-0.5 pl-4 text-xs">
                {details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            )}
          </Alert>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="İstifadəçi adı" hint="Hərf, rəqəm, . _ -">
            <input
              className="field-input"
              value={form.username}
              onChange={(event) => update('username', event.target.value)}
              autoComplete="username"
              required
              placeholder="aysel"
              minLength={3}
              maxLength={50}
            />
          </Field>

          <Field label="Ad, soyad" hint="Məcburi deyil">
            <input
              className="field-input"
              value={form.fullName}
              onChange={(event) => update('fullName', event.target.value)}
              autoComplete="name"
              placeholder="Aysel Məmmədova"
            />
          </Field>
        </div>

        <Field label="Email">
          <input
            type="email"
            className="field-input"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            autoComplete="email"
            required
            placeholder="aysel@example.az"
          />
        </Field>

        {/* ------------------------------------------------------- email verification */}
        <div className="rounded-2xl border border-ink/12 bg-paper p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] font-semibold text-ink/70">
              {otpMatchesEmail
                ? 'Emailinizə kod göndərildi — aşağıya daxil edin.'
                : 'Qeydiyyatdan əvvəl emailiniz doğrulanmalıdır.'}
            </p>
            <Button
              type="button"
              size="md"
              disabled={(otpState.cooldown > 0 && otpMatchesEmail) || otpState.sending}
              onClick={handleSendOtp}
              loading={otpState.sending}
            >
              {otpState.cooldown > 0 && otpMatchesEmail
                ? `${otpState.cooldown} s sonra`
                : otpMatchesEmail
                  ? 'Yenidən göndər'
                  : 'Kod göndər'}
            </Button>
          </div>

          {otpState.error && (
            <p className="mt-3 rounded-lg bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-700">
              {otpState.error}
            </p>
          )}

          {showCodeField && (
            <div className="mt-3">
              <Field
                label="Doğrulama kodu"
                hint="Kod 10 dəqiqə etibarlıdır. Yanlış emailə kod göndərəndə emaili dəyişsəniz, yeni kod alacaqsınız."
              >
                <input
                  className="field-input font-mono text-lg tracking-[0.4em]"
                  value={code}
                  onChange={(event) =>
                    setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
                  }
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  required
                  pattern="[0-9]{6}"
                  placeholder="••••••"
                />
              </Field>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Parol" hint="Ən azı 8 simvol">
            <input
              type="password"
              className="field-input"
              value={form.password}
              onChange={(event) => update('password', event.target.value)}
              autoComplete="new-password"
              required
              minLength={8}
              placeholder="••••••••"
            />
          </Field>

          <Field label="Telefon" hint="Vacib deyil, max 20 simvol">
            <input
              className="field-input"
              value={form.phoneNumber}
              onChange={(event) => update('phoneNumber', event.target.value)}
              autoComplete="tel"
              placeholder="+994 50 123 45 67"
            />
          </Field>
        </div>

        <Button type="submit" size="lg" fullWidth loading={submitting}>
          Hesab yarat
          {!submitting && <span aria-hidden>→</span>}
        </Button>
      </form>
    </AuthShell>
  )
}