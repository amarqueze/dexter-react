import { useState } from 'react'
import type { PropsWithChildren } from 'react'
import type { LoginResponse, LoginUser } from '../login.type'
import { AuthContext } from './auth-context'

const AUTH_STORAGE_KEY = 'dexter.auth'

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<LoginResponse | null>(getStoredSession)

  function login(authenticatedSession: LoginResponse, rememberMe: boolean) {
    setSession(authenticatedSession)
    saveStoredSession(authenticatedSession, rememberMe)
  }

  function logout() {
    setSession(null)
    removeStoredSession()
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(session?.user),
        login,
        logout,
        token: session?.token ?? null,
        user: session?.user ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

function getStoredSession(): LoginResponse | null {
  if (typeof window === 'undefined') {
    return null
  }

  const storedValue =
    window.localStorage.getItem(AUTH_STORAGE_KEY) ??
    window.sessionStorage.getItem(AUTH_STORAGE_KEY)

  if (!storedValue) {
    return null
  }

  try {
    const parsedValue: unknown = JSON.parse(storedValue)
    return isLoginResponse(parsedValue) ? parsedValue : null
  } catch {
    return null
  }
}

function saveStoredSession(session: LoginResponse, rememberMe: boolean) {
  if (typeof window === 'undefined') {
    return
  }

  const storage = rememberMe ? window.localStorage : window.sessionStorage
  const otherStorage = rememberMe ? window.sessionStorage : window.localStorage

  storage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session))
  otherStorage.removeItem(AUTH_STORAGE_KEY)
}

function removeStoredSession() {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY)
  window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
}

function isLoginResponse(value: unknown): value is LoginResponse {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const session = value as Partial<LoginResponse>

  return typeof session.token === 'string' && isLoginUser(session.user)
}

function isLoginUser(value: unknown): value is LoginUser {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const user = value as Partial<LoginUser>

  return (
    typeof user.id === 'string' &&
    typeof user.name === 'string' &&
    typeof user.email === 'string'
  )
}
