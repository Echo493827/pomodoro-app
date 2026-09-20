import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { supabase, isSupabaseConfigured } from '../supabaseClient'
import { logStudySession } from '../lib/sessions'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // load the profile row (holds total_study_minutes)
  const loadProfile = useCallback(async (uid) => {
    if (!uid) {
      setProfile(null)
      return
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('display_name, total_study_minutes')
      .eq('id', uid)
      .single()

    if (error) {
      console.error('could not load profile:', error.message)
      setProfile(null)
    } else {
      setProfile(data)
    }
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setLoading(false)
      return
    }

    // get the current session on first load
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      loadProfile(session?.user?.id).finally(() => setLoading(false))
    })

    // react to sign in / sign out across tabs
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      loadProfile(session?.user?.id)
    })

    return () => listener.subscription.unsubscribe()
  }, [loadProfile])

  const refreshProfile = useCallback(() => loadProfile(user?.id), [loadProfile, user])

  const signOut = useCallback(async () => {
    await supabase.auth.signOut()
    setProfile(null)
  }, [])

  // called by the timer when a study block finishes. logs the block and
  // optimistically updates the local minute total so unlocks feel instant.
  const completeStudySession = useCallback(
    async (minutes) => {
      if (!user) return null
      const newTotal = await logStudySession(user.id, minutes)
      if (newTotal !== null) {
        setProfile((prev) => ({ ...(prev || {}), total_study_minutes: newTotal }))
      }
      return newTotal
    },
    [user]
  )

  const value = {
    user,
    profile,
    loading,
    totalMinutes: profile?.total_study_minutes ?? 0,
    refreshProfile,
    signOut,
    completeStudySession,
    isConfigured: isSupabaseConfigured
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
