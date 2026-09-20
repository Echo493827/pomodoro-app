import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell
} from 'recharts'
import { useAuth } from '../context/AuthContext'
import { recipes } from '../data/recipes'
import {
  fetchSessions, minutesPerDay, currentStreak, weekSummary
} from '../lib/sessions'

function StatTile({ value, label, sub }) {
  return (
    <div className="stat-tile">
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
      {sub && <span className="stat-sub">{sub}</span>}
    </div>
  )
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null
  return (
    <div className="chart-tip">
      <span className="chart-tip-day">{label}</span>
      <span className="chart-tip-min">{payload[0].value} min</span>
    </div>
  )
}

export default function DashboardPage() {
  const { user, totalMinutes } = useAuth()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    if (!user) return
    fetchSessions(user.id).then((data) => {
      if (active) {
        setSessions(data)
        setLoading(false)
      }
    })
    return () => { active = false }
  }, [user])

  const daily = useMemo(() => minutesPerDay(sessions, 14), [sessions])
  const streak = useMemo(() => currentStreak(sessions), [sessions])
  const week = useMemo(() => weekSummary(sessions), [sessions])
  const unlockedCount = recipes.filter((r) => r.minutes <= totalMinutes).length

  const hours = Math.floor(totalMinutes / 60)
  const mins = totalMinutes % 60
  const peak = Math.max(1, ...daily.map((d) => d.minutes))

  if (loading) {
    return <div className="page dashboard-page"><div className="page-loading">Gathering your grounds…</div></div>
  }

  return (
    <div className="page dashboard-page">
      <h1 className="page-title">Your focus</h1>
      <p className="page-sub">A look at how your study time is brewing.</p>

      <div className="stat-grid">
        <StatTile value={hours > 0 ? `${hours}h ${mins}m` : `${mins}m`} label="Lifetime focus" />
        <StatTile value={streak} label="Day streak" sub={streak === 1 ? 'day' : 'days'} />
        <StatTile value={week.sessions} label="Sessions this week" sub={`${week.minutes} min`} />
        <StatTile value={`${unlockedCount}/${recipes.length}`} label="Recipes unlocked" />
      </div>

      <div className="chart-card">
        <h2 className="chart-title">Last 14 days</h2>
        {sessions.length === 0 ? (
          <p className="chart-empty">Finish a focus block and it will show up here.</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={daily} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="rgba(244,230,211,0.1)" />
              <XAxis
                dataKey="label" tick={{ fill: 'rgba(244,230,211,0.7)', fontSize: 12 }}
                axisLine={false} tickLine={false} interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fill: 'rgba(244,230,211,0.55)', fontSize: 12 }}
                axisLine={false} tickLine={false} width={40}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(244,230,211,0.06)' }} />
              <Bar dataKey="minutes" radius={[5, 5, 0, 0]} maxBarSize={26}>
                {daily.map((d) => (
                  <Cell key={d.date} fill={d.minutes >= peak ? '#D2691E' : '#8B4513'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}
