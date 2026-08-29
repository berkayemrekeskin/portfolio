import type { Photo, Section } from "./types";

/**
 * TODO(content): drop images in public/media/photos/ and list them here.
 * `w` and `h` are the intrinsic pixel dimensions — they reserve layout space
 * so the gallery doesn't shift as images load.
 */
const items: Photo[] = [];

export const photos: Extract<Section, { id: "photos" }> = {
  id: "photos",
  kind: "gallery",
  title: "Photo album",
  intro: "",
  items,
};
