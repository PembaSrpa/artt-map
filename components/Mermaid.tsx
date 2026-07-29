"use client";

import { useEffect, useRef, useState, useId } from "react";

export function Mermaid({ chart }: { chart?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);
  const id = useId().replace(/:/g, "-");

  const source = (chart ?? "").trim();

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

        // parse first so a syntax error doesn't leave the DOM in a half-rendered state
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

  // graceful fallback: show the raw diagram source, styled like a normal code
  // block, instead of a cryptic parser error the reader can't do anything with
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
    <div
      ref={ref}
      className="bg-n-700/30 border border-n-700 rounded-lg p-5 my-6 overflow-x-auto [&_svg]:mx-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
