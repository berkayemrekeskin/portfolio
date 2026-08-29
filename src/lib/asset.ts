/**
 * Prefixes a public asset path with the deployment's base path.
 *
 * The site is served from a subpath on GitHub Pages
 * (berkayemrekeskin.github.io/portfolio), not from a domain root. Next rewrites
 * its own bundles and `next/link` hrefs for that automatically, but it does not
 * touch raw `<img src="/...">` or plain `<a href="/...">` — those would 404.
 * Anything hand-written that points at /public has to go through here.
 *
 * Empty during local dev, so `npm run dev` still serves from /.
 */
export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return path.startsWith("/") ? `${BASE_PATH}${path}` : path;
}
