import { createContext } from 'react'

export type ToastVariant = 'info' | 'success' | 'error'

export type ToastOptions = {
  message: string
  duration: number
  title?: string
  variant?: ToastVariant
}

export type ToastItem = Required<ToastOptions> & {
  id: string
}

export type ToastContextValue = {
  dismissToast: (id: string) => void
  showToast: (options: ToastOptions) => string
}

export const ToastContext = createContext<ToastContextValue | null>(null)
