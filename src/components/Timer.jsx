import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CircularProgress from './CircularProgress'
import { useAuth } from '../context/AuthContext'
import { recipes } from '../data/recipes'
import { playChime } from '../lib/chime'

const PRESETS = [
  { label: 'Classic', study: 25, break: 5 },
  { label: 'Long', study: 50, break: 10 },
  { label: 'Deep', study: 90, break: 15 }
]

function format(totalSeconds) {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Timer() {
  const { user, totalMinutes, completeStudySession } = useAuth()

  const [studyMinutes, setStudyMinutes] = useState(25)
  const [breakMinutes, setBreakMinutes] = useState(5)
  const [phase, setPhase] = useState('idle') // idle | running | paused
  const [mode, setMode] = useState('study') // study | break
  const [secondsLeft, setSecondsLeft] = useState(25 * 60)
  const [message, setMessage] = useState('Set your time and press brew')
  const [unlocked, setUnlocked] = useState(null) // recipe just unlocked

  // refs the interval callback reads so it never runs on stale values
  const endTimeRef = useRef(0)
  const remainingRef = useRef(studyMinutes * 60 * 1000)
  const finishRef = useRef(() => {})
  const studyRef = useRef(studyMinutes)
  const breakRef = useRef(breakMinutes)
  const modeRef = useRef(mode)
  const totalRef = useRef(totalMinutes)

  useEffect(() => void (studyRef.current = studyMinutes), [studyMinutes])
  useEffect(() => void (breakRef.current = breakMinutes), [breakMinutes])
  useEffect(() => void (modeRef.current = mode), [mode])
  useEffect(() => void (totalRef.current = totalMinutes), [totalMinutes])

  // keep the idle display in sync when the study input changes
  useEffect(() => {
    if (phase === 'idle' && mode === 'study') {
      setSecondsLeft(studyMinutes * 60)
      remainingRef.current = studyMinutes * 60 * 1000
    }
  }, [studyMinutes, phase, mode])

  // what happens when a block hits zero
  const finishBlock = useCallback(async () => {
    playChime()

    if (modeRef.current === 'study') {
      // credit the finished study block
      const prevTotal = totalRef.current
      if (user) {
        const newTotal = await completeStudySession(studyRef.current)
        if (newTotal !== null) {
          const beforeIds = recipes.filter((r) => r.minutes <= prevTotal).map((r) => r.id)
          const newly = recipes.filter(
            (r) => r.minutes <= newTotal && !beforeIds.includes(r.id)
          )
          if (newly.length) setUnlocked(newly[newly.length - 1])
        }
        setMessage('Nice work. Break time.')
      } else {
        setMessage('Break time. Sign in to save progress.')
      }

      // roll straight into the break
      setMode('break')
      const ms = breakRef.current * 60 * 1000
      remainingRef.current = ms
      endTimeRef.current = Date.now() + ms
      setSecondsLeft(breakRef.current * 60)
      setPhase('running')
    } else {
      // break finished, back to a fresh study block
      setMode('study')
      remainingRef.current = studyRef.current * 60 * 1000
      setSecondsLeft(studyRef.current * 60)
      setPhase('idle')
      setMessage('Break over. Ready when you are.')
    }
  }, [user, completeStudySession])

  useEffect(() => void (finishRef.current = finishBlock), [finishBlock])

  // the tick loop only runs while the timer is running
  useEffect(() => {
    if (phase !== 'running') return
    const id = setInterval(() => {
      const remaining = endTimeRef.current - Date.now()
      if (remaining <= 0) {
        setSecondsLeft(0)
        finishRef.current()
      } else {
        setSecondsLeft(Math.ceil(remaining / 1000))
      }
    }, 250)
    return () => clearInterval(id)
  }, [phase])

  // auto-dismiss the unlock card
  useEffect(() => {
    if (!unlocked) return
    const t = setTimeout(() => setUnlocked(null), 6000)
    return () => clearTimeout(t)
  }, [unlocked])

  function start() {
    if (phase === 'running') return
    if (phase === 'idle') {
      remainingRef.current = (mode === 'study' ? studyMinutes : breakMinutes) * 60 * 1000
    }
    endTimeRef.current = Date.now() + remainingRef.current
    setPhase('running')
    setMessage(mode === 'study' ? 'Brewing focus…' : 'On a break')
  }

  function pause() {
    if (phase !== 'running') return
    remainingRef.current = Math.max(0, endTimeRef.current - Date.now())
    setPhase('paused')
    setMessage('Paused')
  }

  function reset() {
    setPhase('idle')
    setMode('study')
    remainingRef.current = studyMinutes * 60 * 1000
    setSecondsLeft(studyMinutes * 60)
    setMessage('Set your time and press brew')
  }

  function applyPreset(p) {
    if (phase === 'running') return
    setStudyMinutes(p.study)
    setBreakMinutes(p.break)
    setMode('study')
    setPhase('idle')
    setSecondsLeft(p.study * 60)
    remainingRef.current = p.study * 60 * 1000
  }

  const blockSeconds = (mode === 'study' ? studyMinutes : breakMinutes) * 60
  const progress = blockSeconds > 0 ? 1 - secondsLeft / blockSeconds : 0
  const editable = phase === 'idle'

  return (
    <section className={`timer mode-${mode}`}>
      <p className="timer-message" aria-live="polite">{message}</p>

      <CircularProgress progress={progress} mode={mode}>
        <span className="timer-mode-label">{mode === 'study' ? 'Focus' : 'Break'}</span>
        <span className="timer-digits">{format(secondsLeft)}</span>
        <span className="timer-total">{totalMinutes} min brewed</span>
      </CircularProgress>

      <div className="presets" role="group" aria-label="Timer presets">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            className={`preset${studyMinutes === p.study && breakMinutes === p.break ? ' active' : ''}`}
            onClick={() => applyPreset(p)}
            disabled={!editable}
          >
            {p.label} <span className="preset-detail">{p.study}/{p.break}</span>
          </button>
        ))}
      </div>

      <div className="time-inputs">
        <label>
          <span>Focus</span>
          <input
            type="number" min="1" max="120" value={studyMinutes}
            onChange={(e) => setStudyMinutes(Math.min(120, Math.max(1, Number(e.target.value) || 1)))}
            disabled={!editable}
          />
        </label>
        <label>
          <span>Break</span>
          <input
            type="number" min="1" max="30" value={breakMinutes}
            onChange={(e) => setBreakMinutes(Math.min(30, Math.max(1, Number(e.target.value) || 1)))}
            disabled={!editable}
          />
        </label>
      </div>

      <div className="controls">
        {phase !== 'running' ? (
          <button className="btn btn-primary" onClick={start}>
            {phase === 'paused' ? 'Resume' : 'Brew'}
          </button>
        ) : (
          <button className="btn btn-primary" onClick={pause}>Pause</button>
        )}
        <button className="btn btn-ghost" onClick={reset}>Reset</button>
      </div>

      {!user && (
        <p className="signin-hint">
          <Link to="/auth">Sign in</Link> to save your focus time and unlock recipes.
        </p>
      )}

      {unlocked && (
        <div className="unlock-card" role="status">
          <span className="unlock-eyebrow">Recipe unlocked</span>
          <span className="unlock-name">{unlocked.name}</span>
          <span className="unlock-tag">{unlocked.tagline}</span>
          <Link className="unlock-link" to="/recipes">See it in your menu</Link>
        </div>
      )}
    </section>
  )
}
