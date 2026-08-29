"use client";

import { useEffect, useState, type RefObject } from "react";
import { SCENE_H, SCENE_W } from "@/content/types";

/**
 * The factor that fits the room into the viewport.
 *
 * This is a plain "contain" fit, not snapped to an integer: the artwork is a
 * high-resolution image being scaled down rather than a small one being blown
 * up, so there is no pixel grid to keep aligned, and flooring to an integer
 * would only leave thick black bars on almost every window size.
 *
 * `minScale` is a floor used on touch devices, where the room is allowed to
 * overflow and pan sideways rather than shrink until nothing can be tapped.
 */
export function useSceneScale(
  ref: RefObject<HTMLElement | null>,
  minScale = 0,
): number {
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      // Fall back to the viewport if the element hasn't been laid out yet.
      const width = rect.width || window.innerWidth;
      const height = rect.height || window.innerHeight;
      if (width === 0 || height === 0) return;

      const fit = Math.min(width / SCENE_W, height / SCENE_H);
      setScale(Math.max(minScale, fit));
    };

    measure();

    // Both, deliberately. ResizeObserver catches layout changes that don't
    // touch the window, and the window events cover the cases where it is
    // throttled or doesn't fire — including phone orientation changes, which
    // this 16:9 room is very sensitive to.
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
    };
  }, [ref, minScale]);

  return scale;
}
