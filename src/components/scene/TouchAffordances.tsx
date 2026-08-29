"use client";

import type { Hotspot } from "@/content/types";

/**
 * A small blinking marker on every interactive object, shown only on touch.
 *
 * Hover cannot communicate interactivity on a phone, so this borrows the
 * point-and-click adventure convention instead of leaving objects to be found
 * by accident.
 */
export function TouchAffordances({ hotspots }: { hotspots: Hotspot[] }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {hotspots.map((h) => (
        <span
          key={h.id}
          className="absolute animate-pulse bg-accent"
          style={{
            left: h.rect.x + h.rect.w - 4,
            top: h.rect.y + 1,
            width: 3,
            height: 3,
          }}
        />
      ))}
    </div>
  );
}
