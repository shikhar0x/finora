import React, { useEffect, type ReactNode } from "react";
import Icon from "./Icon";

interface ModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  kicker?: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function Modal({
  isOpen = true,
  onClose,
  title,
  kicker,
  children,
  maxWidth = "540px",
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    // Lock scroll
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onMouseDown={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth }}
        onMouseDown={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <div>
            {kicker && <p className="card-kicker">{kicker}</p>}
            <h3 id="modal-title">{title}</h3>
          </div>

          <button
            className="modal-close"
            type="button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <Icon name="close" size={16} strokeWidth={2} />
          </button>
        </div>

        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
