// a smooth svg ring. `progress` is 0..1 (fraction of the block elapsed).
// children render in the centre (the time and label).
export default function CircularProgress({ progress, mode, children }) {
  const size = 280
  const stroke = 14
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(0, Math.min(1, progress))
  const offset = circumference * (1 - clamped)

  return (
    <div className="ring-wrap">
      <svg
        className="ring"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        role="img"
        aria-label={`${Math.round(clamped * 100)} percent through the ${mode} block`}
      >
        <defs>
          <linearGradient id="brewGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C9A0" />
            <stop offset="55%" stopColor="#D2691E" />
            <stop offset="100%" stopColor="#8B4513" />
          </linearGradient>
        </defs>

        {/* faint track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(244,230,211,0.14)"
          strokeWidth={stroke}
        />

        {/* progress arc, drawn from the top */}
        <circle
          className="ring-progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#brewGradient)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      <div className="ring-center">{children}</div>
    </div>
  )
}
