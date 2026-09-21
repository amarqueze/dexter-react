import { createContext } from 'react'

export type LoadingScreenContextValue = {
  hideLoadingScreen: () => void
  isLoadingScreenVisible: boolean
  showLoadingScreen: (message?: string) => void
}

export const LoadingScreenContext =
  createContext<LoadingScreenContextValue | null>(null)
