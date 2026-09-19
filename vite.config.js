import { cp, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));
// Dev can read the retained reference assets, but the published site contains
// only the classic portfolio and files used by the new fieldhouse.
const publicAssets = [
  "classic",
  "arena",
  "logo.png",
  "MEandMom.jpg",
  "315bench-poster.jpg",
  "315bench.mp4",
  "projects",
  "sounds/musics/Sudo.mp3",
  "sounds/mecanism/click.mp3",
  "sounds/hits/defaults/Impact Soft 04.mp3",
];

const fieldhouseAssets = () => ({
  name: "fieldhouse-assets",
  apply: "build",
  async closeBundle() {
    for (const asset of publicAssets) {
      const destination = resolve(projectRoot, "dist", asset);
      await mkdir(dirname(destination), { recursive: true });
      await cp(resolve(projectRoot, "static", asset), destination, {
        recursive: true,
      });
    }
    await cp(
      resolve(projectRoot, "license.md"),
      resolve(projectRoot, "dist", "engine-license.txt"),
    );
  },
});

const classicSiteRoutes = () => ({
  name: "classic-site-routes",
  configureServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.url === "/classic/" || request.url === "/classic")
        request.url = "/classic/index.html";
      else if (
        request.url === "/classic/projects/" ||
        request.url === "/classic/projects"
      )
        request.url = "/classic/projects/index.html";

      next();
    });
  },
  configurePreviewServer(server) {
    server.middlewares.use((request, response, next) => {
      if (request.url === "/classic/" || request.url === "/classic")
        request.url = "/classic/index.html";
      else if (
        request.url === "/classic/projects/" ||
        request.url === "/classic/projects"
      )
        request.url = "/classic/projects/index.html";

      next();
    });
  },
});

export default {
  root: "sources/", // Sources files (typically where index.html is)
  envDir: "../", // Directory where the env file is located
  publicDir: "../static/", // Path from "root" to static assets (files that are served as they are)
  base: "./", // Public path (what's after the domain)
  server: {
    // https: true,
    host: true, // Open to local network and display URL
    open: true, // Open in browser
  },
  build: {
    outDir: "../dist", // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: false,
    copyPublicDir: false,
  },
  plugins: [classicSiteRoutes(), fieldhouseAssets()],
};
