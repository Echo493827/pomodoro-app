import { useAmbiance } from '../context/AmbianceContext'
import { backgrounds } from '../data/backgrounds'

export default function BackgroundPicker() {
  const { backgroundId, setBackgroundId } = useAmbiance()

  return (
    <div className="panel">
      <h3 className="panel-title">Scene</h3>
      <div className="scene-grid">
        {backgrounds.map((scene) => {
          const preview =
            scene.type === 'image'
              ? { backgroundImage: `url("${scene.value}")` }
              : { backgroundImage: scene.value }
          const active = scene.id === backgroundId
          return (
            <button
              key={scene.id}
              className={`scene-swatch${active ? ' active' : ''}`}
              style={preview}
              onClick={() => setBackgroundId(scene.id)}
              aria-pressed={active}
              title={scene.name}
            >
              <span className="scene-name">{scene.name}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
