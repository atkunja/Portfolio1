import * as THREE from 'three'
import './style.css'
import { projects } from './content.js'
import { Input } from './Input.js'
import { UI } from './UI.js'
import { Vehicle } from './Vehicle.js'
import { World } from './World.js'

const canvas = document.querySelector('#experience')
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' })
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.outputColorSpace = THREE.SRGBColorSpace
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.05
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xa9d8e4)
scene.fog = new THREE.FogExp2(0xa9d8e4, .018)

const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, .1, 180)
camera.position.set(9, 10, 17)

const hemisphere = new THREE.HemisphereLight(0xdff7ff, 0x31513d, 2.1)
scene.add(hemisphere)
const sun = new THREE.DirectionalLight(0xfff0d6, 4.2)
sun.position.set(-18, 26, 12)
sun.castShadow = true
sun.shadow.mapSize.set(2048, 2048)
sun.shadow.camera.left = -38
sun.shadow.camera.right = 38
sun.shadow.camera.top = 38
sun.shadow.camera.bottom = -38
sun.shadow.bias = -.0005
scene.add(sun)

const world = new World(scene, projects)
const vehicle = new Vehicle(scene)
let started = false
let target = null

const ui = new UI({
  projects,
  onStart: () => { started = true; ui.showToast('Follow the roads to find all three projects') },
  onRespawn: () => { vehicle.respawn(); ui.showToast('Back on track') },
})
const input = new Input(document)

const cameraTarget = new THREE.Vector3()
const cameraDesired = new THREE.Vector3()
const cameraLook = new THREE.Vector3()
const clock = new THREE.Clock()

function updateCamera(delta) {
  const forward = new THREE.Vector3(Math.sin(vehicle.heading), 0, Math.cos(vehicle.heading))
  cameraTarget.copy(vehicle.group.position)
  cameraDesired.copy(vehicle.group.position)
    .addScaledVector(forward, -7.8)
    .add(new THREE.Vector3(0, 7.4, 0))
  const smoothing = 1 - Math.pow(.0025, delta)
  camera.position.lerp(cameraDesired, smoothing)
  cameraLook.lerp(cameraTarget.clone().addScaledVector(forward, 2.1).add(new THREE.Vector3(0, .7, 0)), smoothing)
  camera.lookAt(cameraLook)
}

function updateMap() {
  const context = ui.mapCanvas.getContext('2d')
  const size = ui.mapCanvas.width
  const toMap = (value) => size / 2 + value / 72 * size
  context.clearRect(0, 0, size, size)
  context.fillStyle = '#152237'
  context.fillRect(0, 0, size, size)
  context.strokeStyle = 'rgba(255,255,255,.08)'
  context.lineWidth = 1
  for (let i = 0; i <= 12; i++) {
    const p = i / 12 * size
    context.beginPath(); context.moveTo(p, 0); context.lineTo(p, size); context.stroke()
    context.beginPath(); context.moveTo(0, p); context.lineTo(size, p); context.stroke()
  }
  const route = [[0, 8], [-16, -12], [15, -19], [18, 13], [0, 8]]
  context.strokeStyle = '#637083'
  context.lineWidth = 22
  context.lineJoin = 'round'
  context.beginPath()
  route.forEach(([x, z], index) => index ? context.lineTo(toMap(x), toMap(z)) : context.moveTo(toMap(x), toMap(z)))
  context.stroke()
  projects.forEach((project, index) => {
    context.fillStyle = project.accent
    context.beginPath(); context.arc(toMap(project.position[0]), toMap(project.position[2]), 14, 0, Math.PI * 2); context.fill()
    context.fillStyle = '#101a29'; context.font = 'bold 16px sans-serif'; context.textAlign = 'center'; context.textBaseline = 'middle'; context.fillText(String(index + 1), toMap(project.position[0]), toMap(project.position[2]) + 1)
  })
  const x = toMap(vehicle.group.position.x)
  const z = toMap(vehicle.group.position.z)
  context.save()
  context.translate(x, z)
  context.rotate(-vehicle.heading)
  context.fillStyle = '#f4efe5'
  context.beginPath(); context.moveTo(0, -13); context.lineTo(9, 10); context.lineTo(0, 6); context.lineTo(-9, 10); context.closePath(); context.fill()
  context.restore()
}

function interact() {
  if (target) ui.openProject(target)
  else ui.showToast('Pull into a glowing project ring to explore')
}

window.addEventListener('keydown', (event) => {
  if (event.code === 'KeyE' || event.code === 'Enter') interact()
  if (event.code === 'KeyR') { vehicle.respawn(); ui.showToast('Back on track') }
})

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.setSize(window.innerWidth, window.innerHeight)
})

renderer.setAnimationLoop(() => {
  const delta = Math.min(clock.getDelta(), .05)
  vehicle.update(delta, input, !started || ui.modalOpen)
  target = world.update(delta, vehicle.group.position)
  ui.setTarget(target)
  ui.setSpeed(vehicle.speed)
  updateCamera(delta)
  updateMap()
  renderer.render(scene, camera)
  input.endFrame()
})
