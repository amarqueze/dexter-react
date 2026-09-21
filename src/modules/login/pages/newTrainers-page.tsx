import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import {
  EyeIcon,
  LockIcon,
  MailIcon,
  PokeScenery,
  UserIcon,
  useLoadingScreen,
  useToast,
} from '../../../shared/components'
import superBall from '../../../assets/super_Ball.png'
import { useCreateTrainer } from '../hooks/use-create-trainer'
import type { NewTrainerFormValues } from '../login.type'
import '../login.css'

const newTrainerSchema = z
  .object({
    firstName: z.string().trim().min(1, 'Enter your first name.'),
    lastName: z.string().trim().min(1, 'Enter your last name.'),
    email: z
      .string()
      .trim()
      .min(1, 'Enter your email.')
      .email('Enter a valid email.'),
    password: z
      .string()
      .min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(1, 'Confirm your password.'),
    acceptedTerms: z
      .boolean()
      .refine((acceptedTerms) => acceptedTerms, {
        message: 'You must accept the terms and privacy policy.',
      }),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  }) satisfies z.ZodType<NewTrainerFormValues>

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
  const { showToast } = useToast()
  const { showLoadingScreen, hideLoadingScreen } = useLoadingScreen()
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
    showLoadingScreen('Creating trainer...')
    const createdTrainer = await createTrainer(values)
    await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulate a delay for better UX
    hideLoadingScreen()

    if (error) {
      showToast({
        title: 'Failed to create trainer',
        message: error,
        duration: 3000,
        variant: 'error',
      })
    }

    if (createdTrainer) {
      showToast({
        message: 'Trainer created, please login with your new account.',
        duration: 3000,
        variant: 'success',
      })
      navigate('/login', { replace: true })
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="new-trainer-title">
        <div className="auth-brand">
          <img className="auth-logo" src={superBall} alt="" />
          <p className="auth-name">DEXTER</p>
          <p className="auth-tagline">Explore. Catch. Discover.</p>
        </div>

        <form
          className="auth-card auth-form auth-card--wide"
          onSubmit={handleSubmit(handleCreateTrainerSubmit)}
        >
          <div className="auth-card__header">
            <h1 id="new-trainer-title">Create account</h1>
            <p>Join the trainer community</p>
          </div>

          <div className="auth-grid">
            <div className={`textbox ${errors.firstName ? 'textbox--invalid' : ''}`}>
              <span className="textbox__icon" aria-hidden="true">
                <UserIcon />
              </span>
              <input
                className="textbox__control"
                id="trainer-first-name"
                type="text"
                aria-label="First name"
                autoComplete="given-name"
                placeholder="First name"
                {...register('firstName')}
              />
            </div>

            <div className={`textbox ${errors.lastName ? 'textbox--invalid' : ''}`}>
              <input
                className="textbox__control"
                id="trainer-last-name"
                type="text"
                aria-label="Last name"
                autoComplete="family-name"
                placeholder="Last name"
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
              type="email"
              aria-label="Email"
              autoComplete="email"
              placeholder="Email"
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
              type={showPassword ? 'text' : 'password'}
              aria-label="Password"
              autoComplete="new-password"
              placeholder="Password"
              {...register('password')}
            />
            <button
              className="textbox__action"
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
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
              type={showConfirmPassword ? 'text' : 'password'}
              aria-label="Confirm password"
              autoComplete="new-password"
              placeholder="Confirm password"
              {...register('confirmPassword')}
            />
            <button
              className="textbox__action"
              type="button"
              aria-label={
                showConfirmPassword ? 'Hide password' : 'Show password'
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
              I accept the <Link className="auth-link" to="/new-trainer">Terms</Link> and
              the <Link className="auth-link" to="/new-trainer">Privacy Policy</Link>
            </span>
          </label>
          {errors.acceptedTerms ? (
            <p className="field__error">{errors.acceptedTerms.message}</p>
          ) : null}

          {error ? <p className="field__error">{error}</p> : null}

          <button className="button button--primary button--block" type="submit" disabled={isBusy}>
            {isBusy ? 'Creating...' : 'Create account'}
          </button>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link className="auth-link" to="/login">
              Sign in
            </Link>
          </p>
        </form>
      </section>

      <PokeScenery />
    </main>
  )
}
