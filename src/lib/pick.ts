import type { Hotspot } from "@/content/types";

/**
 * Picks the hotspot under a point, front to back.
 *
 * The room is a single painting rather than a stack of transparent sprites, so
 * there are no per-object silhouettes to test against — regions are rectangles
 * and `z` decides overlaps. That's why the camera (z 20) sits above the
 * bookshelf (z 10) and the monitor above the window.
 *
 * `coarse` swaps in the enlarged `touchTarget` where one is defined, so small
 * objects stay reachable with a fingertip.
 */
export function pick(
  hotspotsFrontToBack: Hotspot[],
  x: number,
  y: number,
  coarse: boolean,
): number {
  for (const h of hotspotsFrontToBack) {
    if (h.hitId === 0) continue;
    const r = (coarse && h.touchTarget) || h.rect;
    if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) return h.hitId;
  }
  return 0;
}
