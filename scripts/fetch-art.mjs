#!/usr/bin/env node
/**
 * Refreshes the Art section from the real accounts, so posts never have to be
 * listed by hand.
 *
 * YouTube publishes a public RSS feed per channel — no API key, no quota — so
 * the latest videos are fetched here at author time, their thumbnails saved
 * locally, and the result written to a JSON file the site imports. Nothing is
 * fetched in the browser: the page stays a static export, loads no third-party
 * script, and works offline.
 *
 * Instagram has no equivalent. Its public endpoints were closed years ago, and
 * reading a feed now needs a Facebook app with a long-lived token tied to a
 * Business/Creator account. Rather than ship a scraper that breaks silently,
 * Instagram is represented by a profile card that links out — see the note at
 * the bottom of this file for the upgrade path.
 *
 * Run: npm run fetch:art
 */
import { mkdir, writeFile, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const ROOT = path.resolve(import.meta.dirname, "..");
const OUT_JSON = path.join(ROOT, "src", "content", "generated", "youtube.json");
const THUMB_DIR = path.join(ROOT, "public", "media", "art");

const HANDLE = process.argv[2] ?? "@berkatov";
const MAX_VIDEOS = 12;

/**
 * Video ids to leave out of the feed.
 *
 * The point of this script is that posts are never listed by hand, so this is
 * deliberately a *deny* list, not an allow list: everything is included unless
 * it is named here. Useful for an ended livestream, which stays in the RSS feed
 * as the newest entry but embeds as a "not currently live" placeholder.
 */
const EXCLUDE_IDS = new Set([
  // "4NyoHDX5PBw", // ended livestream
]);
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/120.0 Safari/537.36";

async function resolveChannelId(handle) {
  const res = await fetch(`https://www.youtube.com/${handle}`, {
    headers: { "user-agent": UA, "accept-language": "en" },
  });
  if (!res.ok) throw new Error(`channel page ${res.status}`);
  const html = await res.text();
  const m =
    html.match(/"channelId":"(UC[\w-]{20,})"/) ??
    html.match(/youtube\.com\/channel\/(UC[\w-]{20,})/);
  if (!m) throw new Error("could not find a channel id on the page");
  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.replace(/ - YouTube$/, "");
  return { channelId: m[1], channelTitle: title?.trim() || handle };
}

/** The feed format is fixed and tiny, so a parser dependency isn't worth it. */
function parseFeed(xml) {
  const entries = [];
  for (const block of xml.split("<entry>").slice(1)) {
    const pick = (tag) =>
      block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`))?.[1]?.trim();
    const id = pick("yt:videoId");
    const title = pick("title");
    if (!id || !title) continue;
    entries.push({
      id,
      title: decodeXml(title),
      publishedAt: pick("published")?.slice(0, 10) ?? "",
      thumbUrl: block.match(/<media:thumbnail url="([^"]+)"/)?.[1] ?? "",
    });
  }
  return entries;
}

function decodeXml(s) {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

/** Saved locally so the page makes no request to Google when it opens. */
async function saveThumb(videoId, fallbackUrl) {
  const file = path.join(THUMB_DIR, `yt-${videoId}.webp`);
  for (const url of [
    `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    fallbackUrl,
  ]) {
    if (!url) continue;
    const res = await fetch(url, { headers: { "user-agent": UA } });
    if (!res.ok) continue;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 2000) continue; // YouTube's grey placeholder
    // These are only ever shown as grid tiles, so a maxres JPEG is 10x more
    // than the page needs. Resize and re-encode rather than shipping it raw.
    await sharp(buf)
      .resize(480, 270, { fit: "cover", position: "attention" })
      .webp({ quality: 78 })
      .toFile(file);
    return `/media/art/yt-${videoId}.webp`;
  }
  return null;
}

async function main() {
  await mkdir(THUMB_DIR, { recursive: true });
  await mkdir(path.dirname(OUT_JSON), { recursive: true });

  const { channelId, channelTitle } = await resolveChannelId(HANDLE);
  console.log(`Channel ${channelTitle} (${channelId})`);

  const res = await fetch(
    `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`,
  );
  if (!res.ok) throw new Error(`feed ${res.status}`);

  const all = parseFeed(await res.text());
  const entries = all.filter((e) => !EXCLUDE_IDS.has(e.id)).slice(0, MAX_VIDEOS);
  const skipped = all.length - entries.length;
  console.log(
    `${all.length} videos in the feed` + (skipped ? `, ${skipped} excluded` : ""),
  );

  const videos = [];
  for (const e of entries) {
    const poster = await saveThumb(e.id, e.thumbUrl);
    if (!poster) {
      console.warn(`  ! no thumbnail for ${e.id}, skipping`);
      continue;
    }
    videos.push({
      provider: "youtube",
      id: e.id,
      title: e.title,
      publishedAt: e.publishedAt,
      poster,
      url: `https://www.youtube.com/watch?v=${e.id}`,
    });
    console.log(`  ${e.publishedAt}  ${e.title}`);
  }

  if (videos.length === 0) throw new Error("feed produced no usable videos");

  await writeFile(
    OUT_JSON,
    JSON.stringify(
      { channelId, channelTitle, fetchedAt: new Date().toISOString().slice(0, 10), videos },
      null,
      2,
    ) + "\n",
  );
  console.log(`\nWrote ${path.relative(ROOT, OUT_JSON)} (${videos.length} videos)`);
}

try {
  await main();
} catch (err) {
  // Never leave the site worse than it was: the committed JSON keeps working,
  // so a failed refresh is a warning, not a broken build.
  console.error(`\nCould not refresh YouTube: ${err.message}`);
  try {
    const existing = JSON.parse(await readFile(OUT_JSON, "utf8"));
    console.error(`Keeping the existing ${existing.videos.length} videos.`);
  } catch {
    console.error("No previous data to fall back on — the Art section will show profiles only.");
  }
  process.exitCode = 1;
}
