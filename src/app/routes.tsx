import { Routes, Route } from 'react-router-dom'
import LoginPage from '../features/auth/LoginPage'
import DashboardPage from '../features/leave/DashboardPage'
import NotFoundPage from '../components/NotFoundPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
