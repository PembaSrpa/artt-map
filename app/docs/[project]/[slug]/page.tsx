import { notFound } from "next/navigation";
import {
  getProject,
  getProjects,
  getProjectPages,
  getPageSource,
  getAllProjectSlugPairs,
} from "@/lib/content";
import { extractHeadings } from "@/lib/toc";
import { TopBar } from "@/components/TopBar";
import { DocsSidebar } from "@/components/DocsSidebar";
import { MobileSidebar } from "@/components/MobileSidebar";
import { TocRail } from "@/components/TocRail";
import { MdxContent } from "@/components/MdxContent";

export function generateStaticParams() {
  return getAllProjectSlugPairs();
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ project: string; slug: string }>;
}) {
  const { project: projectSlug, slug } = await params;

  const project = getProject(projectSlug);
  if (!project) notFound();

  const pageData = getPageSource(projectSlug, slug);
  if (!pageData) notFound();

  const projects = getProjects();
  const pages = getProjectPages(projectSlug);
  const pageIndex = pages.findIndex((p) => p.slug === slug);
  const headings = extractHeadings(pageData.content);

  return (
    <div>
      <TopBar />
      <MobileSidebar project={project} projects={projects} pages={pages} activeSlug={slug} />

      <div className="max-w-[1680px] mx-auto flex">
        <DocsSidebar project={project} activeSlug={slug} />

        <main className="flex-1 min-w-0 px-5 sm:px-10 lg:px-14 py-8 sm:py-11 pb-24 max-w-[960px]">
          <div className="font-mono text-xs text-n-300 flex items-center gap-2 mb-3.5 uppercase flex-wrap">
            {project.label}
            <span className="text-n-300/50">/</span>
            {pages[pageIndex]?.title}
          </div>

          <h1 className="font-display text-[26px] sm:text-[32px] font-semibold tracking-tight mb-8">
            {pages[pageIndex]?.title}
          </h1>

          <MdxContent source={pageData.content} />
        </main>

        <TocRail items={headings} />
      </div>
    </div>
  );
}
