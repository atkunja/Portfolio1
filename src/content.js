export const profile = {
  name: 'Kunja',
  role: 'Creative developer & digital builder',
  intro: 'I turn ambitious ideas into thoughtful, useful digital experiences.',
  location: 'Detroit, Michigan',
  email: 'atkunjadia@gmail.com',
  availability: 'Open to interesting collaborations',
}

export const projects = [
  {
    id: 'duet',
    eyebrow: 'Native desktop app · 01',
    title: 'Duet',
    description: 'A local-first native orchestrator where Codex architects and reviews, Claude implements and repairs, and deterministic tests have the final say.',
    image: '/images/project-1.svg',
    tags: ['Tauri', 'Rust', 'React', 'AI tooling'],
    href: 'https://github.com/atkunja/duet',
    position: [-16, 0, -12],
    accent: '#ffb84d',
  },
  {
    id: 'project-two',
    eyebrow: 'Selected work · 02',
    title: 'Project Two',
    description: 'Use this space for the project that best shows how you think, make, and solve hard problems.',
    image: '/images/project-2.svg',
    tags: ['WebGL', 'Three.js', 'Creative dev'],
    href: '#',
    position: [15, 0, -19],
    accent: '#70e1c1',
  },
  {
    id: 'project-three',
    eyebrow: 'Experiment · 03',
    title: 'Project Three',
    description: 'A third destination for an experiment, case study, or personal project you want people to remember.',
    image: '/images/project-3.svg',
    tags: ['Prototype', 'Interaction', 'Motion'],
    href: '#',
    position: [18, 0, 13],
    accent: '#ff6d8a',
  },
]

export const socials = [
  { label: 'GitHub', href: 'https://github.com/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  { label: 'Email', href: `mailto:${profile.email}` },
]
