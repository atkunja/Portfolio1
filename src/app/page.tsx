// src/app/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import Image from "next/image";

// --- Typewriter effect ---
const WORDS = ["Software Engineer", "Full-stack developer", "Team collaborator"];

function Typewriter({
  words,
  speed = 85,
  pause = 900,
}: {
  words: string[];
  speed?: number;
  pause?: number;
}) {
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    if (!deleting && sub.length < word.length) {
      const timeout = setTimeout(
        () => setSub(word.slice(0, sub.length + 1)),
        speed
      );
      return () => clearTimeout(timeout);
    }
    if (!deleting && sub.length === word.length) {
      const timeout = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(timeout);
    }
    if (deleting && sub.length > 0) {
      const timeout = setTimeout(
        () => setSub(word.slice(0, sub.length - 1)),
        speed / 2
      );
      return () => clearTimeout(timeout);
    }
    if (deleting && sub.length === 0) {
      const timeout = setTimeout(() => {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      }, speed);
      return () => clearTimeout(timeout);
    }
  }, [sub, deleting, index, words, speed, pause]);

  return (
    <span className="relative">
      <span className="text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.5)]">
        {sub}
      </span>
      <span className="absolute right-[-12px] top-0 h-full w-[10px] bg-cyan-400/80 animate-pulse"></span>
    </span>
  );
}

// --- DATA ---
const projects = [
  {
    title: "Clinic Finder",
    link: "https://github.com/atkunja/ClinicFinder",
    live: "https://clinic-finder-pi.vercel.app/",
    image: "/projects/clinicfinder.png",
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Leaflet",
      "Supabase",
      "PostgreSQL",
      "Vercel",
    ],
    description:
      "Find nearby clinics with map filters, admin tools, and Supabase data.",
  },
  {
    title: "ToxicFilter",
    link: "https://github.com/atkunja/toxicfilter",
    live: "https://toxicfilter.vercel.app/",
    image: "/projects/toxicfilter.png",
    tech: [
      "Next.js",
      "Tailwind CSS",
      "Flask",
      "Python",
      "C++",
      "Machine Learning",
      "scikit-learn",
      "React",
    ],
    description:
      "Classifies toxic text in real time using Flask, C++, and a simple React UI.",
  },
  {
    title: "Manga Animator",
    link: "https://github.com/atkunja/Manga",
    live: "https://mangavideo.streamlit.app/",
    image: "/projects/manga-animator.png",
    tech: ["Python", "Streamlit", "MoviePy", "Docker"],
    description:
      "Turns manga panels into short videos with motion, captions, and auto-editing.",
  },
  {
    title: "CodeCollab",
    link: "https://github.com/atkunja/codecollab",
    live: "https://codecollab.chat",
    image: "/projects/codecollab.png",
    tech: ["Next.js", "NestJS", "TypeScript", "Tailwind CSS", "Supabase", "Socket.io"],
    description:
      "Browser-based collaborative editor with auth, NestJS APIs, and low-latency sessions.",
  },
];

const experience = [
  {
    company: "Loshi Technologies, LLC",
    title: "Software Engineer Intern",
    link: "https://loshitech.com",
    period: "June 2025 – August 2025",
    tech: ["React", "Node.js", "PostgreSQL", "Supabase"],
    description:
      "Shipped features in React and Node, improved Postgres queries, and worked with design to refine UX.",
  },
];

const skillCategories = [
  {
    title: "Languages & Core",
    items: ["TypeScript", "JavaScript", "Java", "Python", "C/C++", "SQL"],
  },
  {
    title: "Web & Frontend",
    items: ["Next.js", "React", "Tailwind CSS", "HTML/CSS", "Headless UI", "React Router"],
  },
  {
    title: "Backend & Cloud",
    items: ["Node.js", "NestJS", "Supabase", "PostgreSQL", "Socket.io", "Docker"],
  },
  {
    title: "ML, Media & Tools",
    items: ["Machine Learning", "scikit-learn", "MoviePy", "Streamlit", "REST APIs", "Git"],
  },
];

const marqueeSkillLoop = Array.from(
  new Set(skillCategories.flatMap((category) => category.items))
);

const interests = [
  "Multiple-time all-state wrestler",
  "Strength training & Olympic lifts",
  "Fishing adventures",
  "Trail hiking & exploration",
  "Tactical chess battles",
];

const heroHighlights = [
  "Building tools people actually use",
  "Comfortable across frontend and backend",
  "Enjoy pairing with teammates and shipping often",
  "Happy to keep things simple and readable",
];

type OrbConfig = {
  size: number;
  top: string;
  left: string;
  color: string;
  delay?: string;
  duration?: string;
  blur?: number;
};

