import { useState } from 'react'
import { loginApi } from '../api/login.api'
import type { LoginCredentials, LoginResponse } from '../login.type'

export function useLogin() {
  const [data, setData] = useState<LoginResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function login(credentials: LoginCredentials) {
    setIsLoading(true)
    setError(null)

    try {
      const response = await loginApi(credentials)
      setData(response)
      return response
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'No se pudo iniciar sesion.',
      )
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    data,
    error,
    isLoading,
    login,
  }
}
