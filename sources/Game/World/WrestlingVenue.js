import * as THREE from 'three/webgpu'
import { Game } from '../Game.js'
import gsap from 'gsap'

const COLORS = {
    navy: '#071a33',
    mat: '#123f78',
    orange: '#f5662f',
    cream: '#f4efe4',
    steel: '#202936',
    concrete: '#555c66',
    black: '#080b10',
}

export class WrestlingVenue
{
    constructor()
    {
        this.game = Game.getInstance()
        this.center = this.game.respawns.getDefault().position.clone()
        this.group = new THREE.Group()
        this.group.name = 'Ayush Wrestling Venue'
        this.group.position.set(this.center.x, 0, this.center.z)
        this.game.scene.add(this.group)

        this.materials = {
            floor: this.createMaterial(COLORS.black, 0.92, 0.02),
            concrete: this.createMaterial(COLORS.concrete, 0.88, 0.03),
            steel: this.createMaterial(COLORS.steel, 0.58, 0.38),
            orange: this.createMaterial(COLORS.orange, 0.52, 0.18),
            cream: this.createMaterial(COLORS.cream, 0.78, 0.04),
            dark: this.createMaterial(COLORS.navy, 0.7, 0.12),
            light: new THREE.MeshBasicNodeMaterial({ color: '#ffe8bd' }),
        }

        this.setFloor()
        this.setMat()
        this.setWrestlers()
        this.setBleachers()
        this.setCrowd()
        this.setArchitecture()
        this.setScoreboard()
        this.setBanners()
        this.setCampusStations()
        this.setCampusShell()
        this.setLightingRig()
    }

    createMaterial(color, roughness = 0.75, metalness = 0)
    {
        return new THREE.MeshStandardNodeMaterial({ color, roughness, metalness })
    }

