"use client";

import { useCallback, useRef, useSyncExternalStore } from "react";
import { isSectionId } from "@/content";
import type { SectionId } from "@/content/types";

/**
 * The hash is the store. `pushState` does not fire `hashchange`, so opening a
 * modal notifies subscribers directly; the browser's own events cover
 * navigation we didn't initiate.
 */
const listeners = new Set<() => void>();

function notify() {
  for (const listener of listeners) listener();
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  window.addEventListener("hashchange", onChange);
  window.addEventListener("popstate", onChange);
  return () => {
    listeners.delete(onChange);
    window.removeEventListener("hashchange", onChange);
    window.removeEventListener("popstate", onChange);
  };
}

/**
 * Modal state, mirrored into the URL hash.
 *
 * A hash is used rather than App Router parallel routes because it costs no
 * routing config under `output: 'export'`, is readable synchronously on first
 * paint (so a deep link never flashes a closed modal), and gives back-button
 * support for free. Unknown hashes are ignored rather than treated as errors.
 */
export function useHashRoute() {
  const hash = useSyncExternalStore(
    subscribe,
    () => window.location.hash,
    () => "",
  );

  // Whether *we* pushed the current entry. If the visitor landed directly on
  // /#projects, closing must not send them off the site.
  const pushedRef = useRef(false);

  const open = useCallback((id: SectionId) => {
    window.history.pushState(null, "", `#${id}`);
    pushedRef.current = true;
    notify();
  }, []);

  const close = useCallback(() => {
    if (pushedRef.current) {
      pushedRef.current = false;
      window.history.back();
    } else {
      const { pathname, search } = window.location;
      window.history.replaceState(null, "", pathname + search);
      notify();
    }
  }, []);

  const raw = hash.replace(/^#/, "");
  const section: SectionId | null = isSectionId(raw) ? raw : null;

  return { section, open, close };
}
