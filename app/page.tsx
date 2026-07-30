import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getProjects, getProjectPages } from "@/lib/content";
import { TopBar } from "@/components/TopBar";

export default function Home() {
  const projects = getProjects();

  return (
    <div>
      <TopBar />
      <main className="max-w-[1400px] mx-auto px-6 sm:px-10 lg:px-16 py-16 sm:py-24">
        <div className="font-mono text-sm text-n-300/70 uppercase tracking-wider mb-4">
          artt-map
        </div>
        <h1 className="font-display text-[44px] sm:text-[64px] font-semibold tracking-tight mb-5 max-w-[16ch]">
          How my apps work
        </h1>
        <p className="text-n-300 text-[17px] sm:text-[19px] max-w-[62ch] mb-16 leading-relaxed">
          Documentation for how each of my personal projects is built —
          architecture, file-by-file breakdowns, and how everything connects.
        </p>

        <div className="grid sm:grid-cols-2 gap-5">
          {projects.map((project) => {
            const pageCount = getProjectPages(project.slug).length;
            return (
              <Link
                key={project.slug}
                href={`/docs/${project.slug}`}
                className="group border border-n-700 rounded-2xl p-7 sm:p-9 hover:bg-n-700/20 hover:border-n-300/40 transition-colors"
              >
                <div className="flex items-start justify-between mb-3.5">
                  <h2 className="font-display font-semibold text-[22px] sm:text-[26px]">
                    {project.label}
                  </h2>
                  <ArrowUpRight className="w-5 h-5 text-n-300/60 group-hover:text-n-200 transition-colors shrink-0 mt-1" />
                </div>
                <p className="text-n-300 text-[15px] sm:text-[16px] leading-relaxed mb-5">
                  {project.description}
                </p>
                <div className="font-mono text-[12px] text-n-300/60 uppercase tracking-wide">
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
