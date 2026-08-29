/**
 * Single source of truth for the site's data model.
 *
 * SCENE_W/SCENE_H are the coordinate space hotspots are authored in, not the
 * image's pixel size: the room artwork is 2752x1536 and is stretched to fill
 * this box, so every rect below stays valid whatever resolution the art is
 * swapped for. The box is scaled to fit the viewport at render time.
 */
export const SCENE_W = 344;
export const SCENE_H = 191;

export const ROOM_IMAGE = "/scene/room.jpg";

export type SceneRect = { x: number; y: number; w: number; h: number };

export type HotspotId =
  | "monitor"
  | "bookshelf"
  | "camera"
  | "poster"
  | "medals"
  | "cat"
  | "ball"
  | "jacket"
  | "turntable"
  | "easel"
  | "envelope"
  | "window"
  | "desk"
  | "rug";

export type SectionId =
  | "projects"
  | "photos"
  | "achievements"
  | "about"
  | "experience"
  | "art";

export type SocialPlatform =
  | "linkedin"
  | "github"
  | "youtube"
  | "instagram"
  | "spotify"
  | "letterboxd";

export type HotspotAction =
  | { type: "modal"; section: SectionId }
  /** `site` is the human name, used to say "opens Letterboxd in a new tab". */
  | { type: "external"; href: string; site: string }
  | { type: "mailto"; to: string; subject: string }
  /** Decorative layers are never focusable. A `flavor` still shows on hover. */
  | { type: "decorative"; flavor?: string };

export type IdleKind = "bob" | "flicker" | "twinkle" | "tail" | "spin";

/**
 * A clickable region of the room image.
 *
 * The room is a single painting, so a hotspot is an area over it rather than
 * its own sprite: `rect` is both the hit box and the region that lights up on
 * hover, sampled from the room image itself.
 */
export interface Hotspot {
  id: HotspotId;
  /** Unique, non-zero for anything pickable. 0 means "not pickable". */
  hitId: number;
  /** Resolves overlaps: higher wins, so the camera beats the bookshelf under it. */
  z: number;
  rect: SceneRect;
  /** Short text shown next to the cursor, e.g. "projects". */
  label?: string;
  /** Full description including the outcome, e.g. "Bookshelf. Opens personal projects." */
  ariaLabel?: string;
  action: HotspotAction;
  hover?: "glow" | "lift" | "none";
  idle?: { kind: IdleKind; periodMs: number; steps: number };
  /** Enlarged hit box for coarse pointers, to guarantee at least 44 CSS px. */
  touchTarget?: SceneRect;
  /** Keyboard order, curated by meaning rather than by position. */
  tabOrder?: number;
}

export function isInteractive(
  h: Hotspot,
): h is Hotspot & { label: string; ariaLabel: string; tabOrder: number } {
  return h.action.type !== "decorative";
}

// ---------------------------------------------------------------------------
// Section content
// ---------------------------------------------------------------------------

export interface Project {
  slug: string;
  name: string;
  blurb: string;
  tech: string[];
  repo?: string;
  demo?: string;
  year?: number;
}

export interface Role {
  company: string;
  title: string;
  start: string;
  end: string | "present";
  location?: string;
  bullets: string[];
  tech: string[];
}

export interface Achievement {
  title: string;
  issuer: string;
  date: string;
  credentialUrl?: string;
  kind: "award" | "certificate" | "competition";
}

export interface Photo {
  src: string;
  w: number;
  h: number;
  alt: string;
  caption?: string;
  takenAt?: string;
}

export interface Embed {
  provider: "youtube" | "instagram";
  /** Video id for YouTube, post shortcode for Instagram. */
  id: string;
  title: string;
  /** Local thumbnail. Third-party embeds are never loaded until clicked. */
  poster: string;
  url: string;
  /** ISO date, used only for ordering and a caption. */
  publishedAt?: string;
}

/**
 * An account shown as a card rather than as individual posts.
 *
 * Instagram is always one of these: it has no public feed to read, so linking
 * to the profile is the honest option. YouTube gets one too, as a "see all"
 * alongside the videos pulled from its RSS feed.
 */
export interface ArtProfile {
  platform: "instagram" | "youtube";
  url: string;
  handle: string;
  /** Local image. Never hotlinked. */
  poster?: string;
  blurb?: string;
}

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  handle: string;
}

export interface FileLink {
  href: string;
  label: string;
  sizeKb: number;
}

export type Section =
  | { id: "projects"; kind: "projects"; title: string; intro?: string; items: Project[] }
  | { id: "photos"; kind: "gallery"; title: string; intro?: string; items: Photo[] }
  | {
      id: "achievements";
      kind: "achievements";
      title: string;
      intro?: string;
      items: Achievement[];
    }
  | {
      id: "about";
      kind: "about";
      title: string;
      intro?: string;
      body: string[];
      socials: SocialLink[];
    }
  | {
      id: "experience";
      kind: "experience";
      title: string;
      intro?: string;
      roles: Role[];
      cv: FileLink;
      socials: SocialLink[];
    }
  | {
      id: "art";
      kind: "embeds";
      title: string;
      intro?: string;
      items: Embed[];
      profiles: ArtProfile[];
    };

export type SectionKind = Section["kind"];

/** True when a section has nothing to show yet, so the UI can say so honestly. */
export function isSectionEmpty(section: Section): boolean {
  switch (section.kind) {
    case "about":
      return section.body.length === 0;
    case "experience":
      return section.roles.length === 0;
    case "embeds":
      return section.items.length === 0 && section.profiles.length === 0;
    case "projects":
    case "gallery":
    case "achievements":
      return section.items.length === 0;
    default: {
      const _exhaustive: never = section;
      return _exhaustive;
    }
  }
}
