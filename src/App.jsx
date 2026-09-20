import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import BackgroundLayer from './components/BackgroundLayer'
import MusicController from './components/MusicController'
import AmbianceDock from './components/AmbianceDock'
import ProtectedRoute from './components/ProtectedRoute'
import TimerPage from './pages/TimerPage'
import RecipesPage from './pages/RecipesPage'
import AuthPage from './pages/AuthPage'

// the dashboard pulls in the chart library, so load it only when visited
const DashboardPage = lazy(() => import('./pages/DashboardPage'))

export default function App() {
  return (
    <>
      <BackgroundLayer />
      <MusicController />

      <div className="shell">
        <Nav />
        <main className="content">
          <Routes>
            <Route path="/" element={<TimerPage />} />
            <Route path="/recipes" element={<RecipesPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<div className="page-loading">Gathering your grounds…</div>}>
                    <DashboardPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <AmbianceDock />
    </>
  )
}
