"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ModalRouter } from "@/components/modal/ModalRouter";
import { hotspotByHitId, HOTSPOTS, HOTSPOTS_BY_Z_DESC } from "@/content/hotspots";
import { MIN_SCALE } from "@/content/scene-config";
import { SCENE_H, SCENE_W, type Hotspot } from "@/content/types";
import { pick } from "@/lib/pick";
import { useHashRoute } from "@/lib/useHashRoute";
import { useCoarsePointer } from "@/lib/useMediaQuery";
import { useSceneScale } from "@/lib/useSceneScale";
import { CursorLabel } from "./CursorLabel";
import { HotspotButtons } from "./HotspotButtons";
import { RoomImage } from "./RoomImage";
import { TouchAffordances } from "./TouchAffordances";

/** An external link with no URL yet is not something to offer the visitor. */
function isActionable(h: Hotspot): boolean {
  switch (h.action.type) {
    case "modal":
    case "mailto":
      return true;
    case "external":
      return h.action.href !== "";
    case "decorative":
      return false;
  }
}

function labelFor(h: Hotspot | undefined): string {
  if (!h) return "";
  if (h.action.type === "decorative") return h.action.flavor ?? "";
  return h.label ?? "";
}

export function Scene() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const panRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);

  const coarse = useCoarsePointer();
  // Touch gets a floor so targets stay tappable, and pans instead of shrinking.
  const scale = useSceneScale(viewportRef, coarse ? MIN_SCALE : 0);
  const { section, open, close } = useHashRoute();

  const [hoveredId, setHoveredId] = useState(0);
  const [focusedId, setFocusedId] = useState(0);
  /** Touch only: the object named by the first tap, awaiting a second. */
  const [armedId, setArmedId] = useState(0);

  // Pointer position and the pending hit live in refs so moving the mouse
  // costs zero React renders. The frame loop promotes a *change* to state.
  const pointerRef = useRef({ x: 0, y: 0, inside: false });
  const hoveredRef = useRef(0);
  const anchoredRef = useRef(false);

  const focusable = useMemo(
    () =>
      HOTSPOTS.filter(isActionable).sort(
        (a, b) => (a.tabOrder ?? 99) - (b.tabOrder ?? 99),
      ),
    [],
  );

  const pickAt = useCallback(
    (clientX: number, clientY: number): number => {
      const stage = stageRef.current;
      if (!stage) return 0;
      const r = stage.getBoundingClientRect();
      const x = Math.floor((clientX - r.left) / scale);
      const y = Math.floor((clientY - r.top) / scale);
      if (x < 0 || y < 0 || x >= SCENE_W || y >= SCENE_H) return 0;
      return pick(HOTSPOTS_BY_Z_DESC, x, y, coarse);
    },
    [scale, coarse],
  );

  // Open on the desk rather than the left wall when the room overflows.
  useEffect(() => {
    const pan = panRef.current;
    if (!pan) return;
    const overflow = pan.scrollWidth - pan.clientWidth;
    if (overflow > 0) pan.scrollLeft = overflow / 2;
  }, [scale]);

  // The frame loop only moves the label. Which object is hovered is set
  // directly from the pointer handler instead: it changes a dozen times in a
  // session rather than every frame, and routing it through rAF meant the
  // label froze whenever the browser throttled frames (background tab, low
  // power) while the pointer kept moving.
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const label = labelRef.current;
      const p = pointerRef.current;
      if (label && !anchoredRef.current && p.inside) {
        label.style.transform = `translate3d(${p.x + 16}px, ${p.y + 18}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /** Only re-renders when the hit actually changes, not on every move. */
  const setHovered = useCallback((id: number) => {
    if (id === hoveredRef.current) return;
    hoveredRef.current = id;
    setHoveredId(id);
  }, []);

  const clearHover = useCallback(() => {
    pointerRef.current.inside = false;
    setHovered(0);
  }, [setHovered]);

  useEffect(() => {
    const onHidden = () => document.hidden && clearHover();
    document.addEventListener("visibilitychange", onHidden);
    window.addEventListener("blur", clearHover);
    return () => {
      document.removeEventListener("visibilitychange", onHidden);
      window.removeEventListener("blur", clearHover);
    };
  }, [clearHover]);

  // --- what the label says, and where it sits ------------------------------
  const anchoredId = focusedId || (coarse ? armedId : 0);
  const activeId = anchoredId || hoveredId;
  const activeHotspot = hotspotByHitId(activeId);
  const labelText = labelFor(activeHotspot);

  useEffect(() => {
    anchoredRef.current = anchoredId !== 0;
  }, [anchoredId]);

  useEffect(() => {
    if (anchoredId === 0) return;
    const h = hotspotByHitId(anchoredId);
    const stage = stageRef.current;
    const label = labelRef.current;
    if (!h || !stage || !label) return;
    const r = stage.getBoundingClientRect();
    const x = r.left + h.rect.x * scale;
    const y = r.top + h.rect.y * scale - 34;
    label.style.transform = `translate3d(${Math.max(4, x)}px, ${Math.max(4, y)}px, 0)`;
  }, [anchoredId, scale]);

  // --- activation ----------------------------------------------------------
  const activate = useCallback(
    (hitId: number) => {
      const h = hotspotByHitId(hitId);
      if (!h || !isActionable(h)) return;
      switch (h.action.type) {
        case "modal":
          open(h.action.section);
          break;
        case "external":
          window.open(h.action.href, "_blank", "noopener,noreferrer");
          break;
        case "mailto":
          window.location.href = `mailto:${h.action.to}?subject=${encodeURIComponent(
            h.action.subject,
          )}`;
          break;
        case "decorative":
          break;
      }
    },
    [open],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (e.pointerType === "touch") return;
      pointerRef.current = { x: e.clientX, y: e.clientY, inside: true };
      setHovered(pickAt(e.clientX, e.clientY));
    },
    [pickAt, setHovered],
  );

  const onClick = useCallback(
    (e: React.MouseEvent) => {
      const id = pickAt(e.clientX, e.clientY);
      if (!coarse) {
        activate(id);
        return;
      }
      // Touch: name it on the first tap, open it on the second. The small
      // objects are far too easy to hit by accident otherwise.
      const target = hotspotByHitId(id);
      if (!target || !isActionable(target)) {
        setArmedId(0);
        return;
      }
      if (armedId === id) {
        activate(id);
        setArmedId(0);
      } else {
        setArmedId(id);
      }
    },
    [pickAt, coarse, activate, armedId],
  );

  const cursor =
    activeHotspot && isActionable(activeHotspot) ? "pointer" : "default";

  return (
    <div ref={viewportRef} className="relative h-dvh w-full overflow-hidden bg-bg">
      <div
        ref={panRef}
        className="flex h-full w-full items-center justify-center overflow-x-auto overflow-y-hidden"
      >
        <div
          className="relative shrink-0"
          style={
            {
              width: SCENE_W * scale,
              height: SCENE_H * scale,
              "--scene-scale": String(scale),
            } as React.CSSProperties
          }
        >
          <div
            ref={stageRef}
            className="scene-stage absolute top-0 left-0"
            style={{
              width: SCENE_W,
              height: SCENE_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          >
            <RoomImage />

            {coarse ? <TouchAffordances hotspots={focusable} /> : null}

            {/* The one and only pointer target. */}
            <div
              className="absolute inset-0"
              style={{ cursor }}
              onPointerMove={onPointerMove}
              onPointerLeave={clearHover}
              onClick={onClick}
            />

            <HotspotButtons
              hotspots={focusable}
              onActivate={activate}
              onFocusChange={setFocusedId}
            />
          </div>
        </div>
      </div>

      <CursorLabel ref={labelRef} text={labelText} visible={labelText !== ""} />

      <Announcer text={activeHotspot?.ariaLabel ?? ""} />

      <ModalRouter section={section} onClose={close} />
    </div>
  );
}

/** Debounced so sweeping the mouse across the room doesn't flood a screen reader. */
function Announcer({ text }: { text: string }) {
  const [announced, setAnnounced] = useState("");
  useEffect(() => {
    const t = setTimeout(() => setAnnounced(text), 150);
    return () => clearTimeout(t);
  }, [text]);
  return (
    <div aria-live="polite" className="sr-only">
      {announced}
    </div>
  );
}
