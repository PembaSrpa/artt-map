"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, Folder } from "lucide-react";
import type { ProjectMeta, PageMeta } from "@/lib/content";
import { SidebarNav } from "./SidebarNav";

export function MobileSidebar({
  project,
  projects,
  pages,
  activeSlug,
}: {
  project: ProjectMeta;
  projects: ProjectMeta[];
  pages: PageMeta[];
  activeSlug?: string;
}) {
  const [open, setOpen] = useState(false);

  // lock body scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-2.5 px-4 sm:px-6 py-3 border-b border-n-700/60 text-n-200 text-[13.5px] sticky top-14 z-30 bg-n-800/95 backdrop-blur-sm"
      >
        <Menu className="w-4 h-4 text-n-300" />
        <Folder className="w-3.5 h-3.5 text-n-300/70" />
        <span className="font-display font-medium">{project.label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50">
            <motion.div
              className="absolute inset-0 bg-black/60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              className="absolute left-0 top-0 h-full w-[82%] max-w-[320px] bg-n-800 border-r border-n-700 overflow-y-auto px-3.5 py-4 text-[14px]"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 34 }}
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="font-mono text-[10.5px] uppercase tracking-wider text-n-300/60">
                  Navigate
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="w-7 h-7 flex items-center justify-center rounded-md text-n-300 hover:bg-n-200/[0.06] hover:text-n-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <SidebarNav
                project={project}
                projects={projects}
                pages={pages}
                activeSlug={activeSlug}
                onNavigate={() => setOpen(false)}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
