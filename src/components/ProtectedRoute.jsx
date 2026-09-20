import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// wraps pages that need a signed-in user (the dashboard).
export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div className="page-loading">Warming up…</div>
  }
  if (!user) {
    return <Navigate to="/auth" replace />
  }
  return children
}
