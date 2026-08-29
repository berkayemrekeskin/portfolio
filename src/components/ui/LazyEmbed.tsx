"use client";

import { useState } from "react";
import type { Embed } from "@/content/types";
import { asset } from "@/lib/asset";

/**
 * A video tile that shows a local thumbnail and only mounts the YouTube iframe
 * once the visitor actually clicks play.
 *
 * This matters: each YouTube iframe pulls roughly a megabyte and sets cookies
 * the moment it exists. Ten mounted eagerly would dominate the page and track
 * everyone who opened the Art section, including people who never watched
 * anything. Until it is clicked this is a button and an <img>, and nothing has
 * been requested from Google.
 */
export function LazyEmbed({ embed }: { embed: Embed }) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <div className="relative aspect-video w-full border border-line bg-black">
        <iframe
          // nocookie: the privacy-preserving host, and still only after a click.
          src={`https://www.youtube-nocookie.com/embed/${embed.id}?autoplay=1&rel=0`}
          title={embed.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Play ${embed.title} on YouTube`}
      className="group relative block w-full cursor-pointer border border-line bg-room p-0 text-left"
    >
      <span className="relative block aspect-video overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={asset(embed.poster)}
          alt=""
          width={480}
          height={270}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover transition group-hover:brightness-110"
        />
        <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center">
          <span className="pixel border-2 border-fg bg-black/70 px-3 py-1 text-sm text-fg transition group-hover:border-accent group-hover:text-accent">
            &#9654;
          </span>
        </span>
      </span>
      <span className="block px-2 py-2">
        <span className="block text-sm leading-snug text-fg">{embed.title}</span>
        {embed.publishedAt ? (
          <time className="block text-xs text-muted" dateTime={embed.publishedAt}>
            {embed.publishedAt}
          </time>
        ) : null}
      </span>
    </button>
  );
}
