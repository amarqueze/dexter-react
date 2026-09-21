import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import superBall from '../../../assets/super_Ball.png'
import { useCreateTrainer } from '../hooks/use-create-trainer'
import { newTrainerSchema } from '../login.type'
import type { NewTrainerFormValues } from '../login.type'
import '../login.css'

const initialValues: NewTrainerFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
}

export function NewTrainersPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const navigate = useNavigate()
  const { createTrainer, error, isLoading } = useCreateTrainer()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NewTrainerFormValues>({
    defaultValues: initialValues,
    resolver: zodResolver(newTrainerSchema),
  })
  const isBusy = isSubmitting || isLoading

  async function handleCreateTrainerSubmit(values: NewTrainerFormValues) {
    const createdTrainer = await createTrainer(values)

    if (createdTrainer) {
      navigate('/login', { replace: true })
    }
  }

  return (
    <main className="auth-page">
      
      <section className="auth-panel" aria-labelledby="new-trainer-title">
        <div className="auth-brand">
          <img className="auth-logo" src={superBall} alt="" />
          <p className="auth-name">DEXTER</p>
          <p className="auth-tagline">Explora. Captura. Conoce.</p>
        </div>

        <form
          className="auth-card auth-form auth-card--wide"
          onSubmit={handleSubmit(handleCreateTrainerSubmit)}
        >
          <div className="auth-card__header">
            <h1 id="new-trainer-title">Crear cuenta</h1>
            <p>Unete a la comunidad de entrenadores</p>
          </div>

          <div className="auth-grid">
            <div className={`textbox ${errors.firstName ? 'textbox--invalid' : ''}`}>
              <span className="textbox__icon" aria-hidden="true">
                <UserIcon />
              </span>
              <input
                className="textbox__control"
                id="trainer-first-name"
                name="firstName"
                type="text"
                aria-label="Nombre"
                autoComplete="given-name"
                placeholder="Nombre"
                {...register('firstName')}
              />
            </div>

            <div className={`textbox ${errors.lastName ? 'textbox--invalid' : ''}`}>
              <input
                className="textbox__control"
                id="trainer-last-name"
                name="lastName"
                type="text"
                aria-label="Apellido"
                autoComplete="family-name"
                placeholder="Apellido"
                {...register('lastName')}
              />
            </div>
          </div>
          {errors.firstName ? (
            <p className="field__error">{errors.firstName.message}</p>
          ) : null}
          {errors.lastName ? (
            <p className="field__error">{errors.lastName.message}</p>
          ) : null}

          <div className={`textbox ${errors.email ? 'textbox--invalid' : ''}`}>
            <span className="textbox__icon" aria-hidden="true">
              <MailIcon />
            </span>
            <input
              className="textbox__control"
              id="trainer-email"
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
              id="trainer-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              aria-label="Contrasena"
              autoComplete="new-password"
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

          <div className={`textbox ${errors.confirmPassword ? 'textbox--invalid' : ''}`}>
            <span className="textbox__icon" aria-hidden="true">
              <LockIcon />
            </span>
            <input
              className="textbox__control"
              id="trainer-confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              aria-label="Confirmar contrasena"
              autoComplete="new-password"
              placeholder="Confirmar contrasena"
              {...register('confirmPassword')}
            />
            <button
              className="textbox__action"
              type="button"
              aria-label={
                showConfirmPassword ? 'Ocultar contrasena' : 'Mostrar contrasena'
              }
              onClick={() =>
                setShowConfirmPassword((currentValue) => !currentValue)
              }
            >
              <EyeIcon />
            </button>
          </div>
          {errors.confirmPassword ? (
            <p className="field__error">{errors.confirmPassword.message}</p>
          ) : null}

          <label className="auth-check">
            <input
              type="checkbox"
              {...register('acceptedTerms')}
            />
            <span>
              Acepto los <Link className="auth-link" to="/new-trainer">Terminos</Link> y
              la <Link className="auth-link" to="/new-trainer">Politica</Link>
            </span>
          </label>
          {errors.acceptedTerms ? (
            <p className="field__error">{errors.acceptedTerms.message}</p>
          ) : null}

          {error ? <p className="field__error">{error}</p> : null}

          <button className="button button--primary button--block" type="submit" disabled={isBusy}>
            {isBusy ? 'Creando...' : 'Crear cuenta'}
          </button>

          <p className="auth-switch">
            Ya tienes una cuenta?{' '}
            <Link className="auth-link" to="/login">
              Inicia sesion
            </Link>
          </p>
        </form>
      </section>

      <AuthScenery />
    </main>
  )
}

function UserIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </svg>
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
