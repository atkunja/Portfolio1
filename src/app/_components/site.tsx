// src/app/_components/site.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { DoodleDivider, WashiTag } from "./scrapbook";

// --- NAV LINKS (shared across pages) ---
export const NAV_LINKS = [
  { label: "Projects", href: "/projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
  { label: "Blog", href: "/blog" },
];

export const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/atkunja" },
  { label: "LinkedIn", href: "https://www.linkedin.com/in/ayushkunjadia/" },
];

// --- SCROLL REVEAL HOOK ---
export function useInView(options?: IntersectionObserverInit) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.12, ...options }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, isVisible };
}

export function RevealSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const { ref, isVisible } = useInView();
  return (
    <div
      ref={ref}
      className={`reveal-up ${isVisible ? "visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}

// --- SECTION HEADING ---
export function SectionHeading({
  label,
  title,
  description,
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-10 flex flex-col gap-3">
      <WashiTag color="honey" className="-rotate-2 self-start">
        {label}
      </WashiTag>
      <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl leading-relaxed text-ink-muted">{description}</p>
      ) : null}
      <DoodleDivider className="mt-1 max-w-sm" />
    </div>
  );
}

// --- NAV ---
function Nav({ onOpenMobile }: { onOpenMobile: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-bg-raised/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-display text-lg text-ink transition hover:text-honey"
        >
          <span className="candle-dot" />
          Ayush Kunjadia
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-ink-muted md:flex">
          {NAV_LINKS.map((item) => (
            <Link key={item.label} href={item.href} className="transition hover:text-honey">
              {item.label}
            </Link>
          ))}
          <span className="h-4 w-px bg-border" />
          {SOCIAL_LINKS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noopener"
              className="transition hover:text-honey"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <button
          className="text-2xl text-honey md:hidden"
          onClick={onOpenMobile}
          aria-label="Open navigation"
        >
          ≡
        </button>
      </div>
    </header>
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
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center gap-7 bg-bg-base/96 px-8 font-display text-2xl text-ink backdrop-blur-md transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
    >
      <button
        onClick={() => setOpen(false)}
        className="absolute right-7 top-6 text-3xl text-honey"
        aria-label="Close menu"
      >
        ×
      </button>
      {NAV_LINKS.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className="transition hover:text-honey"
          onClick={() => setOpen(false)}
        >
          {item.label}
        </Link>
      ))}
      <span className="h-px w-14 bg-border" />
      {SOCIAL_LINKS.map((item) => (
        <a
          key={item.label}
          href={item.href}
          target="_blank"
          rel="noopener"
          className="text-honey-soft transition hover:text-honey"
          onClick={() => setOpen(false)}
        >
          {item.label}
        </a>
      ))}
    </div>
  );
}

// --- SHARED FOOTER ---
export function SiteFooter() {
  return (
    <footer className="mx-auto mt-12 w-full max-w-5xl px-5 pb-12 pt-6 text-center">
      <DoodleDivider className="mx-auto mb-6 max-w-xs" />
      <div className="flex flex-wrap items-center justify-center gap-5 text-sm text-ink-muted">
        {SOCIAL_LINKS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener"
            className="transition hover:text-honey"
          >
            {item.label}
          </a>
        ))}
        <Link href="/blog" className="transition hover:text-honey">
          Blog
        </Link>
      </div>
      <p className="mt-4 font-hand text-xl text-ink-faint">
        thanks for stopping by · © {new Date().getFullYear()} Ayush
      </p>
    </footer>
  );
}

// --- SITE SHELL (warm chrome shared by every page) ---
export function SiteShell({ children }: { children: React.ReactNode }) {
  const [mobileNav, setMobileNav] = useState(false);
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-bg-base text-ink">
      <div className="warm-glow" aria-hidden />
      <div className="paper-grain" aria-hidden />
      <Nav onOpenMobile={() => setMobileNav(true)} />
      <MobileNav open={mobileNav} setOpen={setMobileNav} />
      {children}
      <SiteFooter />
    </div>
  );
}
