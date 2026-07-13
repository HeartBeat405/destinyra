"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

// Reusable slide-over drawer (dark admin). Used by taxonomy managers.
export default function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#0b0b18]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
          <h3 className="font-bold text-white">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-gray-400 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="border-t border-white/10 px-6 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
