import { useCallback, useMemo, useState } from 'react'
import type { PropsWithChildren } from 'react'
import pokeballLoader from '../../../assets/pokeball-loader.gif'
import { LoadingScreenContext } from './loading-screen-context'
import './loading-screen.css'

const DEFAULT_LOADING_MESSAGE = 'Loading...'

export function LoadingScreenProvider({ children }: PropsWithChildren) {
  const [message, setMessage] = useState(DEFAULT_LOADING_MESSAGE)
  const [isVisible, setIsVisible] = useState(false)

  const showLoadingScreen = useCallback((nextMessage = DEFAULT_LOADING_MESSAGE) => {
    setMessage(nextMessage)
    setIsVisible(true)
  }, [])

  const hideLoadingScreen = useCallback(() => {
    setIsVisible(false)
  }, [])

  const value = useMemo(
    () => ({
      hideLoadingScreen,
      isLoadingScreenVisible: isVisible,
      showLoadingScreen,
    }),
    [hideLoadingScreen, isVisible, showLoadingScreen],
  )

  return (
    <LoadingScreenContext.Provider value={value}>
      {children}
      {isVisible ? (
        <div className="loading-screen" role="status" aria-live="polite">
          <img className="loading-screen__ball" src={pokeballLoader} alt="" />
          <p className="loading-screen__message">{message}</p>
        </div>
      ) : null}
    </LoadingScreenContext.Provider>
  )
}
