"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Full-screen modal on the native <dialog>: focus trap, Esc and the backdrop come from the browser.
 */
export function Modal({
  open,
  onClose,
  closeLabel,
  children,
}: {
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  children: ReactNode;
}) {
  const dialog = useRef<HTMLDialogElement>(null);

  // Keeps the browser dialog in sync with React state (an external system, so an effect is the right tool).
  useEffect(() => {
    const element = dialog.current;
    if (!element) {
      return;
    }
    if (open && !element.open) {
      element.showModal();
    } else if (!open && element.open) {
      element.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
      className="m-auto h-dvh max-h-none w-screen max-w-none bg-transparent p-0 backdrop:bg-black/85"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={closeLabel}
        className="absolute right-5 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-3xl leading-none text-white hover:bg-white/20"
      >
        ×
      </button>
      {open ? <div className="grid h-full w-full place-items-center p-6 sm:p-10">{children}</div> : null}
    </dialog>
  );
}
