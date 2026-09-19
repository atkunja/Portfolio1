# Kunja Drive Portfolio

An interactive portfolio with two entrances: the preserved warm scrapbook site for traditional browsing and a Three.js world where visitors drive a tiny car through projects, skills, and contact points.

The opening split labels the original site as “the lame side” and the playable world as “the cool side.” Both experiences include a visible switch back to the other. Game features include arcade driving, jumping and boost, collisions, eight collectible sparks, persistent discovery progress, a live map, synthesized vehicle audio, a draggable chase camera, project interactions, and a dynamic day/night sky.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`. Use WASD or arrow keys to drive, Shift to boost, Space to jump, `E`/Enter to interact, `M` for the map, and `R` to respawn.

Run the verification suite with:

```bash
npm test
npm run build
```

## Customize

Portfolio copy, project links, and image paths live in `src/content.js`. The three current destinations use the project artwork recovered from the earlier `Portfolio1` repository. Add or replace files in `public/images/`, then update their paths in the content file.

Each project has a world position and accent color, so adding or moving destinations does not require editing the 3D engine. The main pieces are:

- `src/World.js` — roads, project stops, scenery, and interaction zones
- `src/Vehicle.js` — arcade driving, jumping, and the low-poly car
- `src/Input.js` — keyboard, touch, and gamepad input
- `src/UI.js` — intro, HUD, map, controls, and project modals
- `src/ClassicSite.js` — preserved scrapbook portfolio and the switch back to the game
- `src/content.js` — personal copy, projects, links, and image paths

The current content features Duet, CudaForge, and Clinic Finder. Review their copy and destination links in `src/content.js` before publishing.

## Inspiration and attribution

The driveable-portfolio interaction is inspired by [Bruno Simon's portfolio](https://bruno-simon.com/) and its [MIT-licensed source](https://github.com/brunosimon/folio-2025). This project is an original, smaller implementation built for this portfolio rather than a redistribution of Bruno's personal world and assets.

See `docs/REFERENCE_AUDIT.md` for a breakdown of the reference architecture and how this implementation maps to it.
