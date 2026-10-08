import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ApiError } from '../lib/api'
import AuthShell from '../components/AuthShell'
import { Alert, Button, Field } from '../components/ui'

export default function LoginPage() {
  const { login, user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const from = (location.state as { from?: string } | null)?.from

  if (user) {
    return <Navigate to={from ?? '/'} replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await login({ username: username.trim(), password })
      navigate(from ?? '/', { replace: true })
    } catch (cause) {
      setError(cause instanceof ApiError ? cause.message : 'Giriş alınmadı')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthShell
      kicker="Giriş"
      title="Hesabınıza daxil olun"
      subtitle="Elanlarınızı və kömək axınınızı buradan izləyin."
      footer={
        <>
          Hesabınız yoxdur?{' '}
          <Link to="/register" className="font-semibold text-brand-700 hover:text-brand-800">
            Qeydiyyatdan keçin
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <Alert tone="error">{error}</Alert>}

        <Field label="Email və ya istifadəçi adı">
          <input
            className="field-input"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            autoFocus
            required
            placeholder="email və ya istifadəçi adı"
          />
        </Field>

        <Field label="Parol">
          <input
            type="password"
            className="field-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
            placeholder="••••••••"
          />
        </Field>

        <Button type="submit" size="lg" fullWidth loading={submitting}>
          Daxil ol
          {!submitting && <span aria-hidden>→</span>}
        </Button>
      </form>
    </AuthShell>
  )
}