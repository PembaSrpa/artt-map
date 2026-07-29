import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjects, getProjectPages } from "@/lib/content";
import { TopBar } from "@/components/TopBar";

export default function Home() {
  const projects = getProjects();

  return (
    <div>
      <TopBar />
      <main className="max-w-[880px] mx-auto px-6 sm:px-10 py-16">
        <div className="font-mono text-xs text-n-300/70 uppercase tracking-wider mb-3">
          artt-map
        </div>
        <h1 className="font-display text-[34px] font-semibold tracking-tight mb-3">
          How my apps work
        </h1>
        <p className="text-n-300 text-[16px] max-w-[60ch] mb-12">
          Documentation for how each of my personal projects is built —
          architecture, file-by-file breakdowns, and how everything connects.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((project) => {
            const pageCount = getProjectPages(project.slug).length;
            return (
              <Link
                key={project.slug}
                href={`/docs/${project.slug}`}
                className="group border border-n-700 rounded-xl p-5 hover:bg-n-700/20 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <h2 className="font-display font-semibold text-[16px]">
                    {project.label}
                  </h2>
                  <ArrowUpRight className="w-4 h-4 text-n-300/60 group-hover:text-n-200 transition-colors" />
                </div>
                <p className="text-n-300 text-[14px] mb-3">{project.description}</p>
                <div className="font-mono text-[11px] text-n-300/60 uppercase tracking-wide">
                  {pageCount} {pageCount === 1 ? "page" : "pages"}
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
