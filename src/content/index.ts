import { about } from "./about";
import { achievements } from "./achievements";
import { art } from "./art";
import { experience } from "./experience";
import { photos } from "./photos";
import { projects } from "./projects";
import { HOTSPOTS } from "./hotspots";
import type { Section, SectionId } from "./types";

/**
 * The section registry. `satisfies` means a missing or mistyped section is a
 * compile error rather than a blank modal at runtime.
 */
export const SECTIONS = {
  projects,
  photos,
  achievements,
  about,
  experience,
  art,
} satisfies Record<SectionId, Section>;

export const SECTION_IDS = Object.keys(SECTIONS) as SectionId[];

export function getSection(id: SectionId): Section {
  return SECTIONS[id];
}

export function isSectionId(value: string): value is SectionId {
  return Object.prototype.hasOwnProperty.call(SECTIONS, value);
}

/**
 * Every `modal` hotspot must point at a section that exists. This is a type
 * error if the union ever drifts, and the runtime check below catches a bad
 * cast in development.
 */
if (process.env.NODE_ENV !== "production") {
  for (const h of HOTSPOTS) {
    if (h.action.type === "modal" && !isSectionId(h.action.section)) {
      throw new Error(
        `Hotspot "${h.id}" points at unknown section "${h.action.section}".`,
      );
    }
  }
  const ids = HOTSPOTS.filter((h) => h.hitId !== 0).map((h) => h.hitId);
  if (new Set(ids).size !== ids.length) {
    throw new Error("Duplicate hitId in HOTSPOTS — picking would be ambiguous.");
  }
}

export * from "./types";
export { SITE, SOCIALS, LIVE_SOCIALS, CV, socialUrl } from "./site";
export { HOTSPOTS, HOTSPOTS_BY_Z_DESC, hotspotByHitId } from "./hotspots";
