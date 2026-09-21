import { useState } from 'react'
import { loginApi } from '../api/login.api'
import type { LoginCredentials, LoginResponse } from '../login.type'
import { useAuth } from './use-auth'

export function useLogin() {
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const { login: authLogin } = useAuth()

  async function login(credentials: LoginCredentials) {
    setIsLoading(true)
    setError(null)

    try {
      const response: LoginResponse = await loginApi(credentials)
      authLogin(response, credentials.rememberMe)
      return response
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Could not sign in.',
      )
      console.error('Login error:', error);
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    error,
    isLoading,
    login
  }
}
