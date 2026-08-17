// src/app/page.tsx
import type { CSSProperties } from "react";
import Link from "next/link";
import { RevealSection, SectionHeading, SiteShell } from "./_components/site";
import {
  PolaroidFrame,
  StickerBadge,
  Tape,
  TechSticker,
} from "./_components/scrapbook";

// --- DATA ---
type Experience = {
  company: string;
  title: string;
  link?: string;
  period: string;
  tech: string[];
  description: string;
};

// Reverse-chronological (most recent first)
const experience: Experience[] = [
  {
    company: "Barracuda Networks",
    title: "Software Engineer Intern",
    link: "https://www.barracuda.com",
    period: "June 2026 – August 2026",
    tech: [],
    description: "Saved $12K a month on infrastructure costs.",
  },
  {
    company: "Ether Autonomy, Inc.",
    title: "Co-Founder",
    period: "May 2026 – Present",
    tech: [],
    description: "Infrastructure for drones.",
  },
  {
    company: "Taurine Innovations, LLC",
    title: "Operator",
    period: "April 2026 – Present",
    tech: [],
    description: "Bootstrapping my run.",
  },
  {
    company: "Loshi Technologies, LLC",
    title: "Software Engineer Intern",
    link: "https://loshitech.com",
    period: "June 2025 – August 2025",
    tech: [],
    description: "Learn how to code.",
  },
  {
    company: "Five Guys",
    title: "Crew Member",
    period: "September 2023 – June 2024",
    tech: [],
    description: "Flipping burgers and collecting a few fryer-oil burns. 🍔",
  },
];

const contactLinks = [
  { label: "ayushkun@umich.edu", href: "mailto:ayushkun@umich.edu", external: false },
  { label: "GitHub — atkunja", href: "https://github.com/atkunja", external: true },
  { label: "LinkedIn — ayush kunjadia", href: "https://www.linkedin.com/in/ayushkunjadia/", external: true },
];

