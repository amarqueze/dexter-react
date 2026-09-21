import { createContext } from 'react'
import type { LoginResponse, LoginUser } from '../login.type'

export type AuthContextValue = {
  isAuthenticated: boolean
  login: (session: LoginResponse, rememberMe: boolean) => void
  logout: () => void
  token: string | null
  user: LoginUser | null
}

export const AuthContext = createContext<AuthContextValue | null>(null)
