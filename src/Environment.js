import * as THREE from 'three'

const DAY = new THREE.Color(0xa9d8e4)
const DUSK = new THREE.Color(0xf0ad8d)
const NIGHT = new THREE.Color(0x10182b)

export class Environment {
  constructor(scene, sun, hemisphere) {
    this.scene = scene
    this.sun = sun
    this.hemisphere = hemisphere
    this.time = .2
    this.cycleDuration = 150
    this.stars = this.createStars()
    this.clouds = this.createClouds()
  }

  createStars() {
    const positions = []
    for (let i = 0; i < 280; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(THREE.MathUtils.randFloat(.08, 1))
      const radius = THREE.MathUtils.randFloat(58, 72)
      positions.push(
        Math.sin(phi) * Math.cos(theta) * radius,
        Math.cos(phi) * radius,
        Math.sin(phi) * Math.sin(theta) * radius,
      )
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    const material = new THREE.PointsMaterial({ color: 0xfff3d4, size: .22, transparent: true, opacity: 0, depthWrite: false })
    const points = new THREE.Points(geometry, material)
    this.scene.add(points)
    return points
  }

  createClouds() {
    const group = new THREE.Group()
    const material = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 1, transparent: true, opacity: .72 })
    for (let i = 0; i < 9; i++) {
      const cloud = new THREE.Group()
      const count = 3 + i % 3
      for (let j = 0; j < count; j++) {
        const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(1.3 + (j % 2) * .5, 1), material)
        puff.scale.set(1.45, .7, 1)
        puff.position.set(j * 1.35, Math.sin(j) * .28, 0)
        cloud.add(puff)
      }
      cloud.position.set((i % 3 - 1) * 25 + (i % 2) * 5, 14 + i % 3 * 2, (Math.floor(i / 3) - 1) * 24)
      cloud.scale.setScalar(.65 + (i % 3) * .14)
      group.add(cloud)
    }
    this.scene.add(group)
    return group
  }

  update(delta) {
    this.time = (this.time + delta / this.cycleDuration) % 1
    const angle = this.time * Math.PI * 2
    const daylight = THREE.MathUtils.smoothstep(Math.sin(angle) * .72 + .36, 0, 1)
    const duskAmount = Math.max(0, 1 - Math.abs(Math.sin(angle)) * 4) * (1 - Math.abs(daylight - .5) * 1.5)

    this.sun.position.set(Math.cos(angle) * 32, Math.sin(angle) * 28 + 8, Math.sin(angle * .7) * 20)
    this.sun.intensity = .28 + daylight * 3.9
    this.hemisphere.intensity = .35 + daylight * 1.75

    const color = NIGHT.clone().lerp(DAY, daylight).lerp(DUSK, duskAmount * .65)
    this.scene.background.copy(color)
    this.scene.fog.color.copy(color)
    this.stars.material.opacity = THREE.MathUtils.clamp(1 - daylight * 1.5, 0, .88)
    this.clouds.rotation.y += delta * .004
  }
}
