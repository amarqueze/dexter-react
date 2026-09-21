import { createContext } from 'react'
import type { LoginCredentials, LoginResponse, LoginUser } from '../login.type'

export type AuthContextValue = {
  error: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<LoginResponse | null>
  logout: () => void
  token: string | null
  user: LoginUser | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)
