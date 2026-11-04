// Only play visible videos, saving battery and respecting motion preferences.
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const videos = [...document.querySelectorAll('video')];
const visibleVideos = new Set();
function updatePlayback() {
  for (const video of videos) {
    video.muted = true;
    if (visibleVideos.has(video) && !document.hidden && !reducedMotion.matches) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  }
}
const videoObserver = new IntersectionObserver(entries => {
  for (const entry of entries) {
    if (entry.isIntersecting) visibleVideos.add(entry.target);
    else visibleVideos.delete(entry.target);
  }
  updatePlayback();
}, { threshold:0.1 });
videos.forEach(video => videoObserver.observe(video));
document.addEventListener('visibilitychange', updatePlayback);
reducedMotion.addEventListener('change', updatePlayback);
