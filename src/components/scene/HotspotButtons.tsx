"use client";

import type { Hotspot } from "@/content/types";

/**
 * The keyboard and screen-reader surface.
 *
 * Pointer input never reaches these — it goes through the pointer surface and
 * the picking buffer instead. Decoupling the two is what lets the pointer be
 * pixel-accurate over overlapping objects while assistive tech still gets a
 * short, well-ordered list of plain buttons.
 *
 * They are transparent rather than `opacity: 0` so the focus ring stays
 * visible, and `pointer-events: none` so they never intercept a click.
 */
export function HotspotButtons({
  hotspots,
  onActivate,
  onFocusChange,
}: {
  hotspots: Hotspot[];
  onActivate: (hitId: number) => void;
  onFocusChange: (hitId: number) => void;
}) {
  return (
    <div
      role="group"
      aria-label={`Interactive room. ${hotspots.length} objects to explore.`}
      className="pointer-events-none absolute inset-0"
    >
      {hotspots.map((h) => (
        <button
          key={h.id}
          type="button"
          aria-label={h.ariaLabel}
          className="pointer-events-none absolute cursor-pointer border-0 bg-transparent p-0"
          style={{
            left: h.rect.x,
            top: h.rect.y,
            width: h.rect.w,
            height: h.rect.h,
          }}
          onFocus={() => onFocusChange(h.hitId)}
          onBlur={() => onFocusChange(0)}
          onClick={() => onActivate(h.hitId)}
        />
      ))}
    </div>
  );
}
