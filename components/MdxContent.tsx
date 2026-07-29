import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import { mdxComponents } from "./mdx-components";

/**
 * Pulls ```mermaid fenced blocks out of the raw MDX source and swaps them for a
 * <Mermaid chart="..."/> component call *before* remark/rehype (and rehype-pretty-code
 * in particular) ever touch the text — otherwise the diagram source gets turned into
 * syntax-highlighted HTML spans and mermaid.js can't parse it anymore.
 *
 * The chart is passed as a base64-encoded *plain* JSX attribute (chart="...") rather
 * than a JS expression container (chart={"..."}). The latter looks more natural but
 * this MDX/JSX pipeline silently drops the prop for expression-container string values
 * (props end up {} with no `chart` key at all) — plain quoted attributes work correctly,
 * and base64 has no quote characters in it, so it's safe to embed as one either way.
 */
function extractMermaidBlocks(source: string) {
  return source.replace(/```mermaid[ \t]*\r?\n([\s\S]*?)\r?\n?```/g, (_match, code: string) => {
    const encoded = Buffer.from(code.trim(), "utf-8").toString("base64");
    return `<Mermaid chart="${encoded}" />`;
  });
}

export function MdxContent({ source }: { source: string }) {
  const prepared = extractMermaidBlocks(source);

  return (
    <MDXRemote
      source={prepared}
      components={mdxComponents}
      options={{
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [
            rehypeSlug,
            [
              rehypePrettyCode,
              {
                theme: "github-dark-dimmed",
                keepBackground: false,
              },
            ],
          ],
        },
      }}
    />
  );
}
