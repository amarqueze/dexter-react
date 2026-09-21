import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useLoadingScreen } from '../../../shared/components'
import { z } from 'zod'
import {
  EyeIcon,
  LockIcon,
  MailIcon,
  PokeScenery,
  useToast,
} from '../../../shared/components'
import superBall from '../../../assets/super_Ball.png'
import { useLogin } from '../hooks/use-login'
import type { LoginCredentials } from '../login.type'
import '../login.css'
import { useAuth } from '../hooks/use-auth'

const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Enter your email.')
    .email('Enter a valid email.'),
  password: z.string().min(1, 'Enter your password.'),
  rememberMe: z.boolean(),
}) satisfies z.ZodType<LoginCredentials>

const initialValues: LoginCredentials = {
  email: '',
  password: '',
  rememberMe: false,
}

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const { error, isLoading, login } = useLogin()
  const { showLoadingScreen, isLoadingScreenVisible, hideLoadingScreen } = useLoadingScreen()
  const { showToast } = useToast()
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
    showLoadingScreen('Signing in...');
    const response = await login(values);
    await new Promise((resolve) => setTimeout(resolve, 3000)) // Simulate a delay for better UX
    hideLoadingScreen();

    if (response) {
      navigate('/home', { replace: true });
    }
  }

  useEffect(() => {
    if (error && !isLoadingScreenVisible) {
      showToast({
        title: 'Failed to sign in',
        message: error,
        duration: 3000,
        variant: 'error',
      })
    }
  }, [error, isLoadingScreenVisible, showToast])

  if (isAuthenticated && !isLoadingScreenVisible) {
    return <Navigate to="/home" replace />
  }

  return (
    <main className="auth-page">
      <section className="auth-panel" aria-labelledby="login-title">
        <div className="auth-brand">
          <img className="auth-logo" src={superBall} alt="" />
          <p className="auth-name">DEXTER</p>
          <p className="auth-tagline">Explore. Catch. Discover.</p>
        </div>

        <form className="auth-card auth-form" onSubmit={handleSubmit(handleLoginSubmit)}>
          <div className="auth-card__header">
            <h1 id="login-title">Sign in</h1>
            <p>Welcome back, trainer</p>
          </div>

          <div className={`textbox ${errors.email ? 'textbox--invalid' : ''}`}>
            <span className="textbox__icon" aria-hidden="true">
              <MailIcon />
            </span>
            <input
              className="textbox__control"
              id="login-email"
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
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              aria-label="Password"
              autoComplete="current-password"
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

          <div className="auth-row">
            <label className="auth-check">
              <input
                type="checkbox"
                {...register('rememberMe')}
              />
              <span>Remember me</span>
            </label>
          </div>

          <button className="button button--primary button--block" type="submit" disabled={isBusy}>
            {isBusy ? 'Signing in...' : 'Sign in'}
          </button>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link className="auth-link" to="/new-trainer">
              Register
            </Link>
          </p>
        </form>
      </section>

      <PokeScenery />
    </main>
  )
}
