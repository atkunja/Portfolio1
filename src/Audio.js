export class AudioSystem {
  constructor() {
    this.context = null
    this.master = null
    this.engine = null
    this.engineGain = null
    this.enabled = true
  }

  start() {
    if (this.context) return
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) { this.enabled = false; return }
    this.context = new AudioContext()
    this.master = this.context.createGain()
    this.master.gain.value = .22
    this.master.connect(this.context.destination)

    this.engine = this.context.createOscillator()
    this.engine.type = 'sawtooth'
    this.engineGain = this.context.createGain()
    this.engineGain.gain.value = 0
    const filter = this.context.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 260
    this.engine.connect(filter)
    filter.connect(this.engineGain)
    this.engineGain.connect(this.master)
    this.engine.start()
  }

  setEnabled(enabled) {
    this.enabled = enabled
    if (this.master && this.context) {
      this.master.gain.setTargetAtTime(enabled ? .22 : 0, this.context.currentTime, .04)
    }
  }

  update(speed, boosting) {
    if (!this.context || !this.engine) return
    const now = this.context.currentTime
    this.engine.frequency.setTargetAtTime(42 + Math.abs(speed) * 9 + (boosting ? 24 : 0), now, .06)
    this.engineGain.gain.setTargetAtTime(this.enabled ? .018 + Math.abs(speed) * .003 : 0, now, .08)
  }

  tone(frequency = 440, duration = .12, type = 'sine', volume = .22) {
    if (!this.context || !this.enabled) return
    const oscillator = this.context.createOscillator()
    const gain = this.context.createGain()
    oscillator.type = type
    oscillator.frequency.setValueAtTime(frequency, this.context.currentTime)
    gain.gain.setValueAtTime(volume, this.context.currentTime)
    gain.gain.exponentialRampToValueAtTime(.001, this.context.currentTime + duration)
    oscillator.connect(gain)
    gain.connect(this.master)
    oscillator.start()
    oscillator.stop(this.context.currentTime + duration)
  }

  collect() {
    this.tone(660, .11, 'sine', .16)
    setTimeout(() => this.tone(880, .18, 'sine', .13), 65)
  }

  honk() { this.tone(185, .28, 'square', .1) }
  bump() { this.tone(72, .09, 'triangle', .14) }
}
