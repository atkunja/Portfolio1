// The original soundtrack and quiet tactile effects remain, without loading
// vehicle, weather, or unrelated world audio.
export class Sound {
  constructor() {
    this.enabled = true;
    try { this.enabled = localStorage.getItem("fieldhouse-sound") !== "off"; } catch { /* Storage is optional. */ }
    this.started = false;
    this.music = new Audio("/sounds/musics/Sudo.mp3");
    this.music.loop = true;
    this.music.volume = 0.16;
    this.music.preload = "none";
    this.click = new Audio("/sounds/mecanism/click.mp3");
    this.click.volume = 0.18;
    this.impact = new Audio("/sounds/hits/defaults/Impact Soft 04.mp3");
    this.impact.volume = 0.5;
  }
  start() {
    this.started = true;
    if (this.enabled) this.music.play().catch(() => {});
  }
  toggle() {
    this.enabled = !this.enabled;
    try { localStorage.setItem("fieldhouse-sound", this.enabled ? "on" : "off"); } catch { /* Keep the session preference. */ }
    if (this.enabled && this.started) this.music.play().catch(() => {});
    else this.music.pause();
    return this.enabled;
  }
  play(name = "click") {
    if (!this.enabled) return;
    const audio = this[name];
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
  suspend() {
    this.music.pause();
  }
  resume() {
    if (this.started && this.enabled) this.music.play().catch(() => {});
  }
}
