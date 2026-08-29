import type { Metadata } from "next";
import Link from "next/link";
import { SectionDocument } from "@/components/SectionDocument";
import { SECTION_IDS, SECTIONS } from "@/content";
import { SITE } from "@/content/site";

export const metadata: Metadata = {
  title: SITE.name ? `${SITE.name} — Text version` : "Text version",
  description: "Every section of the portfolio as a plain, readable page.",
};

/**
 * The accessible, crawlable mirror of the whole site.
 *
 * This is what the skip link, <noscript> and search engines get, and it renders
 * from the same SECTIONS registry as the modals — so the two cannot drift.
 */
export default function TextPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <header className="mb-12 space-y-3">
        <h1 className="pixel text-2xl">{SITE.name || "Portfolio"}</h1>
        {SITE.tagline ? <p className="text-muted">{SITE.tagline}</p> : null}
        <p>
          <Link className="text-accent underline" href="/">
            Back to the room
          </Link>
        </p>
      </header>

      <div className="space-y-16">
        {SECTION_IDS.map((id) => (
          <SectionDocument key={id} section={SECTIONS[id]} />
        ))}
      </div>

      <footer className="mt-16 border-t border-line pt-6 text-sm text-muted">
        <a className="text-accent underline" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
      </footer>
    </main>
  );
}
