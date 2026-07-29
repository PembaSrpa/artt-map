"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "motion/react";
import type { TocItem } from "@/lib/toc";

export function TocRail({ items }: { items: TocItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navRef = useRef<HTMLElement | null>(null);

  const updateActive = useCallback(() => {
    if (items.length === 0) return;

    const headingEls = items.map((item) => document.getElementById(item.id));
    const offset = 110; // px from top of viewport counted as "reached"

    // if we've scrolled (near) the bottom of the page, always highlight the last item —
    // its heading may never cross the offset threshold if the section is short.
    const atBottom =
      window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;

    if (atBottom) {
      setActiveIndex(items.length - 1);
      return;
    }

    let current = 0;
    for (let i = 0; i < headingEls.length; i++) {
      const el = headingEls[i];
      if (!el) continue;
      if (el.getBoundingClientRect().top <= offset) {
        current = i;
      }
    }
    setActiveIndex(current);
  }, [items]);

  useEffect(() => {
    if (items.length === 0) return;
    updateActive();

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActive();
        ticking = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [items, updateActive]);

  // measure the active link's position within the nav so the indicator can glide to it
  useEffect(() => {
    const el = linkRefs.current[activeIndex];
    const container = navRef.current;
    if (!el || !container) return;
    const elRect = el.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    setIndicator({
      top: elRect.top - containerRect.top,
      height: elRect.height,
    });
  }, [activeIndex, items]);

  if (items.length === 0) return <aside className="w-[220px] shrink-0 hidden lg:block" />;

  return (
    <aside className="w-[220px] shrink-0 py-11 px-5 h-[calc(100vh-56px)] sticky top-14 text-[13px] hidden lg:block">
      <div className="font-mono text-[10.5px] uppercase tracking-wider text-n-300/60 mb-3">
        On this page
      </div>
      <nav ref={navRef} className="relative flex flex-col">
        <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-n-700" />
        <motion.span
          className="absolute left-0 w-[2px] bg-n-200"
          animate={{ top: indicator.top, height: indicator.height }}
          transition={{ type: "spring", stiffness: 420, damping: 38, mass: 0.6 }}
        />
        {items.map((item, i) => (
          <a
            key={item.id}
            ref={(el) => {
              linkRefs.current[i] = el;
            }}
            href={`#${item.id}`}
            className={`py-1 pl-3 transition-colors ${
              i === activeIndex ? "text-n-200" : "text-n-300 hover:text-n-200"
            }`}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}
