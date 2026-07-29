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
 */
function extractMermaidBlocks(source: string) {
  return source.replace(/```mermaid\n([\s\S]*?)```/g, (_match, code: string) => {
    const encoded = JSON.stringify(code.trim());
    return `<Mermaid chart={${encoded}} />`;
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
