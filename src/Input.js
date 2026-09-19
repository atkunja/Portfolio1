export class Input {
  constructor(root = document) {
    this.keys = new Set()
    this.touch = { x: 0, y: 0, boost: false, jump: false }
    this.justPressed = new Set()

    window.addEventListener('keydown', (event) => {
      if (!this.keys.has(event.code)) this.justPressed.add(event.code)
      this.keys.add(event.code)
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(event.code)) event.preventDefault()
    })
    window.addEventListener('keyup', (event) => this.keys.delete(event.code))
    window.addEventListener('blur', () => this.keys.clear())
    this.bindTouch(root)
  }

  bindTouch(root) {
    const pad = root.querySelector('.touch-pad')
    const knob = root.querySelector('.touch-knob')
    if (pad && knob) {
      const update = (event) => {
        const touch = event.touches?.[0] ?? event
        const rect = pad.getBoundingClientRect()
        const x = touch.clientX - (rect.left + rect.width / 2)
        const y = touch.clientY - (rect.top + rect.height / 2)
        const distance = Math.min(34, Math.hypot(x, y))
        const angle = Math.atan2(y, x)
        this.touch.x = Math.cos(angle) * distance / 34
        this.touch.y = -Math.sin(angle) * distance / 34
        knob.style.transform = `translate(${this.touch.x * 34}px, ${-this.touch.y * 34}px)`
      }
      const reset = () => { this.touch.x = 0; this.touch.y = 0; knob.style.transform = '' }
      pad.addEventListener('pointerdown', (event) => { pad.setPointerCapture(event.pointerId); update(event) })
      pad.addEventListener('pointermove', (event) => { if (pad.hasPointerCapture(event.pointerId)) update(event) })
      pad.addEventListener('pointerup', reset)
      pad.addEventListener('pointercancel', reset)
    }
    root.querySelectorAll('[data-touch]').forEach((button) => {
      const key = button.dataset.touch
      button.addEventListener('pointerdown', () => { this.touch[key] = true; if (key === 'jump') this.justPressed.add('Space') })
      const release = () => { this.touch[key] = false }
      button.addEventListener('pointerup', release)
      button.addEventListener('pointercancel', release)
    })
  }

  axis() {
    let throttle = Number(this.keys.has('KeyW') || this.keys.has('ArrowUp')) - Number(this.keys.has('KeyS') || this.keys.has('ArrowDown'))
    let steer = Number(this.keys.has('KeyA') || this.keys.has('ArrowLeft')) - Number(this.keys.has('KeyD') || this.keys.has('ArrowRight'))
    const gamepad = navigator.getGamepads?.()[0]
    if (gamepad) {
      steer = Math.abs(gamepad.axes[0]) > .12 ? -gamepad.axes[0] : steer
      throttle = Math.abs(gamepad.axes[1]) > .12 ? -gamepad.axes[1] : throttle
    }
    if (Math.abs(this.touch.x) > .08) steer = -this.touch.x
    if (Math.abs(this.touch.y) > .08) throttle = this.touch.y
    return { throttle, steer }
  }

  down(...codes) { return codes.some((code) => this.keys.has(code)) }
  consume(code) { const active = this.justPressed.has(code); this.justPressed.delete(code); return active }
  endFrame() { this.justPressed.clear() }
}
