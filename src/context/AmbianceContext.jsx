import { createContext, useContext, useEffect, useState } from 'react'
import { defaultBackgroundId } from '../data/backgrounds'

const AmbianceContext = createContext(null)

// tiny localStorage helpers so preferences survive reloads
function readStored(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v === null ? fallback : v
  } catch {
    return fallback
  }
}

export function AmbianceProvider({ children }) {
  const [backgroundId, setBackgroundId] = useState(() =>
    readStored('cp.backgroundId', defaultBackgroundId)
  )
  const [activeStreamId, setActiveStreamId] = useState(() =>
    readStored('cp.streamId', '')
  )
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(() => Number(readStored('cp.volume', '55')))

  useEffect(() => {
    try {
      localStorage.setItem('cp.backgroundId', backgroundId)
    } catch {}
  }, [backgroundId])

  useEffect(() => {
    try {
      localStorage.setItem('cp.streamId', activeStreamId)
    } catch {}
  }, [activeStreamId])

  useEffect(() => {
    try {
      localStorage.setItem('cp.volume', String(volume))
    } catch {}
  }, [volume])

  // choosing a station starts it; choosing the active one toggles play
  function selectStream(id) {
    if (id === activeStreamId) {
      setIsPlaying((p) => !p)
    } else {
      setActiveStreamId(id)
      setIsPlaying(true)
    }
  }

  const value = {
    backgroundId,
    setBackgroundId,
    activeStreamId,
    selectStream,
    isPlaying,
    setIsPlaying,
    volume,
    setVolume
  }

  return <AmbianceContext.Provider value={value}>{children}</AmbianceContext.Provider>
}

export function useAmbiance() {
  const ctx = useContext(AmbianceContext)
  if (!ctx) throw new Error('useAmbiance must be used inside AmbianceProvider')
  return ctx
}
