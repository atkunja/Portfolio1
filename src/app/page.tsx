// src/app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

// --- Typewriter effect ---
const WORDS = ["Software Engineer", "Builder", "Collaborator"];
function Typewriter({
  words,
  speed = 100,
  pause = 1200,
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
    <span className="text-cyan-400">
      {sub}
      &nbsp;
      <span className="border-r-2 border-cyan-400 animate-pulse"></span>
    </span>
  );
}

// --- DATA ---
const projects = [
  {
    title: "Clinic Finder",
    link: "https://github.com/atkunja/ClinicFinder",
    live: "https://clinic-finder-6krk1j4hv-atkunjas-projects.vercel.app/",
    image: "/projects/clinicfinder.png",
    tech: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Leaflet",
      "Supabase",
      "PostgreSQL",
      "Vercel"
    ],
    description:
      "Health-for-All clinic locator. Map-based search with filters, admin dashboard for adding/editing clinics, and a clean UX to help uninsured patients find free care.",
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
      "React"
    ],
    description:
      "Real-time toxicity detection web app. Fast, private, updatable AI content filter built with Python (Flask, scikit-learn), C++ (offline model runner), Next.js, React, and Tailwind CSS. Frontend and backend communicate via REST API.",
  },
  {
    title: "Manga Animator",
    link: "https://github.com/atkunja/Manga",
    live: "https://mangavideo.streamlit.app/",
    image: "/projects/manga-animator.png",
    tech: ["Python", "Streamlit", "MoviePy", "Docker"],
    description:
      "Transforms static manga panels into anime-style video sequences with seamless transitions. Python, MoviePy, Streamlit, Docker.",
  },
  {
    title: "CodeCollab",
    link: "https://github.com/atkunja/codecollab",
    live: "https://codecollabak.vercel.app/",
    image: "/projects/codecollab.png",
    tech: ["Next.js", "NestJS", "TypeScript", "Tailwind CSS", "Supabase", "Socket.io"],
    description:
      "Full-stack collaborative code editing platform. Next.js, NestJS, Monaco, Supabase, Socket.io.",
  },
];

const experience = [
  {
    company: "Loshi Technologies, LLC",
    title: "Software Engineer Intern",
    link: "https://loshitech.com",
    period: "June 2025 – Present",
    tech: ["React", "Node.js", "PostgreSQL"],
    description:
      "Built and maintained full-stack web applications using React, Node.js, and PostgreSQL. Collaborated with design and product teams to deliver new features, and optimized backend APIs and database queries for better performance.",
  },
];

const skills = [
  "TypeScript",
  "Java",
  "Python",
  "C/C++",
  "JavaScript",
  "HTML/CSS",
  "SQL",
  "Next.js",
  "NestJS",
  "React",
  "Node.js",
  "Tailwind CSS",
  "Supabase",
  "Docker",
  "Socket.io",
  "MoviePy",
  "Streamlit",
];

const interests = [
  "Multiple-time all-state wrestler",
  "Weightlifting",
  "Fishing",
  "Hiking & exploring",
  "Chess",
];

