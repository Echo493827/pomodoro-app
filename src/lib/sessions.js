import { supabase } from '../supabaseClient'

// record one completed study block and bump the lifetime total.
// returns the new lifetime total (or null on failure).
export async function logStudySession(userId, minutes) {
  // insert the session row that the dashboard reads
  const { error: insertError } = await supabase
    .from('sessions')
    .insert({ user_id: userId, duration_minutes: minutes, kind: 'study' })

  if (insertError) {
    console.error('could not log session:', insertError.message)
    return null
  }

  // add minutes atomically via the sql function in schema.sql
  const { data, error: rpcError } = await supabase.rpc('add_study_minutes', {
    minutes_to_add: minutes
  })

  if (rpcError) {
    console.error('could not add minutes:', rpcError.message)
    return null
  }
  return data
}

// pull every session for the signed-in user, newest first.
export async function fetchSessions(userId) {
  const { data, error } = await supabase
    .from('sessions')
    .select('duration_minutes, kind, completed_at')
    .eq('user_id', userId)
    .eq('kind', 'study')
    .order('completed_at', { ascending: false })

  if (error) {
    console.error('could not fetch sessions:', error.message)
    return []
  }
  return data || []
}

// ----- pure helpers the dashboard uses to shape session data -----

// local yyyy-mm-dd key for grouping by day in the user's timezone
function dayKey(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// minutes studied per day for the last `days` days, oldest first
export function minutesPerDay(sessions, days = 14) {
  const buckets = new Map()
  const today = new Date()

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    buckets.set(dayKey(d), 0)
  }

  sessions.forEach((s) => {
    const key = dayKey(new Date(s.completed_at))
    if (buckets.has(key)) {
      buckets.set(key, buckets.get(key) + s.duration_minutes)
    }
  })

  return Array.from(buckets, ([date, minutes]) => {
    const label = new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    })
    return { date, label, minutes }
  })
}

// count of consecutive days up to today with at least one study session
export function currentStreak(sessions) {
  const studiedDays = new Set(sessions.map((s) => dayKey(new Date(s.completed_at))))
  let streak = 0
  const cursor = new Date()

  // if nothing today yet, a streak can still count from yesterday
  if (!studiedDays.has(dayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }
  while (studiedDays.has(dayKey(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

// sessions and minutes within the last 7 days
export function weekSummary(sessions) {
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 6)
  cutoff.setHours(0, 0, 0, 0)

  const recent = sessions.filter((s) => new Date(s.completed_at) >= cutoff)
  const minutes = recent.reduce((sum, s) => sum + s.duration_minutes, 0)
  return { sessions: recent.length, minutes }
}
