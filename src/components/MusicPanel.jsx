import { useAmbiance } from '../context/AmbianceContext'
import { streams } from '../data/streams'

export default function MusicPanel() {
  const { activeStreamId, selectStream, isPlaying, volume, setVolume } = useAmbiance()

  return (
    <div className="panel">
      <h3 className="panel-title">Music</h3>
      <ul className="station-list">
        {streams.map((station) => {
          const active = station.id === activeStreamId
          const playingThis = active && isPlaying
          return (
            <li key={station.id}>
              <button
                className={`station${active ? ' active' : ''}`}
                onClick={() => selectStream(station.id)}
              >
                <span className="station-icon" aria-hidden="true">
                  {playingThis ? '❚❚' : '▶'}
                </span>
                <span className="station-text">
                  <span className="station-name">{station.name}</span>
                  <span className="station-note">{station.note}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>

      <label className="volume-row">
        <span className="volume-label">Volume</span>
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          aria-label="Music volume"
        />
      </label>

      <p className="panel-foot">Streams play from YouTube.</p>
    </div>
  )
}
