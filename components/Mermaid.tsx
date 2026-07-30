"use client";

import { useEffect, useRef, useState, useId } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { DiagramFullscreen } from "./DiagramFullscreen";

function decodeBase64Utf8(b64: string): string {
  try {
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

const ZOOM_SCALE = 2.5;
const DOUBLE_TAP_MS = 300;
const DOUBLE_TAP_MAX_DIST = 30; // px, so a drag-then-tap doesn't register as a double-tap

export function Mermaid({ chart }: { chart?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const id = useId().replace(/:/g, "-");
  const lastTap = useRef<{ time: number; x: number; y: number } | null>(null);

  const source = decodeBase64Utf8(chart ?? "").trim();

  useEffect(() => {
    if (!source) {
      setFailed(true);
      return;
    }

    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
          securityLevel: "loose",
          themeVariables: {
            background: "#262626",
            primaryColor: "#404040",
            primaryTextColor: "#e5e5e5",
            primaryBorderColor: "#d4d4d4",
            lineColor: "#d4d4d4",
            secondaryColor: "#333333",
            tertiaryColor: "#2e2e2e",
            fontFamily: "Fira Code, monospace",
            fontSize: "13px",
          },
        });

        await mermaid.parse(source);
        const { svg: rendered } = await mermaid.render(`mermaid-${id}`, source);
        if (!cancelled) setSvg(rendered);
      } catch (err) {
        console.error("Mermaid render failed:", err);
        if (!cancelled) setFailed(true);
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [source, id]);

  function applyOrigin(clientX: number, clientY: number) {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const rect = wrap.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    const cx = Math.min(100, Math.max(0, x));
    const cy = Math.min(100, Math.max(0, y));
    inner.style.transformOrigin = `${cx}% ${cy}%`;
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") {
      applyOrigin(e.clientX, e.clientY);
      setZoomed(true);
    } else if (e.pointerType === "touch" && e.buttons > 0) {
      applyOrigin(e.clientX, e.clientY);
      setZoomed(true);
    }
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    if (e.pointerType === "touch") {
      const now = Date.now();
      const prev = lastTap.current;
      if (
        prev &&
        now - prev.time < DOUBLE_TAP_MS &&
        Math.hypot(e.clientX - prev.x, e.clientY - prev.y) < DOUBLE_TAP_MAX_DIST
      ) {
        lastTap.current = null;
        setZoomed(false);
        setFullscreen(true);
        return;
      }
      lastTap.current = { time: now, x: e.clientX, y: e.clientY };

      applyOrigin(e.clientX, e.clientY);
      setZoomed(true);
    }
  }

  function handleDoubleClick() {
    setZoomed(false);
    setFullscreen(true);
  }

  function release() {
    setZoomed(false);
    const inner = innerRef.current;
    if (inner) inner.style.transformOrigin = "50% 50%";
  }

  if (failed) {
    return (
      <div className="bg-n-700/30 border border-n-700 rounded-lg overflow-hidden my-6">
        <div className="px-3.5 py-2 border-b border-n-700/70 font-mono text-[11px] text-n-300/60">
          diagram source (couldn&apos;t be rendered)
        </div>
        <pre className="p-4 overflow-x-auto font-mono text-[12.5px] text-n-300 leading-[1.7]">
          {source || "(empty diagram)"}
        </pre>
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="bg-n-700/30 border border-n-700 rounded-lg p-5 my-6 text-n-300/60 text-[13px] font-mono">
        Rendering diagram…
      </div>
    );
  }

  return (
    <div className="my-6">
      <div
        ref={wrapRef}
        className="relative bg-n-700/30 border border-n-700 rounded-lg p-5 overflow-hidden cursor-zoom-in select-none"
        style={{ touchAction: "none" }}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={release}
        onPointerCancel={release}
        onPointerLeave={release}
        onDoubleClick={handleDoubleClick}
      >
        <div
          ref={innerRef}
          className="[&_svg]:mx-auto [&_svg]:block [&_svg]:w-full [&_svg]:h-auto"
          style={{
            transform: zoomed ? `scale(${ZOOM_SCALE})` : "scale(1)",
            transformOrigin: "50% 50%",
            transition: zoomed
              ? "transform 0.15s ease-out"
              : "transform 0.25s ease-out, transform-origin 0.25s ease-out",
          }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
      <div className="mt-1.5 text-center text-[11px] font-mono text-n-300/40">
        hover to zoom &middot; on touch, hold and drag to zoom &middot; double-click/double-tap for fullscreen
      </div>

      <DiagramFullscreen svg={svg} open={fullscreen} onClose={() => setFullscreen(false)} />
    </div>
  );
}