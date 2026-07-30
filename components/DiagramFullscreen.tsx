"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

export function DiagramFullscreen({
  svg,
  open,
  onClose,
}: {
  svg: string;
  open: boolean;
  onClose: () => void;
}) {
  // lock body scroll + close on Escape while open
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
          onDoubleClick={onClose}
        >
          <button
            type="button"
            onClick={onClose}
            aria-label="Close fullscreen diagram"
            className="fixed top-4 right-4 sm:top-6 sm:right-6 w-9 h-9 flex items-center justify-center rounded-full bg-n-700/80 border border-n-700 text-n-200 hover:bg-n-700"
          >
            <X className="w-4.5 h-4.5" />
          </button>

          <motion.div
            className="w-full h-full max-w-[1400px] flex items-center justify-center [&_svg]:w-full [&_svg]:h-full [&_svg]:max-h-[85vh]"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            dangerouslySetInnerHTML={{ __html: svg }}
          />

          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 font-mono text-[11px] text-n-300/60">
            tap outside or press Esc to close
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}