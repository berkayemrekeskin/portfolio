"use client";

import { ROOM_IMAGE } from "@/content/types";
import { asset } from "@/lib/asset";

/**
 * The room itself, stretched to fill the scene's coordinate box.
 *
 * The artwork is much higher resolution than the box, so the browser is always
 * scaling it *down* — which is why smoothing is left on (see globals.css).
 * Nearest-neighbour only helps when blowing a small image up; on a downscale it
 * drops pixels unevenly and makes the image shimmer as the window resizes.
 */
export function RoomImage() {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(ROOM_IMAGE)}
      alt=""
      aria-hidden="true"
      draggable={false}
      fetchPriority="high"
      className="absolute inset-0 h-full w-full select-none"
    />
  );
}
