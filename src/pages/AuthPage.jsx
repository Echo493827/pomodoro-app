import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { supabase, isSupabaseConfigured } from '../supabaseClient'
import { useAuth } from '../context/AuthContext'

export default function AuthPage() {
  const { user, loading } = useAuth()
  const [mode, setMode] = useState('signin') // signin | signup
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState(null) // { type, text }
  const [busy, setBusy] = useState(false)

  if (!loading && user) return <Navigate to="/" replace />

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus(null)
    setBusy(true)

    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { display_name: displayName || email.split('@')[0] } }
        })
        if (error) throw error
        setStatus({ type: 'ok', text: 'Check your email to confirm your account, then sign in.' })
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        // auth listener will redirect once the session lands
      }
    } catch (err) {
      setStatus({ type: 'error', text: err.message })
    } finally {
      setBusy(false)
    }
  }

  async function handleGoogle() {
    setStatus(null)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) setStatus({ type: 'error', text: error.message })
  }

  return (
    <div className="page auth-page">
      <div className="auth-card">
        <h1 className="auth-title">{mode === 'signin' ? 'Welcome back' : 'Pull up a chair'}</h1>
        <p className="auth-sub">
          {mode === 'signin'
            ? 'Sign in to pick up your focus streak.'
            : 'Create an account to save time and unlock recipes.'}
        </p>

        {!isSupabaseConfigured && (
          <div className="setup-notice">
            Accounts need Supabase keys in <code>.env.local</code>. See the README.
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'signup' && (
            <label className="field">
              <span>Display name</span>
              <input
                type="text" value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Barista" autoComplete="nickname"
              />
            </label>
          )}
          <label className="field">
            <span>Email</span>
            <input
              type="email" required value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </label>
          <label className="field">
            <span>Password</span>
            <input
              type="password" required minLength={6} value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </label>

          <button className="btn btn-primary btn-full" disabled={busy || !isSupabaseConfigured}>
            {busy ? 'One moment…' : mode === 'signin' ? 'Sign in' : 'Create account'}
          </button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <button className="btn btn-google" onClick={handleGoogle} disabled={!isSupabaseConfigured}>
          Continue with Google
        </button>

        {status && (
          <p className={`auth-status ${status.type}`}>{status.text}</p>
        )}

        <button className="auth-switch" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setStatus(null) }}>
          {mode === 'signin' ? 'New here? Create an account' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
