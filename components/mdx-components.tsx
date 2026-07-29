import type { MDXComponents } from "mdx/types";
import { Info } from "lucide-react";
import { Mermaid } from "./Mermaid";

export const mdxComponents: MDXComponents = {
  Mermaid,
  h1: (props) => (
    <h1 className="font-display text-[28px] sm:text-[32px] font-semibold tracking-tight mb-4" {...props} />
  ),
  h2: (props) => (
    <h2 className="font-display text-[19px] sm:text-[20px] font-semibold mt-14 mb-4 pt-1.5 scroll-mt-20" {...props} />
  ),
  h3: (props) => (
    <h3 className="font-display text-[16px] sm:text-[17px] font-semibold mt-10 mb-3 scroll-mt-20" {...props} />
  ),
  p: (props) => (
    <p className="text-n-300 text-[15px] sm:text-[15.5px] mb-4.5 leading-[1.75]" {...props} />
  ),
  ul: (props) => (
    <ul className="list-disc pl-5 text-n-300 text-[15px] sm:text-[15.5px] mb-4.5 space-y-2 leading-[1.75]" {...props} />
  ),
  ol: (props) => (
    <ol className="list-decimal pl-5 text-n-300 text-[15px] sm:text-[15.5px] mb-4.5 space-y-2 leading-[1.75]" {...props} />
  ),
  li: (props) => <li className="pl-1" {...props} />,
  a: (props) => <a className="text-n-200 underline underline-offset-2 decoration-n-700 hover:decoration-n-300" {...props} />,
  code: (props) => (
    <code className="font-mono text-[0.88em] text-n-200 bg-n-700/40 px-[5px] py-[2px] rounded break-words" {...props} />
  ),
  table: (props) => (
    <div className="overflow-x-auto mb-6 -mx-1 px-1">
      <table className="w-full min-w-[560px] text-[13.5px] border border-n-700 rounded-lg overflow-hidden border-separate border-spacing-0" {...props} />
    </div>
  ),
  thead: (props) => <thead className="bg-n-700/40" {...props} />,
  th: (props) => (
    <th className="text-left font-mono text-[11px] uppercase tracking-wide text-n-300/70 px-4 py-3 border-b border-n-700 whitespace-nowrap" {...props} />
  ),
  td: (props) => (
    <td className="px-4 py-3.5 border-b border-n-700/60 text-n-300 align-top leading-relaxed" {...props} />
  ),
  blockquote: (props) => (
    <div className="flex gap-3 bg-n-700/30 border border-n-700 border-l-[3px] border-l-n-200 rounded-lg px-4 sm:px-5 py-4 my-6 text-[14px] sm:text-[14.5px] text-n-300 leading-relaxed">
      <Info className="w-[17px] h-[17px] text-n-200 shrink-0 mt-0.5" />
      <div className="[&>p]:mb-0">{props.children}</div>
    </div>
  ),
  // rehype-pretty-code wraps codeblocks in a <figure data-rehype-pretty-code-figure>
  figure: (props) => (
    <figure className="bg-n-700/30 border border-n-700 rounded-lg overflow-x-auto my-6" {...props} />
  ),
};
