# Ayush Kunjadia — The Fieldhouse

Ayush's portfolio has two entrances:

- **The lame side** preserves the original, conventional portfolio at `/classic/`.
- **The cool side** is a custom wrestling arena. The athlete in the opening exchange remains the player throughout the experience. There is no vehicle or driving-world handoff.

The scene, articulated characters, choreography, navigation, exhibits, and interface live in `sources/arena/`. The previous driving implementation is recoverable in Git history; it is no longer part of the active source tree or application bundle.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

The generated site is written to `dist/`.

## Play

- Click **Enter the fieldhouse** for the opening shot, go-behind, and suplex.
- Move with **WASD** or **arrow keys**, or click/tap the mat to walk there.
- Choose a numbered exhibit or the navigation bar to walk to work, experience, personal photos, or contact links.
- Press **E** near an exhibit to open it. **Escape** closes the panel.
- Press **Space** or **Hit the mat** to return to the center and practice the exchange again.
- Use **Closer look**, **C**, or the mouse wheel to change the camera distance.
- Sound can be toggled in the header. Reduced-motion preferences skip the entrance.

## Verify

```bash
npm test
npm run build
```

The motion checks verify continuity across each animation phase, a chest-up landing, matching poses at the gameplay handoff, reachable exhibits, and project assets. Browser QA covers desktop and phone layouts, the entrance, walking, exhibit navigation, project links, audio controls, and the preserved classic site.

## Credits and license

The current fieldhouse and interface are a fresh implementation using Three.js. The retained soundtrack and sound effects, along with archived reference code and assets, originate from [Bruno Simon's folio-2025](https://github.com/brunosimon/folio-2025). The original MIT notice is preserved in [license.md](./license.md).

Barlow Condensed and DM Sans are self-hosted under their SIL Open Font Licenses in `static/arena/fonts/`. Personal photography and project imagery are Ayush's existing portfolio assets.

Portfolio content and the classic/game entry experience are customized for Ayush Kunjadia.
