import { projects } from './content.js'

const experience = [
  ['Software Engineer Intern', 'Barracuda Networks', 'June 2026 – August 2026', 'Saved $12K a month on infrastructure costs.'],
  ['Co-Founder', 'Ether Autonomy, Inc.', 'May 2026 – Present', 'Infrastructure for drones.'],
  ['Operator', 'Taurine Innovations, LLC', 'April 2026 – Present', 'Bootstrapping my rent.'],
  ['Software Engineer Intern', 'Loshi Technologies, LLC', 'June 2025 – August 2025', 'Learned how to code.'],
  ['Crew Member', 'Five Guys', 'September 2023 – June 2024', 'Flipping burgers and collecting a few fryer-oil burns. 🍔'],
]

export class ClassicSite {
  constructor(root, { onChooseGame }) {
    this.onChooseGame = onChooseGame
    root.insertAdjacentHTML('beforeend', this.template())
    this.element = root.querySelector('.classic-site')
    this.element.querySelectorAll('[data-switch-game]').forEach((button) => {
      button.addEventListener('click', () => {
        this.hide()
        this.onChooseGame?.()
      })
    })
  }

  show() {
    this.element.classList.add('active')
    this.element.setAttribute('aria-hidden', 'false')
    this.element.scrollTop = 0
    document.body.classList.add('classic-mode')
  }

  hide() {
    this.element.classList.remove('active')
    this.element.setAttribute('aria-hidden', 'true')
    document.body.classList.remove('classic-mode')
  }

  template() {
    return `
      <div class="classic-site" aria-hidden="true">
        <div class="classic-glow"></div><div class="classic-grain"></div>
        <header class="classic-nav">
          <a href="#classic-top" class="classic-brand"><span></span>Ayush Kunjadia</a>
          <nav><a href="#classic-projects">Projects</a><a href="#classic-experience">Experience</a><a href="#classic-contact">Contact</a><button data-switch-game>Take the cool side →</button></nav>
        </header>
        <main id="classic-top" class="classic-main">
          <section class="classic-hero">
            <div><p class="classic-hand">hey there —</p><h1>hi, i’m Ayush <em>(ah-yoosh)</em></h1><p>I’ve worked on production inference, and I love digging into new tooling. When I’m not building, I’m usually in the gym, playing sports, or grinding on anything that feels interesting.</p><div class="classic-actions"><a class="classic-primary" href="#classic-projects">see my projects</a><a href="#classic-contact">say hi</a></div></div>
            <figure class="classic-polaroid hero-photo"><img src="/classic/MEandMom.jpg" alt="Ayush and his mom"><figcaption>me &amp; mom</figcaption></figure>
          </section>

          <section class="classic-snapshots"><p class="classic-hand">a few snapshots ✿</p><div>
            <figure class="classic-polaroid tilt-left"><img src="/classic/315bench-poster.jpg" alt="Bench pressing 315 pounds"><figcaption>315 bench</figcaption></figure>
            <figure class="classic-polaroid tilt-right wide"><img src="/classic/wrestling.png" alt="Two-time all-state wrestler"><figcaption>2x all-state</figcaption></figure>
          </div></section>

          <section id="classic-projects" class="classic-section"><span class="classic-label">what i’m building</span><h2>Projects</h2><p class="classic-lede">Systems work, native tools, and products I learned by shipping.</p><div class="classic-rule"></div>
            <div class="classic-project-grid">${projects.map((project, index) => `
              <article class="classic-card" style="--tilt:${index % 2 ? '.6deg' : '-.6deg'}"><span class="classic-tape"></span><img src="${project.image}" alt="${project.title} project screenshot"><div class="classic-card-copy"><span>${project.eyebrow}</span><h3>${project.title}</h3><p>${project.description}</p><div class="classic-tags">${project.tags.map((tag) => `<small>${tag}</small>`).join('')}</div><a href="${project.href}" target="_blank" rel="noreferrer">view project ↗</a></div></article>`).join('')}
            </div>
          </section>

          <section id="classic-experience" class="classic-section"><span class="classic-label">the story so far</span><h2>Experience</h2><p class="classic-lede">Where I’ve worked, what I’m building, and what’s next.</p><div class="classic-rule"></div>
            <div class="classic-experience">${experience.map(([title, company, period, description], index) => `<article class="classic-card" style="--tilt:${index % 2 ? '.35deg' : '-.35deg'}"><span class="classic-tape"></span><div><h3>${title}</h3><b>${company}</b><p>${description}</p></div><time>${period}</time></article>`).join('')}</div>
          </section>

          <section id="classic-contact" class="classic-section classic-contact"><span class="classic-label">say hi</span><h2>Let’s make something.</h2><p>Have a project, an opening, or just want to chat? My inbox is open.</p><div class="classic-contact-links"><a href="mailto:ayushkun@umich.edu">ayushkun@umich.edu</a><a href="https://github.com/atkunja" target="_blank" rel="noreferrer">GitHub — atkunja</a><a href="https://www.linkedin.com/in/ayushkunjadia/" target="_blank" rel="noreferrer">LinkedIn — ayush kunjadia</a></div></section>
        </main>
        <footer class="classic-footer"><button data-switch-game>Okay, show me the cool version</button><p>thanks for stopping by · © ${new Date().getFullYear()} Ayush</p></footer>
      </div>`
  }
}
