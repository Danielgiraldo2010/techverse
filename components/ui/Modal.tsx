"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  size?: "md" | "lg";
}

export function Modal({ open, title, onClose, children, size = "md" }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose, open]);

  useEffect(() => {
    if (open) {
      dialogRef.current?.focus();
    }
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="modal show" role="presentation" onMouseDown={onClose}>
      <div
        ref={dialogRef}
        className={`modal-dialog modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="modal-title">{title}</h3>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Cerrar modal">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}