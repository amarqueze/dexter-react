import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import superBall from '../../../assets/super_Ball.png'
import { useAuth } from '../hooks/use-auth'
import { loginSchema } from '../login.type'
import type { LoginCredentials } from '../login.type'
import '../login.css'

const initialValues: LoginCredentials = {
  email: '',
  password: '',
  rememberMe: false,
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { error, isAuthenticated, isLoading, login, user } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginCredentials>({
    defaultValues: initialValues,
    resolver: zodResolver(loginSchema),
  })
  const isBusy = isSubmitting || isLoading

  async function handleLoginSubmit(values: LoginCredentials) {
    const response = await login(values)

    if (response) {
      navigate('/home', { replace: true })
    }
  }

  if (isAuthenticated) {
    return <Navigate to="/home" replace />
  }

  return (
    <main className="auth-page">

      <section className="auth-panel" aria-labelledby="login-title">
        <div className="auth-brand">
          <img className="auth-logo" src={superBall} alt="" />
          <p className="auth-name">DEXTER</p>
          <p className="auth-tagline">Explora. Captura. Conoce.</p>
        </div>

        <form className="auth-card auth-form" onSubmit={handleSubmit(handleLoginSubmit)}>
          <div className="auth-card__header">
            <h1 id="login-title">Iniciar sesion</h1>
            <p>Bienvenido de nuevo, entrenador</p>
          </div>

          <div className={`textbox ${errors.email ? 'textbox--invalid' : ''}`}>
            <span className="textbox__icon" aria-hidden="true">
              <MailIcon />
            </span>
            <input
              className="textbox__control"
              id="login-email"
              name="email"
              type="email"
              aria-label="Correo electronico"
              autoComplete="email"
              placeholder="Correo electronico"
              {...register('email')}
            />
          </div>
          {errors.email ? (
            <p className="field__error">{errors.email.message}</p>
          ) : null}

          <div className={`textbox ${errors.password ? 'textbox--invalid' : ''}`}>
            <span className="textbox__icon" aria-hidden="true">
              <LockIcon />
            </span>
            <input
              className="textbox__control"
              id="login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              aria-label="Contrasena"
              autoComplete="current-password"
              placeholder="Contrasena"
              {...register('password')}
            />
            <button
              className="textbox__action"
              type="button"
              aria-label={showPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'}
              onClick={() => setShowPassword((currentValue) => !currentValue)}
            >
              <EyeIcon />
            </button>
          </div>
          {errors.password ? (
            <p className="field__error">{errors.password.message}</p>
          ) : null}

          <div className="auth-row">
            <label className="auth-check">
              <input
                type="checkbox"
                {...register('rememberMe')}
              />
              <span>Recordarme</span>
            </label>
            <Link className="auth-link" to="/login">
              Olvidaste tu contrasena?
            </Link>
          </div>

          {error ? <p className="field__error">{error}</p> : null}
          {user ? <p className="field__hint">Hola, {user.name}.</p> : null}

          <button className="button button--primary button--block" type="submit" disabled={isBusy}>
            {isBusy ? 'Ingresando...' : 'Iniciar sesion'}
          </button>

          <p className="auth-switch">
            No tienes una cuenta?{' '}
            <Link className="auth-link" to="/new-trainer">
              Registrate
            </Link>
          </p>
        </form>
      </section>

      <AuthScenery />
    </main>
  )
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h16v12H4z" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 10h10v10H7z" />
      <path d="M9 10V7a3 3 0 0 1 6 0v3" />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
      <path d="M12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6Z" />
    </svg>
  )
}

function AuthScenery() {
  return (
    <div className="auth-scenery" aria-hidden="true">
      <div className="auth-mascot"></div>
      <div className="auth-signpost">
        <span>KANTO</span>
        <span>JOHTO</span>
        <span>HOENN</span>
        <span>PALDEA</span>
      </div>
    </div>
  )
}
