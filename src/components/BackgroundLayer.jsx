import { useAmbiance } from '../context/AmbianceContext'
import { backgrounds } from '../data/backgrounds'

// renders the active scene as a fixed layer behind everything, with a
// soft dark scrim so text stays readable over photos.
export default function BackgroundLayer() {
  const { backgroundId } = useAmbiance()
  const scene = backgrounds.find((b) => b.id === backgroundId) || backgrounds[0]

  const style =
    scene.type === 'image'
      ? { backgroundImage: `url("${scene.value}")` }
      : { backgroundImage: scene.value }

  return (
    <div className="bg-layer" style={style}>
      <div className="bg-scrim" />
    </div>
  )
}
