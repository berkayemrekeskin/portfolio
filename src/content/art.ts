import youtube from "./generated/youtube.json";
import { socialUrl } from "./site";
import type { ArtProfile, Embed, Section } from "./types";

/**
 * Pulled from the real accounts rather than listed by hand.
 *
 * `generated/youtube.json` is refreshed by `npm run fetch:art`, which reads the
 * channel's public RSS feed and saves each thumbnail locally. Re-run it to pick
 * up new uploads — nothing here needs editing.
 *
 * Instagram has no public feed to read (see scripts/fetch-art.mjs), so it is a
 * profile card that links out instead of a post list.
 */
const items: Embed[] = youtube.videos as Embed[];

const profiles: ArtProfile[] = [
  {
    platform: "instagram" as const,
    url: socialUrl("instagram"),
    handle: "@berkayemreart",
    poster: "/media/art/insta.webp",
    blurb: "Drawings and sketches, posted as I go.",
  },
  {
    platform: "youtube" as const,
    url: socialUrl("youtube"),
    handle: "@berkatov",
    poster: "/media/art/youtube.webp",
    blurb: `3D and animation.`,
  },
].filter((p) => p.url !== "");

export const art: Extract<Section, { id: "art" }> = {
  id: "art",
  kind: "embeds",
  title: "Art",
  intro: "",
  items,
  profiles,
};
