import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { PropsWithChildren } from 'react'
import { ToastContext } from './toast-context'
import type { ToastItem, ToastOptions } from './toast-context'
import './toast.css'

const DEFAULT_TOAST_TITLE = ''
const DEFAULT_TOAST_VARIANT = 'info'

export function ToastProvider({ children }: PropsWithChildren) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timersRef = useRef<Map<string, number>>(new Map())

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id)

    if (timer) {
      window.clearTimeout(timer)
      timersRef.current.delete(id)
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id),
    )
  }, [])

  const showToast = useCallback(
    (options: ToastOptions) => {
      const id = createToastId()
      const toast: ToastItem = {
        id,
        duration: options.duration,
        message: options.message,
        title: options.title ?? DEFAULT_TOAST_TITLE,
        variant: options.variant ?? DEFAULT_TOAST_VARIANT,
      }

      setToasts((currentToasts) => [...currentToasts, toast])

      if (toast.duration > 0) {
        const timer = window.setTimeout(() => {
          dismissToast(id)
        }, toast.duration)

        timersRef.current.set(id, timer)
      }

      return id
    },
    [dismissToast],
  )

  useEffect(() => {
    const timers = timersRef.current

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const value = useMemo(
    () => ({
      dismissToast,
      showToast,
    }),
    [dismissToast, showToast],
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-viewport" role="region" aria-label="Notifications">
        {toasts.map((toast) => (
          <div
            className={`toast toast--${toast.variant}`}
            key={toast.id}
            role="status"
          >
            <div className="toast__content">
              {toast.title ? <p className="toast__title">{toast.title}</p> : null}
              <p className="toast__message">{toast.message}</p>
            </div>
            <button
              className="toast__close"
              type="button"
              aria-label="Dismiss notification"
              onClick={() => dismissToast(toast.id)}
            >
              x
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function createToastId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }

  return `toast-${Date.now()}-${Math.random().toString(16).slice(2)}`
}
