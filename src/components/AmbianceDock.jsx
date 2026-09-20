import { useState } from 'react'
import { useAmbiance } from '../context/AmbianceContext'
import BackgroundPicker from './BackgroundPicker'
import MusicPanel from './MusicPanel'

// bottom-corner dock with two toggles. one panel open at a time.
export default function AmbianceDock() {
  const [open, setOpen] = useState(null) // 'scene' | 'music' | null
  const { isPlaying } = useAmbiance()

  function toggle(which) {
    setOpen((cur) => (cur === which ? null : which))
  }

  return (
    <div className="dock">
      {open === 'scene' && (
        <div className="dock-popover">
          <BackgroundPicker />
        </div>
      )}
      {open === 'music' && (
        <div className="dock-popover">
          <MusicPanel />
        </div>
      )}

      <div className="dock-buttons">
        <button
          className={`dock-btn${open === 'music' ? ' active' : ''}`}
          onClick={() => toggle('music')}
          aria-label="Music"
        >
          <span aria-hidden="true">{isPlaying ? '♫' : '♪'}</span>
        </button>
        <button
          className={`dock-btn${open === 'scene' ? ' active' : ''}`}
          onClick={() => toggle('scene')}
          aria-label="Change scene"
        >
          <span aria-hidden="true">◐</span>
        </button>
      </div>
    </div>
  )
}
