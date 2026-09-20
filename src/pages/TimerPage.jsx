import Timer from '../components/Timer'
import { useAuth } from '../context/AuthContext'

export default function TimerPage() {
  const { isConfigured } = useAuth()

  return (
    <div className="page timer-page">
      {!isConfigured && (
        <div className="setup-notice">
          <strong>Almost there.</strong> Add your Supabase URL and anon key to
          <code> .env.local</code> to turn on accounts. The timer works now; progress
          saves once keys are set.
        </div>
      )}
      <Timer />
    </div>
  )
}
