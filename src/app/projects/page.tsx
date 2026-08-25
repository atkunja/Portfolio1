// src/app/projects/page.tsx
"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { RevealSection, SectionHeading, SiteShell } from "../_components/site";
import { StickerBadge, Tape, TechSticker } from "../_components/scrapbook";

// --- DATA ---
const featured = [
  {
    title: "CudaForge",
    tagline: "GPU-native LLM runtime",
    link: "https://github.com/atkunja/cuda_force",
    badge: "CUDA C++",
    tech: [
      "CUDA C++",
      "C++20",
      "PyTorch",
      "Python",
      "CMake",
      "Docker",
    ],
    description:
      "An LLM fine-tuning and concurrent inference runtime written from the kernels up — custom CUDA ops plus the systems layer that keeps them fed.",
    highlights: [
      "Hand-written kernels (reduction, softmax, RMSNorm, fused LoRA, INT8 quantise) in naive and optimised forms, exposed to PyTorch through the dispatcher.",
      "A concurrent serving stack: bounded MPMC queue, thread pool, deadline-aware batcher, CUDA stream scheduler, and a caching device allocator.",
      "Continuous batching cuts decode steps by 70% for a 1.44x wall-clock win at batch 32; speculative decoding stays lossless against the target distribution.",
      "Verified on a rented RTX 3090 — 19,511 assertions across 69 test cases, clean under TSan, ASan, and UBSan.",
    ],
  },
  {
    title: "Duet",
    tagline: "Codex thinks, Claude builds",
    link: "https://github.com/atkunja/duet",
    badge: "Rust",
    tech: ["Rust", "Tauri", "Tokio", "TypeScript", "React", "SQLite", "Vite"],
    description:
      "A local-first desktop orchestrator that pairs the Claude Code and Codex CLIs — one architects and reviews, the other implements and repairs, and the test suite settles the argument.",
    highlights: [
      "Every run lands in its own managed Git worktree; nothing touches your branch until you explicitly apply the patch.",
      "Cancellable, timeout-bounded Tokio subprocesses stream typed lifecycle events straight into the UI.",
      "Required tests and benchmarks run independently of model opinion — a glowing review never overrides a failing check.",
      "Runs, stages, diffs, and raw logs persist in SQLite, so history survives a restart instead of silently going stale.",
    ],
  },
];

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
  {
    title: "MSU Connect",
    link: "https://github.com/atkunja/msuconnect",
    live: "https://msuconect.org/",
    image: "/projects/msuconnect.png",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase"],
    description:
      "SpartaHacks hackathon project — a networking platform for MSU students to find roommates and connect with classmates.",
  },
  {
    title: "Verde Luxe Cleaning",
    link: "https://github.com/atkunja/cleaning",
    live: "https://verdeluxefinal-production.up.railway.app/",
    image: "/projects/cleaning.png",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Railway"],
    description:
      "Contracted website for a premium eco-friendly cleaning service business.",
  },
];

export default function ProjectsPage() {
  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-5xl px-5 pb-16 pt-14 sm:px-6">
        <SectionHeading
          label="what i'm building now"
          title="Systems work"
          description="The two projects I've spent the most time inside — one down at the GPU, one wrangling coding agents."
        />

        <div className="mb-10">
          <Link
            href="/"
            className="font-hand text-lg text-ink-faint transition hover:text-honey"
          >
            ← back home
          </Link>
        </div>

        <div className="mb-20 flex flex-col gap-8">
          {featured.map((project, idx) => {
            const tilt = idx % 2 === 0 ? -0.6 : 0.6;
            return (
              <RevealSection key={project.title} delay={idx * 120}>
                <article
                  data-tilt
                  style={{ "--tilt": `${tilt}deg` } as CSSProperties}
                  className="warm-card relative px-6 py-7 [transform:rotate(var(--tilt))] transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_18px_40px_rgba(20,12,8,0.55)] motion-safe:hover:[transform:rotate(0deg)_translateY(-4px)] sm:px-8"
                >
                  <Tape className="absolute -top-2 left-8 z-10 h-5 w-20" rotate={-7} />
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                        {project.title}
                      </h3>
                      <p className="mt-1 font-hand text-xl text-ink-faint">
                        {project.tagline}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StickerBadge color="rust" tilt={-2}>
                        {project.badge}
                      </StickerBadge>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-hand text-lg text-ink-faint transition hover:text-honey"
                      >
                        repo →
                      </a>
                    </div>
                  </div>

                  <p className="mt-4 max-w-prose leading-relaxed text-ink-muted">
                    {project.description}
                  </p>

                  <ul className="mt-5 flex flex-col gap-3">
                    {project.highlights.map((point) => (
                      <li
                        key={point}
                        className="flex gap-3 text-sm leading-relaxed text-ink-muted"
                      >
                        <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-honey" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {project.tech.map((tech) => (
                      <TechSticker key={`${project.title}-${tech}`}>{tech}</TechSticker>
                    ))}
                  </div>
                </article>
              </RevealSection>
            );
          })}
        </div>

        <SectionHeading
          label="where it started"
          title="Starter projects that helped me learn how to code"
          description="The early builds where I figured things out — shipping, breaking, and fixing until each one stuck."
        />

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project, idx) => {
            const tilt = idx % 2 === 0 ? -1.2 : 1.2;
            return (
              <RevealSection key={project.title} delay={idx * 100}>
                <article
                  data-tilt
                  style={{ "--tilt": `${tilt}deg` } as CSSProperties}
                  className="warm-card group relative flex h-full flex-col overflow-hidden [transform:rotate(var(--tilt))] transition-[transform,box-shadow] duration-300 ease-out hover:shadow-[0_18px_40px_rgba(20,12,8,0.55)] motion-safe:hover:[transform:rotate(0deg)_translateY(-6px)]"
                >
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block"
                  >
                    <Tape className="absolute -top-2 left-6 z-10 h-5 w-20" rotate={-8} />
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition duration-500 ease-out group-hover:scale-[1.03]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg-base/75 via-transparent to-transparent" />
                      <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <StickerBadge color="honey" tilt={-3}>
                          Live
                        </StickerBadge>
                        <StickerBadge color="sage">{project.tech[0]}</StickerBadge>
                      </div>
                    </div>
                  </a>
                  <div className="flex flex-1 flex-col gap-4 px-6 pb-6 pt-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-xl font-semibold text-ink">
                          {project.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                          {project.description}
                        </p>
                      </div>
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 font-hand text-base text-ink-faint transition hover:text-honey"
                      >
                        repo →
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech) => (
                        <TechSticker key={`${project.title}-${tech}`}>{tech}</TechSticker>
                      ))}
                    </div>
                  </div>
                </article>
              </RevealSection>
            );
          })}
        </div>
      </main>
    </SiteShell>
  );
}
