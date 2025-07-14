"use client";
import { useState, useEffect } from "react";
import Image from "next/image";


const WORDS = ["Software Engineer", "Builder", "Collaborator"];
function Typewriter({ words, speed = 100, pause = 1200 }: { words: string[], speed?: number, pause?: number }) {
  const [index, setIndex] = useState(0);
  const [sub, setSub] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    if (!deleting && sub.length < word.length) {
      const timeout = setTimeout(() => setSub(word.slice(0, sub.length + 1)), speed);
      return () => clearTimeout(timeout);
    }
    if (!deleting && sub.length === word.length) {
      const timeout = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(timeout);
    }
    if (deleting && sub.length > 0) {
      const timeout = setTimeout(() => setSub(word.slice(0, sub.length - 1)), speed / 2);
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
    <span className="text-cyan-400">{sub}&nbsp;<span className="border-r-2 border-cyan-400 animate-pulse"></span></span>
  );
}


const projects = [
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
    period: "Present",
    tech: ["TypeScript", "Python", "React"],
    description: "Worked as a software engineer intern building and maintaining core web products.",
  },
];

const skills = [
  "TypeScript", "Java", "Python", "C/C++", "JavaScript", "HTML/CSS", "SQL",
  "Next.js", "NestJS", "React", "Node.js", "Tailwind CSS",
  "Supabase", "Docker", "Socket.io", "MoviePy", "Streamlit"
];

const interests = [
  "Wrestling",
  "Weightlifting",
  "Fishing",
  "Hiking & exploring",
  "Chess"
];


export default function Home() {
  return (
    <div className="bg-[#0A0C12] text-white min-h-screen font-sans">
      {/* NAV */}
      <nav className="w-full max-w-6xl mx-auto flex items-center justify-between py-6 px-4 sticky top-0 z-50 bg-[#0A0C12]/80 backdrop-blur border-b border-gray-900">
        <div className="text-2xl font-bold tracking-tighter">Ayush Kunjadia</div>
        <div className="flex gap-4">
          <a href="#projects" className="hover:text-cyan-300 transition">Projects</a>
          <a href="#experience" className="hover:text-cyan-300 transition">Experience</a>
          <a href="#skills" className="hover:text-cyan-300 transition">Skills</a>
          <a href="#interests" className="hover:text-cyan-300 transition">Interests</a>
          <a href="https://github.com/atkunja" target="_blank" rel="noopener" className="hover:text-cyan-400 transition">GitHub</a>
          <a href="https://www.linkedin.com/in/ayushkunjadia/" target="_blank" rel="noopener" className="hover:text-cyan-400 transition">LinkedIn</a>
        </div>
      </nav>
      {/* HERO */}
      <header className="flex flex-col items-center justify-center min-h-[40vh] text-center pb-8 px-2">
        <h1 className="text-5xl sm:text-6xl font-extrabold mb-3 tracking-tight drop-shadow-lg">Ayush Kunjadia</h1>
        <div className="text-xl sm:text-2xl mb-2 text-cyan-300">
          <Typewriter words={WORDS} />
        </div>
        <p className="text-gray-400 max-w-xl mt-4 mb-6 text-lg">
          Aspiring software engineer passionate about building, learning, and sharing knowledge. Always open to new collaborations and exciting challenges.
        </p>
        <div className="flex gap-4 mt-3">
          <a href="https://github.com/atkunja" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded bg-gray-900 hover:bg-cyan-700 text-white shadow transition">GitHub</a>
          <a href="https://www.linkedin.com/in/ayushkunjadia/" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded bg-gray-900 hover:bg-cyan-700 text-white shadow transition">LinkedIn</a>
        </div>
      </header>
      {/* PROJECTS */}
      <section id="projects" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 text-cyan-300">Projects</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((p) => (
            <div
              key={p.title}
              className="rounded-2xl shadow-lg bg-gradient-to-b from-gray-900/90 to-gray-900/60 border border-gray-800 hover:border-cyan-400 hover:shadow-cyan-800/30 transition overflow-hidden flex flex-col"
            >
              <a href={p.live} target="_blank" rel="noopener noreferrer" className="block">
                <div className="w-full aspect-video bg-gray-800 relative">
                  <Image
                    src={p.image}
                    alt={p.title + " screenshot"}
                    fill
                    style={{objectFit: "cover"}}
                    className="transition-transform duration-300 hover:scale-105"
                    priority={false}
                  />
                </div>
              </a>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white">{p.title}</h3>
                  <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 underline text-xs">GitHub</a>
                  <a href={p.live} target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline text-xs">Live</a>
                </div>
                <div className="flex flex-wrap gap-2 mb-3 mt-1">
                  {p.tech.map((tech) => (
                    <span key={tech} className="bg-cyan-900/40 text-cyan-300 text-xs px-2 py-1 rounded">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="text-gray-300 text-sm mt-1">{p.description}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      {/* EXPERIENCE */}
      <section id="experience" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold mb-8 text-cyan-300">Experience</h2>
        <div className="grid md:grid-cols-1 gap-8">
          {experience.map((exp) => (
            <a
              key={exp.title}
              href={exp.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl shadow-lg bg-gradient-to-b from-gray-900/90 to-gray-900/60 border border-gray-800 hover:border-cyan-400 hover:shadow-cyan-800/30 transition flex flex-col p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                <span className="text-cyan-400 text-base">{exp.period}</span>
              </div>
              <span className="text-gray-400 font-semibold mb-2">{exp.company}</span>
              <div className="flex flex-wrap gap-2 mb-3">
                {exp.tech.map((tech) => (
                  <span key={tech} className="bg-cyan-900/40 text-cyan-300 text-xs px-2 py-1 rounded">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="text-gray-300 text-sm">{exp.description}</div>
            </a>
          ))}
        </div>
      </section>
      {/* SKILLS */}
      <section id="skills" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold mb-4 text-cyan-300">Skills & Technologies</h2>
        <ul className="flex flex-wrap gap-3">
          {skills.map((skill) => (
            <li
              key={skill}
              className="bg-gray-800 text-cyan-200 px-3 py-1 rounded-full text-sm shadow"
            >
              {skill}
            </li>
          ))}
        </ul>
      </section>
      {/* HOBBIES / INTERESTS */}
      <section id="interests" className="max-w-6xl mx-auto px-4 py-20">
        <h2 className="text-2xl font-bold mb-4 text-cyan-300">Interests</h2>
        <ul className="flex flex-wrap gap-4 text-gray-400">
          {interests.map((interest) => (
            <li key={interest} className="bg-gray-900 px-4 py-2 rounded-lg text-base">
              {interest}
            </li>
          ))}
        </ul>
      </section>
      {/* FOOTER */}
      <footer className="max-w-6xl mx-auto px-4 py-8 text-center text-gray-700 text-sm border-t border-gray-800">
        © {new Date().getFullYear()} Ayush Kunjadia. All rights reserved.
      </footer>
    </div>
  );
}
