import { MAIL_SUBJECT, SITE, socialUrl } from "./site";
import type { Hotspot } from "./types";

/**
 * The clickable regions of the room, measured off the 344x191 artwork.
 *
 * The room is one painting rather than a stack of sprites, so these are areas
 * over the image, not placements of separate files. `z` resolves overlaps —
 * the camera sits on the bookshelf and the monitor inside the window, so both
 * need to win against the larger thing behind them.
 *
 * `touchTarget` is only needed where a region is under 22px in some dimension,
 * which is 44 CSS px at the minimum 2x scale.
 */
export const HOTSPOTS: Hotspot[] = [
  {
    id: "window",
    hitId: 0,
    z: 5,
    rect: { x: 119, y: 13, w: 138, h: 86 },
    action: { type: "decorative" },
  },
  {
    id: "desk",
    hitId: 0,
    z: 6,
    rect: { x: 114, y: 102, w: 128, h: 63 },
    action: { type: "decorative" },
  },
  {
    id: "rug",
    hitId: 0,
    z: 7,
    rect: { x: 94, y: 163, w: 166, h: 26 },
    action: { type: "decorative" },
  },
  {
    id: "bookshelf",
    hitId: 1,
    z: 10,
    rect: { x: 8, y: 27, w: 70, h: 133 },
    label: "projects",
    ariaLabel: "Bookshelf. Opens personal projects.",
    action: { type: "modal", section: "projects" },
    tabOrder: 3,
  },
  {
    id: "camera",
    hitId: 2,
    z: 20,
    rect: { x: 41, y: 16, w: 21, h: 11 },
    label: "photo album",
    ariaLabel: "Camera. Opens my photo album.",
    action: { type: "modal", section: "photos" },
    touchTarget: { x: 40, y: 11, w: 24, h: 22 },
    tabOrder: 6,
  },
  {
    id: "poster",
    hitId: 3,
    z: 10,
    rect: { x: 80, y: 27, w: 32, h: 42 },
    label: "letterboxd",
    ariaLabel: "Movie poster. Opens my Letterboxd profile in a new tab.",
    action: { type: "external", href: socialUrl("letterboxd"), site: "Letterboxd" },
    tabOrder: 8,
  },
  {
    id: "medals",
    hitId: 4,
    z: 10,
    rect: { x: 82, y: 77, w: 28, h: 37 },
    label: "achievements",
    ariaLabel: "Hanging medals. Opens achievements and certificates.",
    action: { type: "modal", section: "achievements" },
    tabOrder: 4,
  },
  {
    id: "jacket",
    hitId: 5,
    // Above the easel: their boxes overlap at the jacket's lower right, and
    // there it is the jacket that is on screen, not the easel's leg.
    z: 18,
    rect: { x: 260, y: 29, w: 36, h: 59 },
    label: "experience",
    ariaLabel: "Suit jacket. Opens work experience and CV download.",
    action: { type: "modal", section: "experience" },
    tabOrder: 2,
  },
  {
    id: "monitor",
    hitId: 6,
    z: 20,
    rect: { x: 161, y: 70, w: 37, h: 30 },
    label: "about me",
    ariaLabel: "Computer. Opens about me and my profiles.",
    action: { type: "modal", section: "about" },
    tabOrder: 1,
  },
  {
    id: "envelope",
    hitId: 7,
    z: 20,
    // The sealed letter on the left of the desktop, beside the keyboard.
    rect: { x: 124, y: 102, w: 29, h: 8 },
    label: "mail",
    ariaLabel: `Letter on the desk. Opens an email to ${SITE.email}.`,
    action: { type: "mailto", to: SITE.email, subject: MAIL_SUBJECT },
    touchTarget: { x: 124, y: 95, w: 29, h: 22 },
    tabOrder: 10,
  },
  {
    id: "turntable",
    hitId: 8,
    z: 15,
    rect: { x: 242, y: 125, w: 43, h: 40 },
    label: "playlist",
    ariaLabel: "Turntable. Opens my Spotify playlist in a new tab.",
    action: { type: "external", href: socialUrl("spotify"), site: "Spotify" },
    tabOrder: 9,
  },
  {
    id: "easel",
    hitId: 9,
    z: 15,
    rect: { x: 287, y: 57, w: 49, h: 105 },
    label: "art",
    ariaLabel: "Easel. Opens my art, videos and posts.",
    action: { type: "modal", section: "art" },
    tabOrder: 5,
  },
  {
    id: "cat",
    hitId: 10,
    z: 25,
    rect: { x: 86, y: 135, w: 27, h: 30 },
    label: "nazli (github)",
    ariaLabel: "Cat. Opens my GitHub profile in a new tab.",
    action: { type: "external", href: socialUrl("github"), site: "GitHub" },
    tabOrder: 7,
  },
  {
    id: "ball",
    hitId: 11,
    z: 25,
    rect: { x: 4, y: 148, w: 20, h: 22 },
    // Deliberately has no function. It still names itself on hover so the room
    // feels alive rather than broken.
    action: { type: "decorative", flavor: "i love football" },
    touchTarget: { x: 3, y: 148, w: 22, h: 22 },
  },
];

/** Front to back — the order overlaps are resolved in. */
export const HOTSPOTS_BY_Z_DESC = [...HOTSPOTS].sort((a, b) => b.z - a.z);

export function hotspotByHitId(hitId: number): Hotspot | undefined {
  if (hitId === 0) return undefined;
  return HOTSPOTS.find((h) => h.hitId === hitId);
}
