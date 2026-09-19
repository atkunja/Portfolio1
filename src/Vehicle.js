import * as THREE from 'three'

export class Vehicle {
  constructor(scene) {
    this.group = new THREE.Group()
    this.group.position.set(0, .48, 8)
    scene.add(this.group)

    this.speed = 0
    this.heading = Math.PI
    this.verticalSpeed = 0
    this.grounded = true
    this.wheels = []
    this.build()
  }

  build() {
    const cream = new THREE.MeshStandardMaterial({ color: 0xf2eadf, roughness: .65 })
    const orange = new THREE.MeshStandardMaterial({ color: 0xff9e42, roughness: .55 })
    const dark = new THREE.MeshStandardMaterial({ color: 0x172235, roughness: .8 })
    const glass = new THREE.MeshStandardMaterial({ color: 0x83cbd8, roughness: .25, metalness: .15 })

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.65, .45, 2.6), orange)
    body.position.y = .45
    body.castShadow = true
    this.group.add(body)

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.35, .55, 1.25), cream)
    cabin.position.set(0, .89, .08)
    cabin.castShadow = true
    this.group.add(cabin)
    const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.12, .36, .03), glass)
    windshield.position.set(0, .95, -.57)
    windshield.rotation.x = -.08
    this.group.add(windshield)

    const bumperGeometry = new THREE.BoxGeometry(1.72, .15, .18)
    for (const z of [-1.35, 1.35]) {
      const bumper = new THREE.Mesh(bumperGeometry, dark)
      bumper.position.set(0, .29, z)
      this.group.add(bumper)
    }

    const wheelGeometry = new THREE.CylinderGeometry(.34, .34, .24, 16)
    for (const x of [-.88, .88]) for (const z of [-.85, .85]) {
      const wheel = new THREE.Mesh(wheelGeometry, dark)
      wheel.rotation.z = Math.PI / 2
      wheel.position.set(x, .3, z)
      wheel.castShadow = true
      this.wheels.push(wheel)
      this.group.add(wheel)
    }

    const lightMaterial = new THREE.MeshStandardMaterial({ color: 0xfff0a8, emissive: 0xffb52e, emissiveIntensity: 1.4 })
    for (const x of [-.52, .52]) {
      const light = new THREE.Mesh(new THREE.BoxGeometry(.28, .18, .04), lightMaterial)
      light.position.set(x, .55, -1.32)
      this.group.add(light)
    }
  }

  update(delta, input, paused = false) {
    if (paused) return
    const { throttle, steer } = input.axis()
    const boosting = input.down('ShiftLeft', 'ShiftRight') || input.touch.boost
    const maxSpeed = boosting ? 15 : 10
    const acceleration = boosting ? 16 : 11

    if (Math.abs(throttle) > .01) this.speed += throttle * acceleration * delta
    else this.speed *= Math.pow(.08, delta)
    this.speed = THREE.MathUtils.clamp(this.speed, -maxSpeed * .52, maxSpeed)

    const turnGrip = THREE.MathUtils.clamp(Math.abs(this.speed) / 2.5, 0, 1)
    this.heading += steer * 2.15 * turnGrip * Math.sign(this.speed || 1) * delta
    this.group.rotation.y = this.heading
    this.group.position.x += Math.sin(this.heading) * this.speed * delta
    this.group.position.z += Math.cos(this.heading) * this.speed * delta

    const limit = 30
    this.group.position.x = THREE.MathUtils.clamp(this.group.position.x, -limit, limit)
    this.group.position.z = THREE.MathUtils.clamp(this.group.position.z, -limit, limit)

    if (input.consume('Space') && this.grounded) {
      this.verticalSpeed = 5.4
      this.grounded = false
    }
    if (!this.grounded) {
      this.verticalSpeed -= 12.5 * delta
      this.group.position.y += this.verticalSpeed * delta
      if (this.group.position.y <= .48) { this.group.position.y = .48; this.verticalSpeed = 0; this.grounded = true }
    }

    this.group.rotation.z = THREE.MathUtils.lerp(this.group.rotation.z, -steer * turnGrip * .1, 1 - Math.pow(.002, delta))
    this.group.rotation.x = THREE.MathUtils.lerp(this.group.rotation.x, throttle * .035 - this.verticalSpeed * .02, 1 - Math.pow(.003, delta))
    this.wheels.forEach((wheel, index) => {
      wheel.rotation.x -= this.speed * delta / .34
      if (index < 2) wheel.rotation.y = -steer * .35
    })
  }

  respawn() {
    this.group.position.set(0, .48, 8)
    this.heading = Math.PI
    this.group.rotation.set(0, this.heading, 0)
    this.speed = 0
    this.verticalSpeed = 0
    this.grounded = true
  }
}