const ORBS: OrbConfig[] = [
  {
    size: 520,
    top: "-12%",
    left: "-8%",
    color: "radial-gradient(circle, rgba(6,182,212,0.45), transparent 60%)",
    duration: "20s",
  },
  {
    size: 420,
    top: "14%",
    left: "72%",
    color: "radial-gradient(circle, rgba(217,70,239,0.45), transparent 62%)",
    delay: "-6s",
    duration: "24s",
  },
  {
    size: 380,
    top: "55%",
    left: "8%",
    color: "radial-gradient(circle, rgba(59,130,246,0.38), transparent 65%)",
    delay: "-4s",
  },
  {
    size: 320,
    top: "78%",
    left: "60%",
    color: "radial-gradient(circle, rgba(250,204,21,0.22), transparent 70%)",
    delay: "-10s",
    duration: "26s",
    blur: 8,
  },
];

function FloatingOrbs() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-[1]">
      {ORBS.map((orb, idx) => (
        <span
          key={idx}
          className="orb"
          style={{
            width: orb.size,
            height: orb.size,
            top: orb.top,
            left: orb.left,
            background: orb.color,
            animationDelay: orb.delay,
            animationDuration: orb.duration,
            filter: orb.blur ? `blur(${orb.blur}px)` : undefined,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-12 flex flex-col gap-4 text-center md:text-left">
      <span className="accent-gradient self-center md:self-start">{label}</span>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
        {title}
      </h2>
      {description ? (
        <p className="text-white/60 max-w-2xl md:text-base text-sm md:leading-relaxed leading-relaxed self-center md:self-start">
          {description}
        </p>
      ) : null}
      <div className="gradient-divider" />
    </div>
  );
}

// --- MOBILE NAV ---
function MobileNav({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-[#05070f]/95 px-8 text-lg uppercase tracking-[0.18em] text-white/85 backdrop-blur-xl transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <button
        onClick={() => setOpen(false)}
        className="absolute right-8 top-6 text-4xl text-cyan-300"
        aria-label="Close menu"
      >
        ×
      </button>
      {[
        { label: "Projects", href: "#projects" },
        { label: "Experience", href: "#experience" },
        { label: "Skills", href: "#skills" },
        { label: "Interests", href: "#interests" },
        { label: "Contact", href: "#contact" },
        { label: "Blog", href: "/blog" },
      ].map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="tracking-[0.3em] transition hover:text-cyan-300"
          onClick={() => setOpen(false)}
        >
          {item.label}
        </a>
      ))}
      <a
        href="https://github.com/atkunja"
        target="_blank"
        rel="noopener"
        className="tracking-[0.3em] text-cyan-200 transition hover:text-white"
        onClick={() => setOpen(false)}
      >
        GitHub
      </a>
      <a
        href="https://www.linkedin.com/in/ayushkunjadia/"
        target="_blank"
        rel="noopener"
        className="tracking-[0.3em] text-cyan-200 transition hover:text-white"
        onClick={() => setOpen(false)}
      >
        LinkedIn
      </a>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function Home() {
  const [mobileNav, setMobileNav] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const marqueeItems = useMemo(
    () => [...marqueeSkillLoop, ...marqueeSkillLoop],
    []
  );

  const spotlightStyle = useMemo(
    () => ({
      "--x": `${spotlightPos.x}%`,
      "--y": `${spotlightPos.y}%`,
    }) as CSSProperties,
    [spotlightPos]
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#05070f] text-white">
      <div className="bg-grid-overlay" />
      <FloatingOrbs />

      {/* NAV */}
      <nav className="sticky top-4 z-40 mx-auto flex w-[calc(100%-1.5rem)] max-w-6xl items-center justify-between rounded-full border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-xl shadow-[0_8px_40px_rgba(7,89,133,0.35)]">
        <div className="flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-white/70">
          <span className="pulse-ring relative inline-flex h-3 w-3 items-center justify-center">
            <span className="h-[6px] w-[6px] rounded-full bg-cyan-400"></span>
          </span>
          <span>Ayush Kunjadia</span>
        </div>
        <div className="hidden items-center gap-6 text-sm font-medium text-white/70 md:flex">
          {[
            { label: "Projects", href: "#projects" },
            { label: "Experience", href: "#experience" },
            { label: "Skills", href: "#skills" },
            { label: "Interests", href: "#interests" },
            { label: "Contact", href: "#contact" },
            { label: "Blog", href: "/blog" },
          ].map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="transition hover:text-cyan-300"
            >
              {item.label}
            </a>
          ))}
          <a
            href="https://github.com/atkunja"
            target="_blank"
            rel="noopener"
            className="transition hover:text-cyan-300"
          >
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/ayushkunjadia/"
            target="_blank"
            rel="noopener"
            className="transition hover:text-cyan-300"
          >
            LinkedIn
          </a>
        </div>
        <button
          className="md:hidden text-3xl text-cyan-300"
          onClick={() => setMobileNav(true)}
          aria-label="Open navigation"
        >
          ≡
        </button>
      </nav>

      {/* Mobile Nav Overlay */}
      <MobileNav open={mobileNav} setOpen={setMobileNav} />

      <main className="relative z-10">
        {/* HERO */}
        <header
          className="relative mx-auto flex w-[calc(100%-1.5rem)] max-w-4xl flex-col items-center px-4 pt-24 pb-16 text-center sm:px-6"
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            setSpotlightPos({
              x: ((event.clientX - rect.left) / rect.width) * 100,
              y: ((event.clientY - rect.top) / rect.height) * 100,
            });
          }}
          onMouseLeave={() => {
            setSpotlightPos({ x: 50, y: 50 });
          }}
        >
          <div className="absolute inset-0 -z-[1] rounded-[2.5rem] bg-white/3 blur-3xl" />
          <div className="spotlight" style={spotlightStyle} />

          <div className="flex flex-col items-center text-center">
            <span className="accent-gradient">Software engineer</span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-white drop-shadow-[0_0_48px_rgba(6,182,212,0.2)] sm:text-5xl">
              I build reliable software for the web and backend.
            </h1>
            <div className="mt-6 text-lg text-white/75 sm:text-xl">
              <Typewriter words={WORDS} />
            </div>
            <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base sm:leading-relaxed">
              I like working with teams, shipping clear features, and keeping things easy to use. If you need someone who can move between frontend and backend, I can help.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://github.com/atkunja"
                target="_blank"
                rel="noopener noreferrer"
                className="neon-button px-6 py-2 text-sm"
              >
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/ayushkunjadia/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/15 px-6 py-2 text-sm font-semibold text-white/80 transition hover:border-cyan-300/70 hover:text-cyan-200"
              >
                Say hello
              </a>
            </div>
            <ul className="mt-10 flex flex-col gap-3 text-left text-sm text-white/60">
              {heroHighlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-md transition hover:border-cyan-300/50 hover:text-cyan-100"
                >
                  <span className="mt-[4px] h-2 w-2 rounded-full bg-cyan-300" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

        </header>

        {/* SKILL MARQUEE */}
        <section className="mx-auto w-[calc(100%-1.5rem)] max-w-6xl px-4 pb-12 sm:px-6">
          <div className="marquee rounded-full border border-white/10 bg-white/5 px-6 py-4">
            <div className="marquee-track text-xs uppercase tracking-[0.4em] text-white/60">
              {marqueeItems.map((item, idx) => (
                <span key={`${item}-${idx}`} className="accent-gradient">
                  #{item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="mx-auto w-[calc(100%-1.5rem)] max-w-6xl px-4 pb-20 sm:px-6">
          <SectionHeading
            label="Work"
            title="Projects I&apos;ve built"
            description="A few things I shipped recently."
          />
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project.title}
                className="group glass-panel flex h-full flex-col overflow-hidden rounded-[2.25rem] border border-white/10 transition duration-500 hover:-translate-y-2 hover:border-cyan-300/60"
              >
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative block"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={project.image}
                      alt={project.title}
                      fill
                      sizes="(min-width: 768px) 50vw, 100vw"
                      className="object-cover transition duration-[1200ms] ease-out group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-90 transition group-hover:opacity-100" />
                    <div className="absolute bottom-5 left-5 flex items-center gap-2">
                      <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-white/70">
                        Live
                      </span>
                      <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-[11px] uppercase tracking-[0.35em] text-cyan-200">
                        {project.tech[0]}
                      </span>
                    </div>
                  </div>
                </a>
                <div className="flex flex-1 flex-col gap-5 px-6 pb-6 pt-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {project.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-white/65">
                        {project.description}
                      </p>
                    </div>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs uppercase tracking-[0.35em] text-white/50 transition hover:text-cyan-200"
                    >
                      Repo
                    </a>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <span
                        key={`${project.title}-${tech}`}
                        className="badge-item relative rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/60"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="mx-auto w-[calc(100%-1.5rem)] max-w-6xl px-4 pb-20 sm:px-6">
          <SectionHeading
            label="Timeline"
            title="Experience"
            description="Places I&apos;ve worked and what I did there."
          />
          <ul className="timeline relative space-y-10">
            {experience.map((exp) => (
              <li key={exp.title} className="glass-panel rounded-[2rem] border border-white/10 px-6 py-8">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-2xl font-semibold text-white">
                    {exp.title}
                  </h3>
                  <span className="rounded-full border border-cyan-400/50 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-cyan-200">
                    {exp.period}
                  </span>
                </div>
                <a
                  href={exp.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex text-sm uppercase tracking-[0.3em] text-white/60 transition hover:text-cyan-200"
                >
                  {exp.company}
                </a>
                <p className="mt-4 text-sm leading-relaxed text-white/65">
                  {exp.description}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {exp.tech.map((tech) => (
                    <span
                      key={`${exp.title}-${tech}`}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white/60"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* SKILLS */}
        <section id="skills" className="mx-auto w-[calc(100%-1.5rem)] max-w-6xl px-4 pb-20 sm:px-6">
          <SectionHeading
            label="Stack"
            title="Skills and tools"
            description="Languages and frameworks I use often."
          />
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {skillCategories.map((category) => (
              <div
                key={category.title}
                className="glass-panel flex flex-col gap-4 rounded-[2rem] border border-white/10 px-6 py-8 transition duration-500 hover:-translate-y-2 hover:border-cyan-300/60"
              >
                <span className="text-xs uppercase tracking-[0.4em] text-white/60">
                  {category.title}
                </span>
                <div className="flex flex-wrap gap-3">
                  {category.items.map((item) => (
                    <span
                      key={`${category.title}-${item}`}
                      className="badge-item relative rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-white/65"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* INTERESTS */}
        <section id="interests" className="mx-auto w-[calc(100%-1.5rem)] max-w-6xl px-4 pb-20 sm:px-6">
          <SectionHeading
            label="Beyond code"
            title="Outside of work"
            description="How I recharge and stay curious."
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {interests.map((interest) => (
              <div
                key={interest}
                className="glass-panel flex items-center gap-4 rounded-[2rem] border border-white/10 px-6 py-5 text-sm text-white/70 transition hover:-translate-y-1 hover:border-cyan-300/60"
              >
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                <span>{interest}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="mx-auto w-[calc(100%-1.5rem)] max-w-6xl px-4 pb-24 sm:px-6">
          <SectionHeading
            label="Collab"
            title="Get in touch"
            description="Have a project or opening? Let&apos;s talk."
          />
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_1fr]">
            <div className="glass-panel rounded-[2.5rem] border border-white/10 px-8 py-10 text-sm leading-relaxed text-white/65">
              <h3 className="text-2xl font-semibold text-white">Let&apos;s build something steady.</h3>
              <p className="mt-6">
                If you need help shipping a clear feature set or keeping a product stable, I&apos;m happy to help.
              </p>
              <div className="mt-8 grid gap-4 text-white/70">
                <a
                  href="mailto:ayushkun@umich.edu"
                  className="badge-item relative inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 uppercase tracking-[0.3em] text-xs transition hover:border-cyan-300/50 hover:text-cyan-100"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  ayushkun@umich.edu
                </a>
                <a
                  href="https://github.com/atkunja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge-item relative inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 uppercase tracking-[0.3em] text-xs transition hover:border-cyan-300/50 hover:text-cyan-100"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  GitHub
                </a>
                <a
                  href="https://www.linkedin.com/in/ayushkunjadia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="badge-item relative inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 uppercase tracking-[0.3em] text-xs transition hover:border-cyan-300/50 hover:text-cyan-100"
                >
                  <span className="h-2 w-2 rounded-full bg-cyan-300" />
                  LinkedIn
                </a>
              </div>
            </div>
            <form
              action="https://formspree.io/f/xeozjzzr"
              method="POST"
              className="glass-panel rounded-[2.5rem] border border-white/10 px-8 py-10"
            >
              <div className="grid gap-5">
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                  Name
                  <input
                    name="name"
                    type="text"
                    required
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  />
                </label>
                <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.3em] text-white/60">
                  Message
                  <textarea
                    name="message"
                    rows={5}
                    placeholder="Tell me about the project, stack, or dream."
                    required
                    className="min-h-[140px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-cyan-300/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/40"
                  />
                </label>
                <button type="submit" className="neon-button px-6 py-3 text-sm uppercase tracking-[0.35em]">
                  Send it
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="mx-auto w-[calc(100%-1.5rem)] max-w-6xl px-4 pb-10 text-center text-xs uppercase tracking-[0.4em] text-white/40 sm:px-6">
        © {new Date().getFullYear()} Ayush Kunjadia · Thanks for stopping by
      </footer>
    </div>
  );
}
