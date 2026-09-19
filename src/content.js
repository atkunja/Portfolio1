export const profile = {
  name: 'Ayush Kunjadia',
  shortName: 'Ayush',
  role: 'Systems engineer & creative developer',
  intro: 'I build ambitious software across GPU systems, native tools, and thoughtful web experiences.',
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
    image: '/images/duet.png',
    tags: ['Tauri', 'Rust', 'React', 'AI tooling'],
    href: 'https://github.com/atkunja/duet',
    position: [-16, 0, -12],
    accent: '#ffb84d',
  },
  {
    id: 'cudaforge',
    eyebrow: 'GPU systems · 02',
    title: 'CudaForge',
    description: 'An LLM fine-tuning and concurrent inference runtime built from the kernels up, combining custom CUDA operations with the systems layer that keeps them fed.',
    image: '/images/cudaforge.png',
    tags: ['CUDA C++', 'C++20', 'PyTorch', 'Python'],
    href: 'https://github.com/atkunja/cuda_force',
    position: [15, 0, -19],
    accent: '#70e1c1',
  },
  {
    id: 'clinic-finder',
    eyebrow: 'Product build · 03',
    title: 'Clinic Finder',
    description: 'A location-aware clinic discovery app with map filters, administrative tools, and a Supabase-backed directory for finding nearby care.',
    image: '/images/clinicfinder.png',
    tags: ['Next.js', 'TypeScript', 'Leaflet', 'Supabase'],
    href: 'https://clinic-finder-pi.vercel.app/',
    source: 'https://github.com/atkunja/ClinicFinder',
    position: [18, 0, 13],
    accent: '#ff6d8a',
  },
]

export const socials = [
  { label: 'GitHub', href: 'https://github.com/atkunja' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/ayushkunjadia/' },
  { label: 'Email', href: `mailto:${profile.email}` },
]
