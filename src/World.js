import * as THREE from 'three'

const rand = (seed) => {
  const x = Math.sin(seed * 9283.31) * 43758.5453
  return x - Math.floor(x)
}

export class World {
  constructor(scene, projects) {
    this.scene = scene
    this.projects = projects
    this.projectPoints = []
    this.clock = 0
    this.buildGround()
    this.buildRoads()
    this.buildProjects()
    this.buildScenery()
    this.buildStartArea()
  }

  buildGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(72, 72),
      new THREE.MeshStandardMaterial({ color: 0x9fcf8a, roughness: 1 }),
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    this.scene.add(ground)

    const grid = new THREE.GridHelper(72, 36, 0xb5dca5, 0xb5dca5)
    grid.position.y = .011
    grid.material.opacity = .16
    grid.material.transparent = true
    this.scene.add(grid)
  }

  buildRoads() {
    const material = new THREE.MeshStandardMaterial({ color: 0x4b5666, roughness: .95 })
    const edge = new THREE.MeshStandardMaterial({ color: 0xe6dfcc, roughness: .9 })
    const segments = [
      { from: [0, 8], to: [-16, -12] },
      { from: [-16, -12], to: [15, -19] },
      { from: [15, -19], to: [18, 13] },
      { from: [18, 13], to: [0, 8] },
    ]
    for (const segment of segments) {
      const [x1, z1] = segment.from
      const [x2, z2] = segment.to
      const dx = x2 - x1
      const dz = z2 - z1
      const length = Math.hypot(dx, dz)
      const road = new THREE.Mesh(new THREE.BoxGeometry(5.1, .045, length), material)
      road.position.set((x1 + x2) / 2, .025, (z1 + z2) / 2)
      road.rotation.y = Math.atan2(dx, dz)
      road.receiveShadow = true
      this.scene.add(road)
      for (let i = 1; i < Math.floor(length / 2); i += 2) {
        const t = i * 2 / length
        const dash = new THREE.Mesh(new THREE.BoxGeometry(.12, .015, 1), edge)
        dash.position.set(x1 + dx * t, .055, z1 + dz * t)
        dash.rotation.y = road.rotation.y
        this.scene.add(dash)
      }
    }
  }

  buildProjects() {
    const loader = new THREE.TextureLoader()
    this.projects.forEach((project, index) => {
      const group = new THREE.Group()
      group.position.set(...project.position)
      group.lookAt(0, 0, 0)
      this.scene.add(group)

      const platform = new THREE.Mesh(
        new THREE.CylinderGeometry(4.1, 4.4, .36, 32),
        new THREE.MeshStandardMaterial({ color: 0x172235, roughness: .8 }),
      )
      platform.position.y = .18
      platform.receiveShadow = true
      group.add(platform)

      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(3.35, .09, 10, 64),
        new THREE.MeshStandardMaterial({ color: project.accent, emissive: project.accent, emissiveIntensity: 1.2 }),
      )
      ring.rotation.x = Math.PI / 2
      ring.position.y = .42
      group.add(ring)

      const imageMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .65 })
      loader.load(project.image, (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        imageMaterial.map = texture
        imageMaterial.needsUpdate = true
      })
      const board = new THREE.Mesh(new THREE.BoxGeometry(5.4, 3.4, .22), [
        new THREE.MeshStandardMaterial({ color: 0x172235 }), new THREE.MeshStandardMaterial({ color: 0x172235 }),
        new THREE.MeshStandardMaterial({ color: 0x172235 }), new THREE.MeshStandardMaterial({ color: 0x172235 }),
        imageMaterial, new THREE.MeshStandardMaterial({ color: 0x172235 }),
      ])
      board.position.set(0, 2.7, 0)
      board.castShadow = true
      group.add(board)

      for (const x of [-2.2, 2.2]) {
        const support = new THREE.Mesh(
          new THREE.CylinderGeometry(.12, .16, 2.15, 10),
          new THREE.MeshStandardMaterial({ color: 0xdcd2c2, roughness: .8 }),
        )
        support.position.set(x, 1.18, 0)
        support.castShadow = true
        group.add(support)
      }

      const label = this.makeText(project.title.toUpperCase(), '#f4efe5', '#172235')
      label.position.set(0, .78, 2.65)
      label.scale.set(4.2, 1.05, 1)
      group.add(label)

      this.projectPoints.push({ project, group, ring })
    })
  }

  buildStartArea() {
    const title = this.makeText('KUNJA\'S\nPLAYGROUND', '#172235', '#ffbd59', 110)
    title.position.set(0, 3.3, 3.2)
    title.scale.set(6.6, 3.5, 1)
    this.scene.add(title)

    const postMaterial = new THREE.MeshStandardMaterial({ color: 0xf4efe5, roughness: .8 })
    for (const x of [-2.6, 2.6]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(.12, .17, 3.4, 10), postMaterial)
      post.position.set(x, 1.7, 3.35)
      post.castShadow = true
      this.scene.add(post)
    }
  }

  makeText(text, color, background, fontSize = 90) {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const context = canvas.getContext('2d')
    context.fillStyle = background
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = color
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.font = `800 ${fontSize}px Space Grotesk, sans-serif`
    const lines = text.split('\n')
    lines.forEach((line, index) => context.fillText(line, 512, 256 + (index - (lines.length - 1) / 2) * fontSize * 1.05))
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }))
    return sprite
  }

  buildScenery() {
    const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x765848, roughness: 1 })
    const foliage = [0x315d4a, 0x417559, 0x548868].map((color) => new THREE.MeshStandardMaterial({ color, roughness: 1 }))
    const rockMaterial = new THREE.MeshStandardMaterial({ color: 0x87939b, roughness: 1 })

    for (let i = 0; i < 58; i++) {
      const x = rand(i + 4) * 64 - 32
      const z = rand(i + 90) * 64 - 32
      if (Math.hypot(x, z - 7) < 6 || this.projects.some((p) => Math.hypot(x - p.position[0], z - p.position[2]) < 6)) continue
      if (i % 5 === 0) {
        const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(.45 + rand(i) * .75, 0), rockMaterial)
        rock.position.set(x, .28, z)
        rock.rotation.set(rand(i) * 2, rand(i + 1) * 3, rand(i + 2))
        rock.scale.y = .55
        rock.castShadow = true
        this.scene.add(rock)
      } else {
        const tree = new THREE.Group()
        const size = .7 + rand(i + 20) * .8
        const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.1 * size, .16 * size, 1.25 * size, 7), trunkMaterial)
        trunk.position.y = .62 * size
        trunk.castShadow = true
        tree.add(trunk)
        const crown = new THREE.Mesh(new THREE.IcosahedronGeometry(.78 * size, 1), foliage[i % foliage.length])
        crown.position.y = 1.55 * size
        crown.scale.y = 1.25
        crown.castShadow = true
        tree.add(crown)
        tree.position.set(x, 0, z)
        tree.rotation.y = rand(i + 200) * Math.PI
        this.scene.add(tree)
      }
    }

    for (let i = 0; i < 18; i++) {
      const marker = new THREE.Mesh(
        new THREE.BoxGeometry(.18, .75, .18),
        new THREE.MeshStandardMaterial({ color: i % 2 ? 0xffb84d : 0xf4efe5, roughness: .7 }),
      )
      const angle = i / 18 * Math.PI * 2
      marker.position.set(Math.sin(angle) * 27, .375, Math.cos(angle) * 27)
      marker.rotation.y = -angle
      marker.castShadow = true
      this.scene.add(marker)
    }
  }

  update(delta, carPosition) {
    this.clock += delta
    let nearest = null
    let distance = Infinity
    for (const point of this.projectPoints) {
      point.ring.rotation.z = this.clock * .22
      point.ring.material.emissiveIntensity = 1 + Math.sin(this.clock * 3 + point.group.position.x) * .35
      const current = carPosition.distanceTo(point.group.position)
      if (current < distance) { nearest = point; distance = current }
    }
    return distance < 4.25 ? nearest.project : null
  }
}
