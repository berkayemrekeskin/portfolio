"use client";

import { SectionDocument } from "@/components/SectionDocument";
import { SECTIONS } from "@/content";
import type { SectionId } from "@/content/types";
import { ModalShell } from "./ModalShell";

/**
 * Opens whichever section the hash names.
 *
 * The body is `SectionDocument`, the same renderer `/text` uses, so a section
 * can never read differently in the two places. Kind-specific interactive
 * bodies (a gallery lightbox, click-to-load embeds) wrap this later without
 * changing where the content itself lives.
 */
export function ModalRouter({
  section,
  onClose,
}: {
  section: SectionId | null;
  onClose: () => void;
}) {
  const current = section ? SECTIONS[section] : null;

  return (
    <ModalShell
      open={current !== null}
      onClose={onClose}
      title={current?.title ?? ""}
    >
      {current ? <SectionDocument section={current} showTitle={false} /> : null}
    </ModalShell>
  );
}
