# Bruno Simon Folio 2025 reference audit

The complete client source for `bruno-simon.com` is published at `github.com/brunosimon/folio-2025` under the MIT license. The deployed website does not need to be reverse-engineered: its Vite source, static assets, Blender source files, compression scripts, and game-loop documentation are available in that repository. The private server implementation is intentionally excluded by its author.

## Reference architecture

The upstream application uses Three.js with a staged game loop. Its source is split into roughly these systems:

- Core lifecycle: `Game`, `Ticker`, `Time`, `Viewport`, `ResourcesLoader`, `Rendering`, and monitoring.
- Input: keyboard, pointer, touch joystick, mouse wheel, gamepad, and interactive screen buttons.
- Vehicle: `Player`, a Rapier-backed `PhysicsVehicle`, and a separate rendered `VisualVehicle`.
- Camera and navigation: `View`, map, ray cursor, respawns, zones, and interactive points.
- World: terrain, floor, foliage, grass, trees, benches, bricks, fences, lanterns, crates, tracks, trails, and water.
- Atmosphere: daily and yearly cycles, weather, fog, wind, rain, snow, lightning, leaves, tornadoes, and reveal effects.
- Portfolio UI: menu, tabs, modals, options, achievements, notifications, circuit timing, social data, and project data.
- Content pipeline: Blender `.blend` sources, GLB assets, KTX textures, palette textures, and compression tooling.

## This portfolio's mapping

This repository deliberately recreates the interaction pattern without importing Bruno's personal models, project media, UI copy, server calls, or 196 MB static asset tree.

| Reference concern | Local implementation |
| --- | --- |
| Game loop and renderer | `src/main.js` |
| Vehicle physics and visuals | `src/Vehicle.js` |
| Keyboard, touch, gamepad | `src/Input.js` |
| Camera orbit and zoom | `src/ViewControls.js` |
| Terrain, roads, scenery, project stops | `src/World.js` |
| Day cycle, stars, clouds | `src/Environment.js` |
| Engine, honk, feedback sounds | `src/Audio.js` |
| Saved discoveries and collectibles | `src/GameState.js` |
| HUD, map, panels, progress | `src/UI.js` |
| Portfolio projects and profile | `src/content.js` |

## Intentional differences

- Arcade motion is used instead of Rapier vehicle simulation to keep the portfolio small and quick to load.
- Geometry is created from Three.js primitives instead of copied Blender models.
- Audio is synthesized in-browser instead of shipping music or sound files.
- Project data is local and static; no unavailable upstream server features are reproduced.
- The visual identity, copy, destinations, and generated placeholder art are original to this repository.

These differences keep the implementation maintainable while preserving the important idea: visitors learn about the developer by driving through an interactive world.
