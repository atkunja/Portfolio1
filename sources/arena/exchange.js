const clamp = (x) => Math.max(0, Math.min(1, x));
const ease = (x) => {
  const t = clamp(x);
  return t * t * (3 - 2 * t);
};
const mix = (a, b, t) => a + (b - a) * t;
const curve = (a, b, c, d, t) =>
  (1 - t) ** 3 * a +
  3 * (1 - t) ** 2 * t * b +
  3 * (1 - t) * t ** 2 * c +
  t ** 3 * d;

export const EXCHANGE_DURATION = 7.8;
export const IMPACT_TIME = 4.65;

// The same continuous choreography drives both the first entrance and practice.
// Coordinates are ground-relative; a negative pitch rolls onto the back.
export function sampleExchange(time) {
  const phase = (a, b) => ease((time - a) / (b - a));
  const shot = phase(0.8, 1.65),
    circle = phase(1.65, 2.7),
    lock = phase(2.7, 3.1);
  const lift = phase(3.1, 3.85),
    arch = phase(3.85, IMPACT_TIME);
  const rise = phase(5.1, 6.1),
    separate = phase(6.1, 7.7);
  let x = mix(-0.85, 0.05, shot),
    z = -0.4 * shot;
  if (time >= 1.65) {
    x = curve(0.05, 0.15, 1.5, 1.15, circle);
    z = curve(-0.4, -1.05, -0.85, 0, circle);
  }
  x = mix(x, 1.12, lock) + arch * 0.84;
  const floorRise = arch * 0.21 * (1 - rise);
  const player = {
    x: mix(x, 1.8, separate),
    y: 0.17 + lift * 0.12 * (1 - arch) + floorRise,
    z: mix(z - arch * 0.48, 0.3, separate),
    yaw: mix(mix(Math.PI / 2, -Math.PI / 2, circle), -Math.PI, separate),
    pitch: -arch * 1.33 * (1 - rise),
  };
  const opponent = {
    x: mix(0.75 + arch * 1.65, 4, separate),
    y: 0.17 + lift * 0.65 * (1 - arch) + floorRise,
    z: mix(arch * 0.26, -3, separate),
    yaw: mix(-Math.PI / 2, -0.4, separate),
    pitch: ((-arch * Math.PI) / 2) * (1 - rise),
  };
  return {
    player,
    opponent,
    shot,
    circle,
    lock,
    lift,
    arch,
    rise,
    separate,
    crouch:
      shot * (1 - lock) * 0.7 +
      lock * (1 - lift) * 0.3 +
      rise * (1 - rise) * 1.1,
  };
}
