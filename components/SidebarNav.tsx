import Link from "next/link";
import { FileText, LayoutGrid } from "lucide-react";
import type { ProjectMeta, PageMeta } from "@/lib/content";
import { ProjectSwitcher } from "./ProjectSwitcher";

function iconFor(slug: string) {
  if (slug === "overview") return LayoutGrid;
  if (slug === "architecture") return LayoutGrid;
  return null;
}

/** The actual nav content (project switcher + page tree), shared between the
 * desktop sidebar and the mobile slide-in drawer. */
export function SidebarNav({
  project,
  projects,
  pages,
  activeSlug,
  onNavigate,
}: {
  project: ProjectMeta;
  projects: ProjectMeta[];
  pages: PageMeta[];
  activeSlug?: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <ProjectSwitcher current={project} projects={projects} />

      <div className="font-mono text-[10.5px] uppercase tracking-wider text-n-300/60 px-2.5 pb-2">
        Pages
      </div>

      <div className="relative">
        {pages.map((page, i) => {
          const isActive = page.slug === activeSlug;
          const Icon = iconFor(page.slug) ?? FileText;
          const isFileDoc = page.title.includes("/") || page.title.includes(".");

          return (
            <div key={page.slug} className="relative pl-6 my-0.5">
              <span className="absolute left-2.5 top-0 bottom-1/2 w-px bg-n-700" />
              {i !== pages.length - 1 && (
                <span className="absolute left-2.5 top-1/2 bottom-[-2px] w-px bg-n-700" />
              )}
              <span className="absolute left-2.5 top-1/2 w-2.5 h-px bg-n-700" />

              <Link
                href={`/docs/${project.slug}/${page.slug}`}
                onClick={onNavigate}
                className={`flex items-center gap-2 px-2 py-2 sm:py-1.5 rounded-md ${
                  isActive
                    ? "bg-n-200/10 text-n-200 font-medium"
                    : "text-n-300 hover:bg-n-200/[0.06] hover:text-n-200"
                }`}
              >
                {isFileDoc ? (
                  <span className="font-mono text-[9.5px] text-n-300/60 w-3.5 text-center shrink-0">
                    {"</>"}
                  </span>
                ) : (
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? "text-n-200" : "text-n-300/60"
                    }`}
                  />
                )}
                <span className="truncate">{page.title}</span>
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
}
