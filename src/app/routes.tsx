import { Routes, Route } from 'react-router-dom'
import { LoginPage } from '../features/auth/LoginPage'
import DashboardPage from '../features/leave/DashboardPage'
import NotFoundPage from '../components/NotFoundPage'
import LeaveRequestFormPage from '../features/leave/LeaveRequestFormPage'
import ViewRequestsPage from '../features/leave/ViewRequestsPage'
import CreateUserPage from '../features/admin/CreateuserPage'
import dashboardLoader from '../features/leave/DashboardPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} loader={dashboardLoader} />
      <Route path="/request-leave" element={<LeaveRequestFormPage />} />
      <Route path="/view-requests" element={<ViewRequestsPage />} />
      <Route path="/create-user" element={<CreateUserPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
