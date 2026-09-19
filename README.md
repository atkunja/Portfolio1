# Ayush Kunjadia — Interactive Portfolio

Ayush's portfolio has two entrances:

- **The lame side** preserves the original, conventional portfolio at `/classic/`.
- **The cool side** is a fully playable 3D portfolio built on Bruno Simon's open-source 2025 portfolio engine.

## Run locally

```bash
npm install --force
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Production build

```bash
npm run build
npm run preview
```

The generated site is written to `dist/`.

## Credits and license

The 3D engine, world, models, audio, and much of the interface originate from [Bruno Simon's folio-2025](https://github.com/brunosimon/folio-2025), used and adapted under the MIT License. Bruno's original copyright and license are preserved in [license.md](./license.md).

Portfolio content and the classic/game entry experience are customized for Ayush Kunjadia.
