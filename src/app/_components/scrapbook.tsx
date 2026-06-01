// src/app/_components/scrapbook.tsx
// Presentational scrapbook primitives (server-renderable, no client JS).
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { AutoplayVideo } from "./autoplay-video";

type AccentColor = "honey" | "rust" | "sage";

// --- Washi tape strip ---
export function Tape({
  className = "",
  rotate = -4,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      aria-hidden
      className={`tape block ${className}`}
      style={{ transform: `rotate(${rotate}deg)` }}
    />
  );
}

// --- Cream polaroid photo / video frame with a gentle tilt ---
export function PolaroidFrame({
  src,
  alt,
  caption,
  tilt = 0,
  media = "image",
  tape = "corners",
  priority = false,
  aspect = "4/5",
  poster,
  className = "",
}: {
  src: string;
  alt: string;
  caption?: string;
  tilt?: number;
  media?: "image" | "video";
  tape?: "top" | "corners" | "none";
  priority?: boolean;
  aspect?: string;
  poster?: string;
  className?: string;
}) {
  const clamped = Math.max(-3, Math.min(3, tilt));
  return (
    <figure
      data-tilt
      style={{ "--tilt": `${clamped}deg` } as CSSProperties}
      className={`polaroid relative [transform:rotate(var(--tilt))] transition-transform duration-300 ease-out motion-safe:hover:[transform:rotate(0deg)_translateY(-6px)] ${className}`}
    >
      {tape === "top" && (
        <Tape className="absolute -top-3 left-1/2 z-10 h-5 w-24 -translate-x-1/2" rotate={-3} />
      )}
      {tape === "corners" && (
        <>
          <Tape className="absolute -left-3 -top-2 z-10 h-4 w-14" rotate={-34} />
          <Tape className="absolute -right-3 -top-2 z-10 h-4 w-14" rotate={34} />
        </>
      )}

      <div
        className="relative w-full overflow-hidden rounded-[6px] bg-black/10"
        style={{ aspectRatio: aspect }}
      >
        {media === "video" ? (
          <AutoplayVideo
            src={src}
            poster={poster}
            ariaLabel={alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(min-width: 768px) 33vw, 90vw"
            className="object-cover"
          />
        )}
      </div>

      {caption && (
        <figcaption className="mt-2 px-1 text-center font-hand text-lg leading-none text-polaroid-ink">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// --- Hand-drawn dashed divider ---
export function DoodleDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={`text-ink-faint ${className}`}
      width="100%"
      height="12"
      viewBox="0 0 320 12"
      fill="none"
      preserveAspectRatio="none"
    >
      <path
        d="M0 7 Q 16 1, 32 7 T 64 7 T 96 7 T 128 7 T 160 7 T 192 7 T 224 7 T 256 7 T 288 7 T 320 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeDasharray="1 7"
        opacity="0.7"
      />
    </svg>
  );
}

// --- Small rounded sticker badge ---
const STICKER_COLORS: Record<AccentColor, string> = {
  honey: "border-honey/30 bg-honey/15 text-honey",
  rust: "border-rust/30 bg-rust/15 text-rust",
  sage: "border-sage/30 bg-sage/15 text-sage",
};

export function StickerBadge({
  children,
  color = "honey",
  tilt = 0,
  className = "",
}: {
  children: ReactNode;
  color?: AccentColor;
  tilt?: number;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${STICKER_COLORS[color]} ${className}`}
      style={tilt ? { transform: `rotate(${tilt}deg)` } : undefined}
    >
      {children}
    </span>
  );
}

// --- Handwritten label on a washi background ---
const WASHI_COLORS: Record<AccentColor, string> = {
  honey: "bg-honey/15 text-honey",
  rust: "bg-rust/15 text-rust",
  sage: "bg-sage/15 text-sage",
};

export function WashiTag({
  children,
  color = "honey",
  className = "",
}: {
  children: ReactNode;
  color?: AccentColor;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-0.5 font-hand text-xl leading-none ${WASHI_COLORS[color]} ${className}`}
    >
      {children}
    </span>
  );
}

// --- Tiny tech-tag sticker ---
export function TechSticker({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-border bg-surface-2 px-3 py-1 text-xs text-ink-muted">
      {children}
    </span>
  );
}
