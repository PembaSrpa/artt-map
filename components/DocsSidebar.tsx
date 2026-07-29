import { getProjects, getProjectPages, type ProjectMeta } from "@/lib/content";
import { SidebarNav } from "./SidebarNav";

export function DocsSidebar({
  project,
  activeSlug,
}: {
  project: ProjectMeta;
  activeSlug?: string;
}) {
  const projects = getProjects();
  const pages = getProjectPages(project.slug);

  return (
    <aside className="w-[250px] shrink-0 border-r border-n-700/60 h-[calc(100vh-56px)] sticky top-14 overflow-y-auto px-3.5 py-4.5 text-[13.5px] hidden md:block">
      <SidebarNav project={project} projects={projects} pages={pages} activeSlug={activeSlug} />
    </aside>
  );
}
