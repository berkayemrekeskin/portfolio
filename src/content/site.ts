import type { FileLink, SocialLink } from "./types";

/**
 * Site-wide identity and links.
 *
 * TODO(content): fill in the empty strings. Anything left empty is simply not
 * rendered — no dead links, no placeholder URLs that look real.
 */
export interface SiteConfig {
  name: string;
  tagline: string;
  email: string;
  /** Absolute origin, used for canonical URLs and the sitemap. */
  url: string;
  locale: string;
}

export const SITE: SiteConfig = {
  name: "Berkay", // TODO(content): your display name
  tagline: "Computer Engineer", // TODO(content): one line under your name
  email: "berkayemrekeskin@gmail.com",
  url: "https://berkayemrekeskin.github.io/portfolio",
  locale: "en",
};

/**
 * TODO(content): add your profile URLs and handles.
 * Entries with an empty `url` are filtered out everywhere they're rendered.
 */
export const SOCIALS: SocialLink[] = [
  { platform: "linkedin", url: "https://www.linkedin.com/in/berkayemrekeskin/", handle: "@berkayemrekeskin" },
  { platform: "github", url: "https://github.com/berkayemrekeskin", handle: "@berkayemrekeskin" },
  { platform: "youtube", url: "https://www.youtube.com/@berkatov", handle: "@berkatov" },
  { platform: "instagram", url: "https://www.instagram.com/berkayemreart/", handle: "@berkayemreart" },
  { platform: "spotify", url: "https://open.spotify.com/playlist/5DTxXVnniGLtii7PzVu6XS?si=f2878fbc6cdd4771", handle: "fav. playlist" },
  { platform: "letterboxd", url: "https://letterboxd.com/berkayemre/", handle: "@berkayemre" },
];

export function socialUrl(platform: SocialLink["platform"]): string {
  return SOCIALS.find((s) => s.platform === platform)?.url ?? "";
}

/** Only the socials that have actually been filled in. */
export const LIVE_SOCIALS: SocialLink[] = SOCIALS.filter((s) => s.url !== "");

/** TODO(content): drop the PDF at this path and set the real size. */
export const CV: FileLink = {
  href: "/cv/cv.pdf",
  label: "cv",
  sizeKb: 350,
};

export const MAIL_SUBJECT = "Hello!";