export default function Home() {
  return (
    <SiteShell>
      <main className="mx-auto w-full max-w-5xl px-5 sm:px-6">
        {/* HERO */}
        <section className="grid items-center gap-10 pb-10 pt-12 md:grid-cols-[1.15fr_0.85fr] md:pt-16">
          <div>
            <p className="font-hand text-2xl text-honey">hey there —</p>
            <h1 className="mt-1 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              hi, i&apos;m Ayush{" "}
              <span className="whitespace-nowrap font-hand text-3xl text-ink-faint">
                (ah-yoosh)
              </span>
            </h1>
            <p className="mt-5 max-w-prose text-lg leading-relaxed text-ink-muted">
              i&apos;ve worked on production inference, and i love digging into new
              tooling. when i&apos;m not building, i&apos;m usually in the gym,
              playing sports, or grinding on anything that feels interesting.
            </p>
            <p className="mt-4 text-ink-muted">
              you can reach me on linkedin —{" "}
              <a
                href="https://www.linkedin.com/in/ayushkunjadia/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-honey underline decoration-honey/40 underline-offset-4 transition hover:decoration-honey"
              >
                ayush kunjadia
              </a>
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link href="/projects" className="warm-button px-5 py-2.5 text-sm">
                see my projects
              </Link>
              <a
                href="#contact"
                className="rounded-full border border-border px-5 py-2.5 text-sm text-ink-muted transition hover:border-honey/60 hover:text-honey"
              >
                say hi
              </a>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <PolaroidFrame
              src="/MEandMom.jpg"
              alt="Ayush and his mom"
              caption="me & mom"
              tilt={2.5}
              tape="top"
              aspect="4/5"
              priority
              className="w-[min(15rem,72vw)] sm:w-64"
            />
          </div>
        </section>

        {/* SNAPSHOTS */}
        <section id="snapshots" className="pb-16 pt-4">
          <p className="mb-8 text-center font-hand text-2xl text-ink-faint">
            a few snapshots ✿
          </p>
          <div className="flex flex-wrap items-start justify-center gap-x-10 gap-y-8">
            <RevealSection delay={0}>
              <PolaroidFrame
                media="video"
                src="/315bench.mp4"
                poster="/315bench-poster.jpg"
                alt="Bench pressing 315 pounds"
                caption="315 bench"
                tilt={-2}
                aspect="4/5"
                className="w-[min(13rem,72vw)] sm:w-56"
              />
            </RevealSection>
            <RevealSection delay={140}>
              <PolaroidFrame
                src="/projects/wrestling.png"
                alt="2x all-state wrestler"
                caption="2x all-state"
                tilt={1.5}
                aspect="4/3"
                className="w-[min(16rem,72vw)] sm:w-72"
              />
            </RevealSection>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section id="experience" className="pb-16">
          <SectionHeading
            label="the story so far"
            title="Experience"
            description="Where I've worked, what I'm building, and what's next."
          />
          <div className="flex flex-col gap-6">
            {experience.map((exp, idx) => {
              const tilt = idx % 2 === 0 ? -0.8 : 0.8;
              return (
                <RevealSection key={`${exp.company}-${exp.title}`} delay={idx * 90}>
                  <article
                    data-tilt
                    style={{ "--tilt": `${tilt}deg` } as CSSProperties}
                    className="warm-card relative px-6 py-6 [transform:rotate(var(--tilt))] sm:px-7"
                  >
                    <Tape className="absolute -top-2 left-8 z-10 h-5 w-16" rotate={-6} />
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="font-display text-2xl font-semibold text-ink">
                        {exp.title}
                      </h3>
                      <StickerBadge color="sage" tilt={1.5}>
                        {exp.period}
                      </StickerBadge>
                    </div>
                    {exp.link ? (
                      <a
                        href={exp.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex font-hand text-lg text-honey transition hover:text-honey-soft"
                      >
                        {exp.company}
                      </a>
                    ) : (
                      <span className="mt-1 inline-flex font-hand text-lg text-ink-faint">
                        {exp.company}
                      </span>
                    )}
                    <p className="mt-3 leading-relaxed text-ink-muted">
                      {exp.description}
                    </p>
                    {exp.tech.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {exp.tech.map((tech) => (
                          <TechSticker key={`${exp.company}-${tech}`}>{tech}</TechSticker>
                        ))}
                      </div>
                    )}
                  </article>
                </RevealSection>
              );
            })}
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="pb-6">
          <SectionHeading
            label="say hi"
            title="Get in touch"
            description="Have a project, an opening, or just want to chat? My inbox is open."
          />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <RevealSection>
              <div className="warm-card h-full px-7 py-8">
                <h3 className="font-display text-2xl font-semibold text-ink">
                  let&apos;s make something.
                </h3>
                <p className="mt-4 leading-relaxed text-ink-muted">
                  Whether it&apos;s shipping a clear feature set or keeping a
                  product steady, I&apos;d love to help — or just say hi.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {contactLinks.map((c) => (
                    <a
                      key={c.label}
                      href={c.href}
                      target={c.external ? "_blank" : undefined}
                      rel={c.external ? "noopener noreferrer" : undefined}
                      className="flex items-center gap-3 rounded-xl border border-border bg-surface-2 px-4 py-3 text-sm text-ink-muted transition hover:border-honey/50 hover:text-honey"
                    >
                      <span className="h-2 w-2 rounded-full bg-honey" />
                      {c.label}
                    </a>
                  ))}
                </div>
              </div>
            </RevealSection>
            <RevealSection delay={150}>
              <form
                action="https://formspree.io/f/xeozjzzr"
                method="POST"
                className="warm-card px-7 py-8"
              >
                <div className="grid gap-5">
                  <label className="flex flex-col gap-2 font-hand text-lg text-ink-muted">
                    name
                    <input
                      name="name"
                      type="text"
                      required
                      className="rounded-xl border border-border bg-surface-2 px-4 py-3 font-body text-base text-ink outline-none transition focus:border-honey focus:ring-2 focus:ring-honey/30"
                    />
                  </label>
                  <label className="flex flex-col gap-2 font-hand text-lg text-ink-muted">
                    email
                    <input
                      name="email"
                      type="email"
                      required
                      className="rounded-xl border border-border bg-surface-2 px-4 py-3 font-body text-base text-ink outline-none transition focus:border-honey focus:ring-2 focus:ring-honey/30"
                    />
                  </label>
                  <label className="flex flex-col gap-2 font-hand text-lg text-ink-muted">
                    message
                    <textarea
                      name="message"
                      rows={5}
                      placeholder="tell me about the project, the role, or just say hello"
                      required
                      className="min-h-[140px] rounded-xl border border-border bg-surface-2 px-4 py-3 font-body text-base text-ink outline-none transition focus:border-honey focus:ring-2 focus:ring-honey/30"
                    />
                  </label>
                  <button type="submit" className="warm-button px-6 py-3 text-sm">
                    send it →
                  </button>
                </div>
              </form>
            </RevealSection>
          </div>
        </section>
      </main>
    </SiteShell>
  );
}
