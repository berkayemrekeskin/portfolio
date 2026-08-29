import Link from "next/link";
import { Scene } from "@/components/scene/Scene";
import { SECTION_IDS, SECTIONS } from "@/content";
import { SITE } from "@/content/site";

export default function Home() {
  return (
    <main>
      <h1 className="sr-only">
        {SITE.name || "Portfolio"}
        {SITE.tagline ? ` — ${SITE.tagline}` : ""}
      </h1>

      <Scene />

      {/* Without JavaScript the room can't be explored, so hand over the real page. */}
      <noscript>
        <div className="mx-auto max-w-2xl px-6 py-12">
          <p className="mb-4">
            This site is an interactive room that needs JavaScript.
          </p>
          <ul className="list-disc space-y-1 pl-5">
            {SECTION_IDS.map((id) => (
              <li key={id}>
                <Link className="text-accent underline" href="/text/">
                  {SECTIONS[id].title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </noscript>
    </main>
  );
}
