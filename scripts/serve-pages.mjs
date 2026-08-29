#!/usr/bin/env node
/**
 * Serves `out/` under /portfolio, the way GitHub Pages serves this repo.
 *
 * Building for a subpath is easy to get subtly wrong — a single un-prefixed
 * asset 404s only once deployed. This reproduces the subpath locally so that
 * can be caught before pushing.
 */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(import.meta.dirname, "..", "out");
const BASE = "/portfolio";
const PORT = Number(process.env.PORT || 4321);

const TYPES = {
  ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml",
  ".ico": "image/x-icon", ".woff2": "font/woff2", ".xml": "application/xml",
  ".txt": "text/plain", ".pdf": "application/pdf",
};

http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  if (!url.startsWith(BASE)) {
    res.writeHead(404, { "content-type": "text/plain" });
    return res.end(`Not found. This server only serves ${BASE}/`);
  }
  let rel = url.slice(BASE.length) || "/";
  let file = path.join(ROOT, rel);
  if (rel.endsWith("/")) file = path.join(file, "index.html");
  if (!fs.existsSync(file) && fs.existsSync(file + ".html")) file += ".html";
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { "content-type": "text/plain" });
    return res.end("404 " + rel);
  }
  res.writeHead(200, { "content-type": TYPES[path.extname(file)] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
}).listen(PORT, () => console.log(`Serving out/ at http://localhost:${PORT}${BASE}/`));
