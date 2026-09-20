import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Nav() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="nav">
      <NavLink to="/" className="brand">
        <span className="brand-cup" aria-hidden="true">☕</span>
        <span className="brand-name">Cafe Pomodoro</span>
      </NavLink>

      <nav className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
          Timer
        </NavLink>
        <NavLink to="/recipes" className={({ isActive }) => (isActive ? 'active' : '')}>
          Recipes
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => (isActive ? 'active' : '')}>
          Dashboard
        </NavLink>
        {user ? (
          <button className="nav-auth" onClick={handleSignOut}>Sign out</button>
        ) : (
          <NavLink to="/auth" className="nav-auth">Sign in</NavLink>
        )}
      </nav>
    </header>
  )
}
