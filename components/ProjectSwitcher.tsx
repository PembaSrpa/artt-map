"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Folder, ChevronDown, Check } from "lucide-react";
import type { ProjectMeta } from "@/lib/content";

export function ProjectSwitcher({
  current,
  projects,
}: {
  current: ProjectMeta;
  projects: ProjectMeta[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative mb-4" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center gap-2.5 bg-n-700/40 border border-n-700 rounded-lg px-2.5 py-2 hover:bg-n-700 transition-colors"
      >
        <Folder className="w-[15px] h-[15px] text-n-300 shrink-0" />
        <span className="font-display font-medium text-[13px] flex-1 text-left truncate">
          {current.label}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-n-300/60 shrink-0" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 mt-1.5 bg-n-800 border border-n-700 rounded-lg shadow-lg overflow-hidden z-10">
          {projects.map((p) => (
            <Link
              key={p.slug}
              href={`/docs/${p.slug}`}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-[13px] text-n-300 hover:bg-n-700/50 hover:text-n-200"
            >
              <span className="w-3.5 flex justify-center">
                {p.slug === current.slug && <Check className="w-3.5 h-3.5 text-n-200" />}
              </span>
              {p.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
