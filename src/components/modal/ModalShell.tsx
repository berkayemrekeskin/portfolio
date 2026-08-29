"use client";

import * as Dialog from "@radix-ui/react-dialog";
import type { ReactNode } from "react";

/**
 * The single dialog shell every section shares.
 *
 * Radix supplies the parts that are easy to get subtly wrong by hand: focus
 * trap, Escape to close, scroll lock, `aria-modal`, an inert background, and
 * focus restored to whatever opened it.
 */
export function ModalShell({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-black/70 backdrop-blur-[2px]" />
        <Dialog.Content
          className="fixed top-1/2 left-1/2 z-50 flex max-h-[85vh] w-[min(46rem,92vw)]
                     -translate-x-1/2 -translate-y-1/2 flex-col border-2 border-line
                     bg-panel shadow-[0_0_0_4px_rgba(0,0,0,0.5)]"
        >
          <div className="flex items-center justify-between border-b-2 border-line bg-room px-4 py-2">
            <Dialog.Title className="pixel text-sm text-fg">{title}</Dialog.Title>
            <Dialog.Close
              aria-label={`Close ${title}`}
              className="pixel px-2 text-sm text-muted hover:text-accent"
            >
              [x]
            </Dialog.Close>
          </div>

          <Dialog.Description className="sr-only">
            {title}. Press Escape to close and return to the room.
          </Dialog.Description>

          <div className="overflow-y-auto px-6 py-6">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
