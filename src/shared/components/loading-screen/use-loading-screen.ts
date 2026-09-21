import { useContext } from 'react'
import { LoadingScreenContext } from './loading-screen-context'

export function useLoadingScreen() {
  const context = useContext(LoadingScreenContext)

  if (!context) {
    throw new Error('useLoadingScreen must be used inside LoadingScreenProvider.')
  }

  return context
}