    addBox(name, size, position, material, castShadow = true)
    {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material)
        mesh.name = name
        mesh.position.set(...position)
        mesh.castShadow = castShadow
        mesh.receiveShadow = true
        this.group.add(mesh)
        return mesh
    }

    setFloor()
    {
        this.addBox('Fieldhouse floor', [ 38, 0.35, 31 ], [ 0, -0.2, 0 ], this.materials.floor, false)

        // Painted warm-up lanes make the surrounding gym read as a real venue.
        for(const x of [ -11.2, 11.2 ])
            this.addBox('Warm-up lane', [ 2.4, 0.03, 26 ], [ x, 0.005, 0 ], this.materials.dark, false)

        for(const z of [ -14.1, 14.1 ])
            this.addBox('Boundary stripe', [ 37, 0.025, 0.12 ], [ 0, 0.01, z ], this.materials.orange, false)
    }

    createMatTexture()
    {
        const canvas = document.createElement('canvas')
        canvas.width = 2048
        canvas.height = 2048
        const context = canvas.getContext('2d')

        context.fillStyle = COLORS.mat
        context.fillRect(0, 0, canvas.width, canvas.height)

        context.strokeStyle = COLORS.orange
        context.lineWidth = 32
        context.beginPath()
        context.arc(1024, 1024, 900, 0, Math.PI * 2)
        context.stroke()

        context.strokeStyle = COLORS.cream
        context.lineWidth = 18
        context.beginPath()
        context.arc(1024, 1024, 160, 0, Math.PI * 2)
        context.stroke()

        context.fillStyle = COLORS.orange
        context.font = '900 380px Arial Black, sans-serif'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText('AK', 1024, 1020)

        context.fillStyle = COLORS.cream
        context.font = '700 58px Arial, sans-serif'
        context.letterSpacing = '14px'
        context.fillText('AYUSH KUNJADIA', 1024, 420)
        context.font = '700 42px Arial, sans-serif'
        context.letterSpacing = '10px'
        context.fillText('PORTFOLIO WRESTLING', 1024, 1628)

        const texture = new THREE.CanvasTexture(canvas)
        texture.colorSpace = THREE.SRGBColorSpace
        texture.anisotropy = 8
        return texture
    }

    setMat()
    {
        const base = new THREE.Mesh(
            new THREE.CylinderGeometry(9.65, 9.65, 0.24, 96),
            this.materials.concrete
        )
        base.name = 'Competition mat platform'
        base.position.y = 0.11
        base.receiveShadow = true
        this.group.add(base)

        const material = new THREE.MeshStandardNodeMaterial({
            map: this.createMatTexture(),
            roughness: 0.72,
            metalness: 0,
        })
        const mat = new THREE.Mesh(new THREE.CircleGeometry(9.5, 96), material)
        mat.name = 'Ayush competition mat'
        mat.rotation.x = - Math.PI * 0.5
        mat.position.y = 0.245
        mat.receiveShadow = true
        this.group.add(mat)

        // Red and green starting marks.
        const red = this.createMaterial('#d7373f', 0.62, 0.02)
        const green = this.createMaterial('#2aaa67', 0.62, 0.02)
        for(const [ x, material ] of [ [ -1.05, red ], [ 1.05, green ] ])
        {
            const marker = new THREE.Mesh(new THREE.CircleGeometry(0.28, 32), material)
            marker.rotation.x = - Math.PI * 0.5
            marker.position.set(x, 0.255, 0)
            this.group.add(marker)
        }
    }

    createWrestler(name, singletColor, skinColor, shoeColor)
    {
        const wrestler = new THREE.Group()
        wrestler.name = name

        const singlet = this.createMaterial(singletColor, 0.7, 0.02)
        const skin = this.createMaterial(skinColor, 0.82, 0)
        const shoes = this.createMaterial(shoeColor, 0.58, 0.04)

        const torso = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 0.75, 8, 16), singlet)
        torso.name = `${name} torso`
        torso.position.y = 1.42
        wrestler.add(torso)

        const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 16), skin)
        head.name = `${name} head`
        head.position.y = 2.28
        wrestler.add(head)

        const headgearBand = new THREE.Mesh(new THREE.TorusGeometry(0.285, 0.035, 8, 24), shoes)
        headgearBand.position.y = 2.28
        headgearBand.rotation.x = Math.PI * 0.5
        wrestler.add(headgearBand)

        const limbs = {}
        const addLimb = (key, radius, length, material, position) =>
        {
            const pivot = new THREE.Group()
            pivot.position.set(...position)
            const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(radius, length, 6, 10), material)
            mesh.position.y = - (length * 0.5 + radius)
            pivot.add(mesh)
            wrestler.add(pivot)
            limbs[key] = pivot
            return pivot
        }

        addLimb('leftArm', 0.105, 0.68, skin, [ -0.38, 1.78, 0 ]).rotation.z = -0.55
        addLimb('rightArm', 0.105, 0.68, skin, [ 0.38, 1.78, 0 ]).rotation.z = 0.55
        addLimb('leftLeg', 0.145, 0.78, skin, [ -0.2, 1.02, 0 ]).rotation.z = -0.2
        addLimb('rightLeg', 0.145, 0.78, skin, [ 0.2, 1.02, 0 ]).rotation.z = 0.2

        for(const x of [ -0.25, 0.25 ])
        {
            const shoe = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.15, 0.42), shoes)
            shoe.position.set(x, 0.12, 0.1)
            wrestler.add(shoe)
        }

        wrestler.traverse((child) =>
        {
            if(child.isMesh)
                child.castShadow = true
        })
        wrestler.parts = { torso, head, limbs }
        return wrestler
    }

    setWrestlers()
    {
        this.wrestlers = new THREE.Group()
        this.wrestlers.name = 'Ayush suplex entrance'
        this.wrestlers.position.y = 0.27

        this.attacker = this.createWrestler('Navy wrestler', COLORS.orange, '#8d573b', COLORS.navy)
        this.defender = this.createWrestler('Cream wrestler', COLORS.cream, '#c98c67', '#b91f35')
        this.attacker.position.set(-1.45, 0, 0)
        this.defender.position.set(1.45, 0, 0)
        this.attacker.rotation.y = -Math.PI * 0.5
        this.defender.rotation.y = Math.PI * 0.5

        this.wrestlers.add(this.attacker, this.defender)
        this.group.add(this.wrestlers)
        this.entrancePlayed = false
    }

    playEntrance(onComplete)
    {
        if(this.entrancePlayed)
        {
            onComplete?.()
            return
        }
        this.entrancePlayed = true

        const speed = this.game.debug.active ? 3 : 1
        const timeline = gsap.timeline({
            defaults: { overwrite: true },
            onComplete: () =>
            {
                this.wrestlers.visible = false
                this.game.world.visualVehicle?.setEntranceVisible(true)
                onComplete?.()
            },
        })

        // Level change, shot, go-behind, waist lock, lift, then a controlled
        // five-point suplex onto the defender's back.
        timeline
            .to(this.attacker.position, { x: -0.7, y: -0.22, duration: 0.35, ease: 'power2.in' })
            .to(this.attacker.parts.torso.rotation, { z: -0.55, duration: 0.35 }, '<')
            .to(this.attacker.parts.limbs.leftArm.rotation, { z: -1.3, duration: 0.28 }, '<')
            .to(this.attacker.parts.limbs.rightArm.rotation, { z: 1.3, duration: 0.28 }, '<')
            .to(this.attacker.position, { x: 0.82, z: 0.18, y: -0.05, duration: 0.42, ease: 'power3.out' })
            .to(this.defender.position, { x: 1.12, duration: 0.32 }, '<')
            .to(this.attacker.position, { x: 1.05, z: 0.72, duration: 0.5, ease: 'power2.inOut' })
            .to(this.attacker.rotation, { y: Math.PI, duration: 0.5 }, '<')
            .to(this.attacker.parts.torso.rotation, { z: 0, duration: 0.25 }, '<0.25')
            .to(this.attacker.position, { x: 1.08, z: 0.38, duration: 0.25, ease: 'power2.out' })
            .to(this.defender.position, { y: 0.45, duration: 0.3, ease: 'power2.in' })
            .to(this.attacker.position, { y: 0.32, x: 0.75, duration: 0.45, ease: 'power2.out' })
            .to(this.defender.position, { y: 1.9, x: 0.62, z: 0.35, duration: 0.45, ease: 'power2.out' }, '<')
            .to(this.attacker.rotation, { z: -0.62, duration: 0.45 }, '<')
            .to(this.defender.rotation, { z: -0.72, duration: 0.45 }, '<')
            .to(this.attacker.position, { x: -0.1, y: 0.08, duration: 0.58, ease: 'power3.in' })
            .to(this.attacker.rotation, { z: -1.35, duration: 0.58, ease: 'power3.in' }, '<')
            .to(this.defender.position, { x: -0.68, y: 0.22, z: 0.18, duration: 0.58, ease: 'power3.in' }, '<')
            .to(this.defender.rotation, { z: -1.58, duration: 0.58, ease: 'power3.in' }, '<')
            .to(this.wrestlers.scale, { x: 1.06, y: 0.92, z: 1.06, duration: 0.09, yoyo: true, repeat: 1 })

        timeline.timeScale(speed)
    }

    setBleachers()
    {
        for(const side of [ -1, 1 ])
        {
            const bleachers = new THREE.Group()
            bleachers.name = side < 0 ? 'West bleachers' : 'East bleachers'

            for(let tier = 0; tier < 6; tier++)
            {
                const x = side * (12.2 + tier * 0.75)
                const y = 0.45 + tier * 0.58
                const step = new THREE.Mesh(
                    new THREE.BoxGeometry(1.5, 0.5, 25),
                    tier % 2 ? this.materials.steel : this.materials.concrete
                )
                step.position.set(x, y, 0)
                step.castShadow = true
                step.receiveShadow = true
                bleachers.add(step)

                const rail = new THREE.Mesh(
                    new THREE.BoxGeometry(0.1, 0.12, 24.4),
                    this.materials.orange
                )
                rail.position.set(x - side * 0.48, y + 0.31, 0)
                bleachers.add(rail)
            }

            this.group.add(bleachers)
        }
    }

    setCrowd()
    {
        const count = 84
        const body = new THREE.InstancedMesh(
            new THREE.BoxGeometry(0.38, 0.62, 0.28),
            this.createMaterial('#324a68', 0.82, 0),
            count
        )
        const heads = new THREE.InstancedMesh(
            new THREE.SphereGeometry(0.19, 10, 8),
            this.createMaterial('#b97b5a', 0.88, 0),
            count
        )
        body.name = 'Fieldhouse crowd bodies'
        heads.name = 'Fieldhouse crowd heads'

        const matrix = new THREE.Matrix4()
        let index = 0
        for(const side of [ -1, 1 ])
        {
            for(let tier = 0; tier < 6; tier++)
            {
                for(let seat = 0; seat < 7; seat++)
                {
                    const x = side * (12.2 + tier * 0.75)
                    const y = 0.92 + tier * 0.58
                    const z = -10.2 + seat * 3.4 + ((tier + seat) % 2) * 0.28
                    const lean = side * (0.05 + ((tier * 7 + seat) % 3) * 0.025)

                    matrix.compose(
                        new THREE.Vector3(x, y, z),
                        new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, lean)),
                        new THREE.Vector3(1, 1, 1)
                    )
                    body.setMatrixAt(index, matrix)

                    matrix.compose(
                        new THREE.Vector3(x - side * 0.05, y + 0.49, z),
                        new THREE.Quaternion(),
                        new THREE.Vector3(1, 1, 1)
                    )
                    heads.setMatrixAt(index, matrix)
                    index++
                }
            }
        }
        body.instanceMatrix.needsUpdate = true
        heads.instanceMatrix.needsUpdate = true
        body.castShadow = true
        heads.castShadow = true
        this.group.add(body, heads)
    }

    setArchitecture()
    {
        // Three solid walls and a wide open tunnel toward the rest of the portfolio world.
        // A low arena bowl preserves the chase camera's line of sight.
        this.addBox('South arena wall', [ 38, 3.2, 0.6 ], [ 0, 1.6, 15.2 ], this.materials.dark)
        this.addBox('North wall left', [ 14, 3.2, 0.6 ], [ -12, 1.6, -15.2 ], this.materials.dark)
        this.addBox('North wall right', [ 14, 3.2, 0.6 ], [ 12, 1.6, -15.2 ], this.materials.dark)
        this.addBox('West arena wall', [ 0.6, 3.2, 30 ], [ -19, 1.6, 0 ], this.materials.dark)
        this.addBox('East arena wall', [ 0.6, 3.2, 30 ], [ 19, 1.6, 0 ], this.materials.dark)

        // Entrance tunnel header.
        this.addBox('Entrance tunnel header', [ 10, 3.5, 0.8 ], [ 0, 12.3, -15 ], this.materials.steel)
        this.addBox('Entrance tunnel left', [ 0.6, 8, 5 ], [ -5, 4, -17.5 ], this.materials.steel)
        this.addBox('Entrance tunnel right', [ 0.6, 8, 5 ], [ 5, 4, -17.5 ], this.materials.steel)

        // Perimeter trusses sell the fieldhouse scale without crossing the chase camera.
        for(const x of [ -18.2, 18.2 ])
            this.addBox('Roof truss', [ 0.18, 0.18, 29 ], [ x, 15.2, 0 ], this.materials.steel)
    }

    createSignTexture(title, subtitle, accent = COLORS.orange)
    {
        const canvas = document.createElement('canvas')
        canvas.width = 1400
        canvas.height = 420
        const context = canvas.getContext('2d')
        context.fillStyle = COLORS.black
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.strokeStyle = accent
        context.lineWidth = 24
        context.strokeRect(12, 12, canvas.width - 24, canvas.height - 24)
        context.fillStyle = COLORS.cream
        context.textAlign = 'center'
        context.font = '900 116px Arial Black, sans-serif'
        context.fillText(title, 700, 188)
        context.fillStyle = accent
        context.font = '700 52px Arial, sans-serif'
        context.fillText(subtitle, 700, 292)
        const texture = new THREE.CanvasTexture(canvas)
        texture.colorSpace = THREE.SRGBColorSpace
        return texture
    }

    setScoreboard()
    {
        const board = new THREE.Mesh(
            new THREE.PlaneGeometry(11, 3.3),
            new THREE.MeshBasicNodeMaterial({
                map: this.createSignTexture('AYUSH  5', '2× ALL-STATE     PERIOD 3     VISITOR  0'),
            })
        )
        board.name = 'Ayush scoreboard'
        board.position.set(0, 10.3, 14.86)
        board.rotation.y = Math.PI
        this.group.add(board)
        this.addBox('Scoreboard support left', [ 0.25, 7.2, 0.25 ], [ -5.2, 6.4, 14.6 ], this.materials.steel)
        this.addBox('Scoreboard support right', [ 0.25, 7.2, 0.25 ], [ 5.2, 6.4, 14.6 ], this.materials.steel)
    }

    setBanners()
    {
        const banners = [
            [ 'DUET', 'AI DESKTOP TOOLING', -8.3 ],
            [ 'CUDAFORGE', 'GPU SYSTEMS', 0 ],
            [ 'CLINIC FINDER', 'FULL-STACK MAPS', 8.3 ],
        ]

        for(const [ title, subtitle, x ] of banners)
        {
            const banner = new THREE.Mesh(
                new THREE.PlaneGeometry(6.4, 1.9),
                new THREE.MeshBasicNodeMaterial({ map: this.createSignTexture(title, subtitle) })
            )
            banner.name = `${title} banner`
            banner.position.set(x, 7.2, 14.84)
            banner.rotation.y = Math.PI
            this.group.add(banner)
        }

        const entrance = new THREE.Mesh(
            new THREE.PlaneGeometry(8.8, 2.3),
            new THREE.MeshBasicNodeMaterial({
                map: this.createSignTexture('KUNJADIA', 'FIELDHOUSE • EAST LANSING'),
            })
        )
        entrance.name = 'Kunjadia Fieldhouse sign'
        entrance.position.set(0, 11.9, -14.55)
        this.group.add(entrance)
    }

    setCampusStations()
    {
        const stations = [
            [ 'projects', 'PROJECT SHOWCASE', 'DUET • CUDAFORGE • CLINIC FINDER' ],
            [ 'career', 'CAREER TUNNEL', 'ENGINEER • FOUNDER • WRESTLER' ],
            [ 'social', 'TEAM BENCH', 'GITHUB • LINKEDIN • EMAIL' ],
        ]

        for(const [ respawnName, title, subtitle ] of stations)
        {
            const respawn = this.game.respawns.getByName(respawnName)
            if(!respawn)
                continue

            const x = respawn.position.x - this.center.x
            const z = respawn.position.z - this.center.z
            // Respawn coordinates are world-space while each station lives inside
            // the venue group. Subtract the venue origin so pads sit on the floor
            // instead of inheriting the fieldhouse height a second time.
            const y = respawn.position.y - this.center.y + 0.04
            const station = new THREE.Group()
            station.name = title
            station.position.set(x, y, z)

            const pad = new THREE.Mesh(
                new THREE.CircleGeometry(4.25, 48),
                this.materials.dark
            )
            pad.rotation.x = -Math.PI * 0.5
            pad.position.y = 0.025
            pad.receiveShadow = true
            station.add(pad)

            const ring = new THREE.Mesh(
                new THREE.RingGeometry(3.85, 4.28, 48),
                new THREE.MeshBasicNodeMaterial({ color: COLORS.orange, side: THREE.DoubleSide })
            )
            ring.rotation.x = -Math.PI * 0.5
            ring.position.y = 0.035
            station.add(ring)

            const sign = new THREE.Mesh(
                new THREE.PlaneGeometry(7.2, 2.15),
                new THREE.MeshBasicNodeMaterial({ map: this.createSignTexture(title, subtitle) })
            )
            sign.position.set(0, 2.75, -4.15)
            station.add(sign)

            for(const postX of [ -3.25, 3.25 ])
            {
                const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.6, 0.18), this.materials.steel)
                post.position.set(postX, 1.35, -4.05)
                station.add(post)
            }

            this.group.add(station)
        }
    }

    setCampusShell()
    {
        const originX = -this.center.x
        const originZ = -this.center.z
        const ceiling = new THREE.Mesh(
            new THREE.PlaneGeometry(196, 196),
            new THREE.MeshBasicNodeMaterial({ color: '#080d17', side: THREE.DoubleSide })
        )
        ceiling.name = 'Fieldhouse ceiling'
        ceiling.rotation.x = Math.PI * 0.5
        ceiling.position.set(originX, 34, originZ)
        this.group.add(ceiling)

        for(let coordinate = -90; coordinate <= 90; coordinate += 18)
        {
            this.addBox('Campus roof beam', [ 0.22, 0.22, 188 ], [ originX + coordinate, 33.5, originZ ], this.materials.steel, false)
            this.addBox('Campus roof beam', [ 188, 0.22, 0.22 ], [ originX, 33.5, originZ + coordinate ], this.materials.steel, false)
        }

        this.addBox('Campus north wall', [ 196, 34, 0.5 ], [ originX, 17, originZ - 98 ], this.materials.dark, false)
        this.addBox('Campus south wall', [ 196, 34, 0.5 ], [ originX, 17, originZ + 98 ], this.materials.dark, false)
        this.addBox('Campus west wall', [ 0.5, 34, 196 ], [ originX - 98, 17, originZ ], this.materials.dark, false)
        this.addBox('Campus east wall', [ 0.5, 34, 196 ], [ originX + 98, 17, originZ ], this.materials.dark, false)
    }

    setLightingRig()
    {
        for(const x of [ -12, -6, 0, 6, 12 ])
        {
            for(const z of [ -9, 0, 9 ])
            {
                const light = new THREE.Mesh(new THREE.CircleGeometry(0.46, 24), this.materials.light)
                light.name = 'Arena light'
                light.rotation.x = Math.PI * 0.5
                light.position.set(x, 14.95, z)
                this.group.add(light)
            }
        }
    }
}
