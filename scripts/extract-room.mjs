#!/usr/bin/env node
/**
 * Recovers the clean, native-resolution room from the delivered artwork.
 *
 * The source is a 2752x1536 JPEG whose real pixel grid is 8x8 blocks — so the
 * true art is 344x192, and everything above that is upscaling plus JPEG noise.
 * Keeping the JPEG would mean shipping 2MB of blur that can never scale
 * crisply; recovering the native grid gives a small image that upscales
 * perfectly at any integer factor.
 *
 * For each block it takes the per-channel median (robust against the ringing
 * JPEG leaves around hard edges), then quantizes the result to a limited
 * palette so the output is genuine flat-colour pixel art.
 *
 * Run: npm run extract:room
 */
import path from "node:path";
import sharp from "sharp";

const SRC =
  process.argv[2] ??
  path.resolve(import.meta.dirname, "..", "public", "scene", "room.jpg");
const OUT =
  process.argv[3] ?? path.resolve(import.meta.dirname, "..", "public", "scene", "room.png");

const BLOCK = 8;
const PALETTE_DEPTH = 7; // 2^7 = 128 colours

const { data, info } = await sharp(SRC).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const { width: W, height: H, channels: C } = info;
const at = (x, y, c) => data[(y * W + x) * C + c];

/** How uniform aligned blocks are at a given grid offset. */
function uniformity(ox, oy) {
  let score = 0, n = 0;
  for (let by = oy; by + BLOCK <= H; by += BLOCK * 4) {
    for (let bx = ox; bx + BLOCK <= W; bx += BLOCK * 4) {
      let lo = 255, hi = 0;
      for (let y = 0; y < BLOCK; y++) {
        for (let x = 0; x < BLOCK; x++) {
          const v = at(bx + x, by + y, 1);
          if (v < lo) lo = v;
          if (v > hi) hi = v;
        }
      }
      score += hi - lo;
      n++;
    }
  }
  return score / n;
}

// The grid may not start at (0,0); pick the offset with the flattest blocks.
let best = { ox: 0, oy: 0, v: Infinity };
for (let oy = 0; oy < BLOCK; oy++) {
  for (let ox = 0; ox < BLOCK; ox++) {
    const v = uniformity(ox, oy);
    if (v < best.v) best = { ox, oy, v };
  }
}
console.log(`Grid offset (${best.ox}, ${best.oy}), mean block spread ${best.v.toFixed(1)}`);

const NW = Math.floor((W - best.ox) / BLOCK);
const NH = Math.floor((H - best.oy) / BLOCK);

// Per-block median for each channel.
const px = [];
const buf = new Uint8Array(BLOCK * BLOCK);
for (let by = 0; by < NH; by++) {
  for (let bx = 0; bx < NW; bx++) {
    const rgb = [0, 0, 0];
    for (let c = 0; c < 3; c++) {
      let n = 0;
      for (let y = 0; y < BLOCK; y++) {
        for (let x = 0; x < BLOCK; x++) {
          buf[n++] = at(best.ox + bx * BLOCK + x, best.oy + by * BLOCK + y, c);
        }
      }
      const sorted = Array.from(buf.subarray(0, n)).sort((a, b) => a - b);
      rgb[c] = sorted[n >> 1];
    }
    px.push(rgb);
  }
}

/** Median cut, so the palette follows the art's actual colour distribution. */
function medianCut(pixels, depth) {
  if (pixels.length === 0) return [];
  if (depth === 0) {
    const avg = [0, 0, 0];
    for (const p of pixels) {
      avg[0] += p[0];
      avg[1] += p[1];
      avg[2] += p[2];
    }
    return [avg.map((v) => Math.round(v / pixels.length))];
  }
  let ch = 0, widest = -1;
  for (let c = 0; c < 3; c++) {
    let lo = 255, hi = 0;
    for (const p of pixels) {
      if (p[c] < lo) lo = p[c];
      if (p[c] > hi) hi = p[c];
    }
    if (hi - lo > widest) {
      widest = hi - lo;
      ch = c;
    }
  }
  pixels.sort((a, b) => a[ch] - b[ch]);
  const mid = pixels.length >> 1;
  return [...medianCut(pixels.slice(0, mid), depth - 1), ...medianCut(pixels.slice(mid), depth - 1)];
}

const palette = medianCut(px.map((p) => [...p]), PALETTE_DEPTH);

function snap(r, g, b) {
  let best = palette[0], bd = Infinity;
  for (const p of palette) {
    const dr = r - p[0], dg = g - p[1], db = b - p[2];
    const d = 2 * dr * dr + 4 * dg * dg + 3 * db * db;
    if (d < bd) {
      bd = d;
      best = p;
    }
  }
  return best;
}

const out = Buffer.alloc(NW * NH * 4);
const used = new Set();
for (let i = 0; i < px.length; i++) {
  const [r, g, b] = snap(px[i][0], px[i][1], px[i][2]);
  out[i * 4] = r;
  out[i * 4 + 1] = g;
  out[i * 4 + 2] = b;
  out[i * 4 + 3] = 255;
  used.add((r << 16) | (g << 8) | b);
}

await sharp(out, { raw: { width: NW, height: NH, channels: 4 } })
  .png({ palette: true })
  .toFile(OUT);

console.log(`Wrote ${OUT}`);
console.log(`  ${NW}x${NH}, ${used.size} colours, from ${W}x${H}`);
