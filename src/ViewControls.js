export class ViewControls {
  constructor(canvas) {
    this.yaw = 0
    this.pitch = 0
    this.zoom = 1
    this.dragging = false
    this.pointer = null
    this.last = { x: 0, y: 0 }

    canvas.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') return
      this.dragging = true
      this.pointer = event.pointerId
      this.last.x = event.clientX
      this.last.y = event.clientY
      canvas.setPointerCapture(event.pointerId)
    })
    canvas.addEventListener('pointermove', (event) => {
      if (!this.dragging || event.pointerId !== this.pointer) return
      const dx = event.clientX - this.last.x
      const dy = event.clientY - this.last.y
      this.last.x = event.clientX
      this.last.y = event.clientY
      this.yaw = Math.max(-1.35, Math.min(1.35, this.yaw - dx * .006))
      this.pitch = Math.max(-.28, Math.min(.42, this.pitch + dy * .004))
    })
    const release = (event) => {
      if (event.pointerId === this.pointer) {
        this.dragging = false
        this.pointer = null
      }
    }
    canvas.addEventListener('pointerup', release)
    canvas.addEventListener('pointercancel', release)
    canvas.addEventListener('wheel', (event) => {
      this.zoom = Math.max(.72, Math.min(1.55, this.zoom + event.deltaY * .0006))
    }, { passive: true })
  }

  reset() {
    this.yaw = 0
    this.pitch = 0
    this.zoom = 1
  }
}
