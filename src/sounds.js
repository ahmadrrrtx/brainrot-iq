// Web Audio API se sounds — koi external CDN nahi, koi CORS issue nahi
let ctx = null

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)()
  return ctx
}

function playTone(frequency, duration, type = 'sine', volume = 0.3) {
  try {
    const c = getCtx()
    const osc = c.createOscillator()
    const gain = c.createGain()
    osc.connect(gain)
    gain.connect(c.destination)
    osc.type = type
    osc.frequency.setValueAtTime(frequency, c.currentTime)
    gain.gain.setValueAtTime(volume, c.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration)
    osc.start(c.currentTime)
    osc.stop(c.currentTime + duration)
  } catch (e) {}
}

export function playCorrect() {
  // Happy two-tone ding
  playTone(523, 0.12, 'sine', 0.25)
  setTimeout(() => playTone(784, 0.2, 'sine', 0.25), 100)
}

export function playWrong() {
  // Low buzzer
  playTone(180, 0.3, 'sawtooth', 0.15)
}

export function playTimeout() {
  // Descending beep
  playTone(440, 0.15, 'square', 0.1)
  setTimeout(() => playTone(330, 0.25, 'square', 0.1), 120)
}

export function playConfetti() {
  // Victory fanfare
  [523, 659, 784, 1047].forEach((f, i) => {
    setTimeout(() => playTone(f, 0.18, 'sine', 0.2), i * 80)
  })
}
