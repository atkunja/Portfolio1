// src/app/_components/autoplay-video.tsx
"use client";

import { useEffect, useRef } from "react";

// Mobile-reliable autoplay: browsers (esp. iOS) often ignore the `autoplay`
// attribute, but a *muted* play() call fired when the element is on-screen is
// permitted without a user gesture. We set muted imperatively (works around a
// long-standing React quirk) and (re)try play() whenever the video is visible.
export function AutoplayVideo({
  src,
  poster,
  ariaLabel,
  className = "",
}: {
  src: string;
  poster?: string;
  ariaLabel?: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    v.muted = true; // guarantee muted so autoplay is allowed
    let inView = false;

    const tryPlay = () => {
      if (!inView) return;
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          inView = e.isIntersecting;
          if (inView) tryPlay();
          else v.pause();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(v);

    // Retry once the browser has buffered enough to start.
    v.addEventListener("canplay", tryPlay);

    return () => {
      io.disconnect();
      v.removeEventListener("canplay", tryPlay);
    };
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      autoPlay
      loop
      muted
      playsInline
      disablePictureInPicture
      preload="metadata"
      aria-label={ariaLabel}
      className={className}
    />
  );
}
