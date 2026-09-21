import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '../modules/home/pages/home-page'
import { LoginPage } from '../modules/login/pages/login-page'
import { NewTrainersPage } from '../modules/login/pages/newTrainers-page'
import { ProtectedRoute } from './protected-route'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/new-trainer" element={<NewTrainersPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}
