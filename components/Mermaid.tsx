"use client";

import { useEffect, useRef, useState, useId } from "react";

export function Mermaid({ chart }: { chart: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const id = useId().replace(/:/g, "-");

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          theme: "dark",
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
          securityLevel: "strict",
        });

        const { svg: rendered } = await mermaid.render(`mermaid-${id}`, chart.trim());
        if (!cancelled) setSvg(rendered);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to render diagram");
      }
    }

    render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="bg-n-700/30 border border-n-700 rounded-lg p-4 my-6 text-[13px] text-n-300">
        <p className="text-n-200 font-mono mb-2">Diagram failed to render</p>
        <pre className="whitespace-pre-wrap font-mono text-[12px]">{error}</pre>
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
