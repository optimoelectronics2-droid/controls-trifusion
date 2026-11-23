import { cp, copyFile, mkdir, readdir, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const publicDir = path.join(root, "public");

// La app es un único index.html autocontenido: se copia tal cual para que el
// manifest, el service worker y las rutas relativas no sean reescritos por Vite.
await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
await copyFile(path.join(root, "index.html"), path.join(dist, "index.html"));

const entries = await readdir(publicDir, { withFileTypes: true });
await Promise.all(entries.map((entry) => cp(
  path.join(publicDir, entry.name),
  path.join(dist, entry.name),
  { recursive: true }
)));

console.log("Build listo: dist/ contiene index.html y los archivos de public/.");
