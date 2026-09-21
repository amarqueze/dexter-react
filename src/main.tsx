import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './modules/login/hooks/auth-provider'
import { LoadingScreenProvider, ToastProvider } from './shared/components'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <LoadingScreenProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </LoadingScreenProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
