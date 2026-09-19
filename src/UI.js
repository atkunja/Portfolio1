import { profile } from './content.js'

export class UI {
  constructor({ projects, onStart, onRespawn }) {
    this.projects = projects
    this.onStart = onStart
    this.onRespawn = onRespawn
    this.currentTarget = null
    this.modalOpen = false
    this.app = document.querySelector('#app')
    this.app.innerHTML = this.template()

    this.intro = this.app.querySelector('.intro')
    this.scrim = this.app.querySelector('.scrim')
    this.panels = [...this.app.querySelectorAll('.panel')]
    this.hint = this.app.querySelector('.hint')
    this.hintCopy = this.app.querySelector('.hint-copy')
    this.speedValue = this.app.querySelector('.speed-value')
    this.map = this.app.querySelector('.mini-map')
    this.mapCanvas = this.app.querySelector('#map-canvas')
    this.toast = this.app.querySelector('.toast')

    this.app.querySelector('.start').addEventListener('click', () => {
      this.intro.classList.add('hidden')
      this.onStart?.()
    })
    this.app.querySelector('[data-action="help"]').addEventListener('click', () => this.openPanel('help-panel'))
    this.app.querySelector('[data-action="about"]').addEventListener('click', () => this.openPanel('about-panel'))
    this.app.querySelector('[data-action="respawn"]').addEventListener('click', () => this.onRespawn?.())
    this.app.querySelector('[data-action="map"]').addEventListener('click', () => this.toggleMap())
    this.app.querySelectorAll('.panel-close').forEach((button) => button.addEventListener('click', () => this.closePanels()))
    this.scrim.addEventListener('click', () => this.closePanels())
    window.addEventListener('keydown', (event) => {
      if (event.code === 'Escape') this.closePanels()
      if (event.code === 'KeyM') this.toggleMap()
    })
  }

  template() {
    return `
      <div class="ui">
        <header class="topbar">
          <a class="brand" href="#" aria-label="Return to the start">
            <span class="brand-mark">K</span>
            <span class="brand-copy"><span>${profile.name}</span><span>Creative developer</span></span>
          </a>
          <nav class="icon-row" aria-label="Experience controls">
            <button class="icon-button" data-action="about">About</button>
            <button class="icon-button" data-action="help" aria-label="Open controls">?</button>
            <button class="icon-button" data-action="respawn" aria-label="Respawn vehicle">↻</button>
            <button class="icon-button" data-action="map" aria-label="Toggle map">Map</button>
          </nav>
        </header>
        <div class="toast" role="status"></div>
        <div class="hint"><span class="key">E</span><span class="hint-copy">Explore project</span></div>
        <div class="speed"><span class="speed-value">00</span><span class="speed-label">pixels per dream</span></div>
        <div class="mini-map"><canvas id="map-canvas" width="500" height="500"></canvas><span class="map-label">World map</span></div>
        <div class="touch-controls" aria-label="Touch driving controls">
          <div class="touch-pad"><div class="touch-knob"></div></div>
          <div class="touch-actions"><button class="touch-action" data-touch="jump">↑</button><button class="touch-action" data-touch="boost">B</button></div>
        </div>
        <div class="scrim"></div>
        <section class="panel" id="project-panel" aria-modal="true" role="dialog">
          <button class="icon-button panel-close" aria-label="Close project">×</button>
          <div class="project-layout"><div class="project-art"></div><div class="project-copy"><span class="eyebrow"></span><h2></h2><p></p><div class="tags"></div><a class="cta" target="_blank" rel="noreferrer">View project <span>↗</span></a></div></div>
        </section>
        <section class="panel" id="about-panel" aria-modal="true" role="dialog">
          <button class="icon-button panel-close" aria-label="Close about">×</button>
          <div class="text-panel"><span class="eyebrow">Driver profile</span><h2>Hi, I’m ${profile.name}.</h2><p>${profile.intro}</p><p>I’m based in ${profile.location}. This portfolio is built as a small world because the best way to understand someone’s work is to explore it.</p><a class="cta" href="mailto:${profile.email}">Start a conversation <span>↗</span></a></div>
        </section>
        <section class="panel" id="help-panel" aria-modal="true" role="dialog">
          <button class="icon-button panel-close" aria-label="Close controls">×</button>
          <div class="text-panel"><span class="eyebrow">Controls</span><h2>Take it for a spin.</h2><p>Follow the roads, crash through the little markers, and stop inside a glowing project ring to explore.</p><div class="controls-grid">
            <div class="control-row"><b>WASD / Arrows</b><span>Drive</span></div><div class="control-row"><b>Shift</b><span>Boost</span></div>
            <div class="control-row"><b>Space</b><span>Jump</span></div><div class="control-row"><b>E / Enter</b><span>Interact</span></div>
            <div class="control-row"><b>M</b><span>World map</span></div><div class="control-row"><b>R</b><span>Respawn</span></div>
          </div></div>
        </section>
        <section class="intro">
          <div class="intro-inner"><span class="intro-kicker">Interactive portfolio</span><h1>Drive through<br>my work.</h1><p>${profile.intro} Grab the wheel, explore the world, and pull up at a project that catches your eye.</p><button class="start">Start exploring →</button><div class="intro-help">Keyboard, touch, and gamepad-friendly</div></div>
        </section>
      </div>`
  }

  openProject(project) {
    const panel = this.app.querySelector('#project-panel')
    panel.style.setProperty('--accent', project.accent)
    panel.querySelector('.project-art').style.backgroundImage = `url(${project.image})`
    panel.querySelector('.eyebrow').textContent = project.eyebrow
    panel.querySelector('h2').textContent = project.title
    panel.querySelector('p').textContent = project.description
    panel.querySelector('.tags').innerHTML = project.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')
    const link = panel.querySelector('.cta')
    link.href = project.href
    link.setAttribute('aria-disabled', project.href === '#' ? 'true' : 'false')
    this.openPanel('project-panel')
  }

  openPanel(id) {
    this.closePanels(false)
    this.scrim.classList.add('open')
    this.app.querySelector(`#${id}`).classList.add('open')
    this.modalOpen = true
  }

  closePanels(closeScrim = true) {
    this.panels.forEach((panel) => panel.classList.remove('open'))
    if (closeScrim) this.scrim.classList.remove('open')
    this.modalOpen = false
  }

  setTarget(target) {
    this.currentTarget = target
    this.hint.classList.toggle('visible', Boolean(target) && !this.modalOpen)
    if (target) this.hintCopy.textContent = `Explore ${target.title}`
  }

  setSpeed(speed) { this.speedValue.textContent = String(Math.round(Math.abs(speed) * 7)).padStart(2, '0') }

  toggleMap() { this.map.classList.toggle('expanded') }

  showToast(message) {
    this.toast.textContent = message
    this.toast.classList.add('visible')
    clearTimeout(this.toastTimer)
    this.toastTimer = setTimeout(() => this.toast.classList.remove('visible'), 1800)
  }
}
