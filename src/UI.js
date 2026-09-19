import { profile, socials } from './content.js'

export class UI {
  constructor({ projects, onStart, onChooseClassic, onRespawn, onToggleAudio, onResetProgress }) {
    this.projects = projects
    this.onStart = onStart
    this.onChooseClassic = onChooseClassic
    this.onRespawn = onRespawn
    this.onToggleAudio = onToggleAudio
    this.onResetProgress = onResetProgress
    this.audioEnabled = true
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
    this.app.querySelector('.classic-start').addEventListener('click', () => {
      this.intro.classList.add('hidden')
      this.onChooseClassic?.()
    })
    this.app.querySelector('[data-action="help"]').addEventListener('click', () => this.openPanel('help-panel'))
    this.app.querySelector('[data-action="about"]').addEventListener('click', () => this.openPanel('about-panel'))
    this.app.querySelector('[data-action="classic"]').addEventListener('click', () => this.onChooseClassic?.())
    this.app.querySelector('[data-action="respawn"]').addEventListener('click', () => this.onRespawn?.())
    this.app.querySelector('[data-action="map"]').addEventListener('click', () => this.toggleMap())
    this.app.querySelector('[data-action="progress"]').addEventListener('click', () => this.openPanel('progress-panel'))
    this.app.querySelector('[data-action="audio"]').addEventListener('click', (event) => {
      this.audioEnabled = !this.audioEnabled
      event.currentTarget.textContent = this.audioEnabled ? 'Sound on' : 'Sound off'
      event.currentTarget.setAttribute('aria-pressed', String(this.audioEnabled))
      this.onToggleAudio?.(this.audioEnabled)
    })
    this.app.querySelector('[data-action="reset-progress"]').addEventListener('click', () => this.onResetProgress?.())
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
            <span class="brand-copy"><span>${profile.shortName}</span><span>Systems + creative dev</span></span>
          </a>
          <nav class="icon-row" aria-label="Experience controls">
            <button class="icon-button" data-action="classic">Lame side</button>
            <button class="icon-button" data-action="about">About</button>
            <button class="icon-button progress-button" data-action="progress">0/3 found</button>
            <button class="icon-button audio-button" data-action="audio" aria-pressed="true">Sound on</button>
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
          <div class="project-layout"><div class="project-art"></div><div class="project-copy"><span class="eyebrow"></span><h2></h2><p></p><div class="tags"></div><div class="project-actions"><a class="cta" data-project-link target="_blank" rel="noreferrer">View project <span>↗</span></a><a class="cta secondary" data-source-link target="_blank" rel="noreferrer">Source <span>↗</span></a></div></div></div>
        </section>
        <section class="panel" id="about-panel" aria-modal="true" role="dialog">
          <button class="icon-button panel-close" aria-label="Close about">×</button>
          <div class="text-panel"><span class="eyebrow">Driver profile</span><h2>Hi, I’m ${profile.name}.</h2><p>${profile.intro}</p><p>I’m based in ${profile.location}. This portfolio is built as a small world because the best way to understand someone’s work is to explore it.</p><div class="project-actions"><a class="cta" href="mailto:${profile.email}">Start a conversation <span>↗</span></a>${socials.filter(({ label }) => label !== 'Email').map(({ label, href }) => `<a class="cta secondary" href="${href}" target="_blank" rel="noreferrer">${label} ↗</a>`).join('')}</div></div>
        </section>
        <section class="panel" id="help-panel" aria-modal="true" role="dialog">
          <button class="icon-button panel-close" aria-label="Close controls">×</button>
          <div class="text-panel"><span class="eyebrow">Controls</span><h2>Take it for a spin.</h2><p>Follow the roads, crash through the little markers, and stop inside a glowing project ring to explore.</p><div class="controls-grid">
            <div class="control-row"><b>WASD / Arrows</b><span>Drive</span></div><div class="control-row"><b>Shift</b><span>Boost</span></div>
            <div class="control-row"><b>Space</b><span>Jump</span></div><div class="control-row"><b>E / Enter</b><span>Interact</span></div>
            <div class="control-row"><b>M</b><span>World map</span></div><div class="control-row"><b>H</b><span>Honk</span></div>
            <div class="control-row"><b>Drag / Wheel</b><span>Move camera</span></div><div class="control-row"><b>R</b><span>Respawn</span></div>
            <div class="control-row"><b>Esc</b><span>Close panels</span></div>
          </div></div>
        </section>
        <section class="panel" id="progress-panel" aria-modal="true" role="dialog">
          <button class="icon-button panel-close" aria-label="Close progress">×</button>
          <div class="text-panel"><span class="eyebrow">Trip log</span><h2>Your discoveries.</h2><p>Visit every project stop and collect the eight floating sparks hidden along the roads.</p>
            <div class="progress-cards"></div>
            <button class="reset-progress" data-action="reset-progress">Reset saved progress</button>
          </div>
        </section>
        <section class="intro">
          <div class="choice-inner"><span class="intro-kicker">Choose your experience</span><h1>One portfolio.<br>Two timelines.</h1><p>Play it safe with the original site, or grab the wheel and explore the world.</p><div class="choice-grid">
            <button class="choice-card classic-start"><span class="choice-number">01</span><span class="choice-art classic-art"><i></i><i></i><i></i></span><span class="choice-copy"><b>The lame side</b><small>Warm, readable, responsible. The original portfolio.</small></span><span class="choice-arrow">Enter normally →</span></button>
            <button class="choice-card cool-card start"><span class="choice-number">02</span><span class="choice-art cool-art"><i></i><i></i><i></i></span><span class="choice-copy"><b>The cool side</b><small>A tiny car, a whole world, and several bad driving decisions.</small></span><span class="choice-arrow">Start the engine →</span></button>
          </div><div class="intro-help">You can switch sides whenever you want</div></div>
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
    const link = panel.querySelector('[data-project-link]')
    link.href = project.href
    link.setAttribute('aria-disabled', project.href === '#' ? 'true' : 'false')
    const source = panel.querySelector('[data-source-link]')
    source.hidden = !project.source
    if (project.source) source.href = project.source
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

  setProgress(state) {
    this.app.querySelector('.progress-button').textContent = `${state.visited.size}/${this.projects.length} found`
    const cards = [
      ...this.projects.map((project) => ({
        id: project.id,
        label: project.title,
        detail: state.visited.has(project.id) ? 'Discovered' : 'Still out there',
        complete: state.visited.has(project.id),
      })),
      { id: null, label: 'Road sparks', detail: `${state.collected.size}/8 collected`, complete: state.collected.size === 8 },
    ]
    this.app.querySelector('.progress-cards').innerHTML = cards.map((card) => `
      <${card.id ? 'button' : 'div'} class="progress-card ${card.complete ? 'complete' : ''}" ${card.id ? `data-project-id="${card.id}"` : ''}>
        <span class="progress-check">${card.complete ? '✓' : '○'}</span>
        <span><b>${card.label}</b><small>${card.detail}</small></span>
      </${card.id ? 'button' : 'div'}>`).join('')
    this.app.querySelectorAll('[data-project-id]').forEach((button) => {
      button.addEventListener('click', () => {
        const project = this.projects.find(({ id }) => id === button.dataset.projectId)
        if (project) this.openProject(project)
      })
    })
  }

  toggleMap() { this.map.classList.toggle('expanded') }

  showToast(message) {
    this.toast.textContent = message
    this.toast.classList.add('visible')
    clearTimeout(this.toastTimer)
    this.toastTimer = setTimeout(() => this.toast.classList.remove('visible'), 1800)
  }
}
