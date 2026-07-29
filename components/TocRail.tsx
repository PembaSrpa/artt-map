"use client";

import { useEffect, useState } from "react";
import type { TocItem } from "@/lib/toc";

export function TocRail({ items }: { items: TocItem[] }) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null);

  useEffect(() => {
    if (items.length === 0) return;

    const headingEls = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => el !== null);

    if (headingEls.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the heading closest to the top of the viewport among those currently intersecting
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const topMost = visible.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveId(topMost.target.id);
        }
      },
      {
        // trigger a bit before a heading reaches the very top, and stop a bit before
        // it reaches the bottom, so the "active" section feels natural while reading
        rootMargin: "-96px 0px -70% 0px",
        threshold: 0,
      }
    );

    headingEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return <aside className="w-[220px] shrink-0 hidden lg:block" />;

  return (
    <aside className="w-[220px] shrink-0 py-11 px-5 h-[calc(100vh-56px)] sticky top-14 text-[13px] hidden lg:block">
      <div className="font-mono text-[10.5px] uppercase tracking-wider text-n-300/60 mb-3">
        On this page
      </div>
      <nav className="flex flex-col">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              className={`py-1 pl-3 border-l-2 transition-colors ${
                isActive
                  ? "border-n-200 text-n-200"
                  : "border-n-700 text-n-300 hover:text-n-200"
              }`}
            >
              {item.text}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
