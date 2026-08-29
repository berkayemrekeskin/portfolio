# Pixel-room portfolio

A portfolio with no navigation bar. The whole site is one interactive pixel-art room: hovering an
object names it next to the cursor, clicking it opens a modal or an external profile.

```bash
npm run dev     # http://localhost:3000
npm run build   # static export to out/
npm run lint
```

## Where things live

Everything you'd want to change routinely is under `src/content/`, and nothing else needs touching:

| File | What it holds |
| --- | --- |
| `site.ts` | Your name, tagline, email, every social URL, and the CV path |
| `about.ts` `projects.ts` `experience.ts` `achievements.ts` `photos.ts` `art.ts` | The copy for each section |
| `hotspots.ts` | The fourteen regions: rect, z-order, label, and what each one does |
| `types.ts` | The data model. A section that doesn't match its type is a build error |
| `scene-config.ts` | `MIN_SCALE`, the floor for the whole-integer display scale |

Sections with nothing in them render an honest "still being written" state rather than an empty box,
so the site is presentable at every stage. Socials with an empty `url` are dropped everywhere they'd
be rendered — no dead links — and an object whose only job is an empty link is not focusable.

## The room

The scene is a **single image** — `public/scene/room.jpg`, 2752×1536 — with hotspots as rectangular
regions measured over it in `src/content/hotspots.ts`. `z` resolves overlaps, so the camera beats the
bookshelf beneath it and the jacket beats the easel leg that crosses it.

Hotspots are authored in a fixed **344×191 coordinate space** (`SCENE_W`/`SCENE_H`), not in the
image's pixel size. The artwork is stretched to fill that box, so swapping in a different resolution
later doesn't invalidate a single rect.

The box is then scaled by a **fractional contain fit** so the room fills the window — at 1280×720 it
renders 1280×711. The scale isn't snapped to an integer: the artwork is being scaled *down* rather
than blown up, so there's no pixel grid to keep aligned, and flooring would leave thick bars at almost
every window size. Touch devices get a floor of 2× instead, panning sideways rather than shrinking
until nothing can be tapped.

**Hover draws nothing on the object.** The cursor label names it, and that's the whole affordance.
Anything more would have to be a rectangle, since one painting has no per-object silhouette to trace,
and a box around a cat reads as a bug. Keyboard focus is the deliberate exception: it has no cursor
and no label following it, so the focus ring on the invisible hotspot buttons stays visible.

### On the 2 MB image

`room.jpg` is by far the heaviest thing the site serves. Its real pixel grid is 8×8 blocks, so the
true artwork is only 344×191 and the rest is upscaling plus JPEG noise. `npm run extract:room`
recovers that native grid into a ~29 KB PNG that upscales crisply at whole-integer scales:

```bash
npm run extract:room                 # writes public/scene/room.png
```

To use it, point `ROOM_IMAGE` in `src/content/types.ts` at `/scene/room.png`, restore
`image-rendering: pixelated` on `.scene-stage img` in `globals.css`, and snap the scale back to
integers in `useSceneScale`. That trades some smoothness for a 72× smaller payload and true pixel
crispness — worth doing if load time starts to matter.

## The Art section

Nothing in it is listed by hand.

```bash
npm run fetch:art
```

reads the YouTube channel's public RSS feed (no API key, no quota), saves every
thumbnail locally as a resized WebP, and writes `src/content/generated/youtube.json`,
which `content/art.ts` imports. Re-run it to pick up new uploads.

Two consequences worth keeping:

- **No third-party requests on load.** Thumbnails are same-origin, and a YouTube
  iframe is only mounted when someone clicks play — via `youtube-nocookie.com`.
  Ten eagerly-mounted iframes would be roughly ten megabytes and would set
  cookies for every visitor who opened the section, including those who never
  watched anything.
- **Builds never depend on the network.** The generated JSON is committed, and a
  failed refresh warns and leaves the previous data in place.

To drop a video (an ended livestream still shows in the feed as the newest entry,
but embeds as a "not currently live" placeholder), add its id to `EXCLUDE_IDS` in
`scripts/fetch-art.mjs`. It is a deny list on purpose — everything is included
unless named.

**Instagram is a profile card, not a post feed.** Its public endpoints were closed
years ago; reading posts now needs a Facebook app with a long-lived token tied to a
Business or Creator account. A scraper would break silently and violate their terms,
so the card links out instead. If you set up Graph API credentials later, the
`Embed` type already supports `provider: "instagram"` and the renderer will show
those posts alongside the videos.

## Accessibility

The room is not the only way in. `/text` is a static, semantic page containing every section, rendered
from the same `SectionDocument` the modals use, so the two can never drift. It's the first thing in
the tab order via the skip link, and it's what `<noscript>` and search engines get.

Inside the room, pointer input and focus are deliberately separate: the pointer goes through one
surface and region picking, while keyboard and screen readers get real `<button>`s ordered by
meaning (about → experience → projects → achievements → art → photos → github → letterboxd → spotify →
email) rather than by position.
