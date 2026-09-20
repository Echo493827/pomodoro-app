// plays a soft two-note chime using the web audio api, so there is no
// audio file to ship or 404. safe to call on a user gesture or timer end.
let ctx = null

export function playChime() {
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)()
    if (ctx.state === 'suspended') ctx.resume()

    const now = ctx.currentTime
    // two gentle sine tones, a rising interval
    const notes = [
      { freq: 660, at: 0 },
      { freq: 880, at: 0.16 }
    ]

    notes.forEach(({ freq, at }) => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.value = freq

      const start = now + at
      gain.gain.setValueAtTime(0.0001, start)
      gain.gain.exponentialRampToValueAtTime(0.25, start + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9)

      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + 1)
    })
  } catch {
    // audio not available; fail quietly
  }
}
