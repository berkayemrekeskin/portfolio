"use client";

import { forwardRef } from "react";

/**
 * The label that names whatever is under the cursor or keyboard focus.
 *
 * Its position is written directly to `style.transform` by the scene's
 * animation frame loop — never through React state, which would re-render the
 * whole scene on every pointer move.
 */
export const CursorLabel = forwardRef<
  HTMLDivElement,
  { text: string; visible: boolean }
>(function CursorLabel({ text, visible }, ref) {
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-30 will-change-transform"
      style={{
        opacity: visible ? 1 : 0,
        // Position snaps; only the fade is animated. A lagging label feels broken.
        // Not steps(): on a transition it leaves the computed value stuck on the
        // first step. steps() is for the sprite keyframes, where the discrete
        // motion is the point.
        transition: "opacity 90ms ease-out",
      }}
    >
      <span className="pixel border-2 border-line bg-panel px-2 py-1 text-xs whitespace-nowrap text-fg">
        {text}
      </span>
    </div>
  );
});
