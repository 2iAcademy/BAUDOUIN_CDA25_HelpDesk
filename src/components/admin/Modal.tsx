"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ onClose, children }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: 12,
          padding: "1.5rem",
          maxWidth: 480,
          width: "90%",
        }}
      >
        {children}
      </div>
    </div>,
    document.body,
  );
}