// --- MOBILE NAV ---
function MobileNav({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  return (
    <div
      className={`
        fixed inset-0 z-50 bg-[#0A0C12]/95 backdrop-blur
        transition-transform duration-200
        ${open ? "translate-x-0" : "-translate-x-full"}
        flex md:hidden flex-col items-center justify-center gap-7 text-xl
      `}
    >
      <button
        onClick={() => setOpen(false)}
        className="absolute top-6 right-8 text-4xl text-cyan-400"
        aria-label="Close menu"
      >
        ×
      </button>
      <a href="#projects" onClick={() => setOpen(false)}>Projects</a>
      <a href="#experience" onClick={() => setOpen(false)}>Experience</a>
      <a href="#skills" onClick={() => setOpen(false)}>Skills</a>
      <a href="#interests" onClick={() => setOpen(false)}>Interests</a>
      <a href="#contact" onClick={() => setOpen(false)}>Contact</a>
      <a href="/blog" onClick={() => setOpen(false)}>Blog</a>
      <a href="https://github.com/atkunja" target="_blank" rel="noopener" onClick={() => setOpen(false)}>GitHub</a>
      <a href="https://www.linkedin.com/in/ayushkunjadia/" target="_blank" rel="noopener" onClick={() => setOpen(false)}>LinkedIn</a>
    </div>
  );
}

// --- MAIN COMPONENT ---
export default function Home() {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <div className="bg-[#0A0C12] text-white min-h-screen font-sans">
      {/* NAV */}
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between py-4 px-2 sm:px-4 sticky top-0 z-50 bg-[#0A0C12]/80 backdrop-blur border-b border-gray-900">
        <div className="text-lg sm:text-2xl font-bold tracking-tighter">Ayush Kunjadia</div>
        <div className="hidden md:flex gap-4">
          <a href="#projects" className="hover:text-cyan-300 transition">Projects</a>
          <a href="#experience" className="hover:text-cyan-300 transition">Experience</a>
          <a href="#skills" className="hover:text-cyan-300 transition">Skills</a>
          <a href="#interests" className="hover:text-cyan-300 transition">Interests</a>
          <a href="#contact" className="hover:text-cyan-300 transition">Contact</a>
          <a href="/blog" className="hover:text-cyan-300 transition">Blog</a>
          <a href="https://github.com/atkunja" target="_blank" rel="noopener" className="hover:text-cyan-400 transition">GitHub</a>
          <a href="https://www.linkedin.com/in/ayushkunjadia/" target="_blank" rel="noopener" className="hover:text-cyan-400 transition">LinkedIn</a>
        </div>
        <button className="md:hidden text-3xl text-cyan-400" onClick={() => setMobileNav(true)} aria-label="Open menu">≡</button>
      </nav>

      {/* Mobile Nav Overlay */}
      <MobileNav open={mobileNav} setOpen={setMobileNav} />

      {/* HERO */}
      <header className="flex flex-col items-center justify-center min-h-[40vh] text-center pb-6 px-2">
        <h1 className="text-3xl sm:text-5xl font-extrabold mb-2 drop-shadow-lg">Ayush Kunjadia</h1>
        <div className="text-base sm:text-2xl mb-1 text-cyan-300"><Typewriter words={WORDS} /></div>
        <p className="text-gray-400 max-w-xl mt-2 mb-4 text-base sm:text-lg">
          Aspiring software engineer passionate about building, learning, and sharing knowledge. Always open to new collaborations and exciting challenges.
        </p>
        <div className="flex gap-3">
          <a href="https://github.com/atkunja" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-900 rounded hover:bg-cyan-700">GitHub</a>
          <a href="https://www.linkedin.com/in/ayushkunjadia/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-gray-900 rounded hover:bg-cyan-700">LinkedIn</a>
        </div>
      </header>

      {/* PROJECTS */}
      <section id="projects" className="max-w-6xl mx-auto px-2 sm:px-4 py-10 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-cyan-300">Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {projects.map((p) => (
            <div key={p.title} className="rounded-2xl shadow-lg bg-gradient-to-b from-gray-900/90 to-gray-900/60 border border-gray-800 hover:border-cyan-400 overflow-hidden flex flex-col">
              <a href={p.live} target="_blank" rel="noopener noreferrer" className="block">
                <div className="w-full aspect-video bg-gray-800 relative">
                  <Image src={p.image} alt={p.title} fill style={{objectFit: "cover"}} className="hover:scale-105 transition" />
                </div>
              </a>
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-semibold text-white">{p.title}</h3>
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 underline text-xs">GitHub</a>
                </div>
                <p className="text-gray-300 flex-1">{p.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tech.map((t) => <span key={t} className="bg-cyan-900/40 text-cyan-300 text-xs px-2 py-1 rounded">{t}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="max-w-6xl mx-auto px-2 sm:px-4 py-10 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-cyan-300">Experience</h2>
        <div className="grid grid-cols-1 gap-8">
          {experience.map((exp) => (
            <a key={exp.title} href={exp.link} target="_blank" rel="noopener noreferrer" className="rounded-2xl shadow-lg bg-gradient-to-b from-gray-900/90 to-gray-900/60 border border-gray-800 hover:border-cyan-400 p-6 flex flex-col">
              <div className="flex justify-between mb-2">
                <h3 className="text-xl font-semibold text-white">{exp.title}</h3>
                <span className="text-cyan-400">{exp.period}</span>
              </div>
              <span className="text-gray-400 font-medium mb-2">{exp.company}</span>
              <p className="text-gray-300 flex-1">{exp.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {exp.tech.map((t) => <span key={t} className="bg-cyan-900/40 text-cyan-300 text-xs px-2 py-1 rounded">{t}</span>)}
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="max-w-6xl mx-auto px-2 sm:px-4 py-10 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-cyan-300">Skills</h2>
        <div className="flex flex-wrap gap-3">
          {skills.map((s) => <span key={s} className="bg-gray-800 text-cyan-200 px-3 py-1 rounded-full text-xs">{s}</span>)}
        </div>
      </section>

      {/* INTERESTS */}
      <section id="interests" className="max-w-6xl mx-auto px-2 sm:px-4 py-10 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-cyan-300">Interests</h2>
        <div className="flex flex-wrap gap-4 text-gray-400">
          {interests.map((i) => <span key={i} className="bg-gray-900 px-3 py-2 rounded-lg text-sm">{i}</span>)}
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="max-w-6xl mx-auto px-2 sm:px-4 py-10 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-cyan-300">Contact</h2>
        <p className="mb-6 text-gray-300">Have a project idea in mind or want to collaborate? Let&apos;s connect!</p>
        <form action="https://formspree.io/f/xeozjzzr" method="POST" className="bg-gray-900 rounded-2xl p-6 shadow-md flex flex-col gap-4">
          <input name="name" type="text" placeholder="Name" required className="bg-gray-800 text-white rounded px-3 py-2 focus:ring-2 focus:ring-cyan-400" />
          <input name="email" type="email" placeholder="Email" required className="bg-gray-800 text-white rounded px-3 py-2 focus:ring-2 focus:ring-cyan-400" />
          <textarea name="message" rows={4} placeholder="Message" required className="bg-gray-800 text-white rounded px-3 py-2 focus:ring-2 focus:ring-cyan-400" />
          <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full px-6 py-2 font-semibold">Send Message</button>
        </form>
      </section>

      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-2 sm:px-4 py-6 text-center text-gray-700 text-xs border-t border-gray-800">
        © {new Date().getFullYear()} Ayush Kunjadia
      </footer>
    </div>
  );
}