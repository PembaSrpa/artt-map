import fs from "fs";
import path from "path";
import matter from "gray-matter";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type ProjectMeta = {
  slug: string;
  label: string;
  description?: string;
  order?: number;
};

export type PageMeta = {
  slug: string;
  title: string;
  order: number;
  filename: string;
};

/** Strip a leading "01-" style ordering prefix from a filename to get a slug. */
function slugFromFilename(filename: string) {
  return filename
    .replace(/\.mdx?$/, "")
    .replace(/^\d+-/, "");
}

export function getProjects(): ProjectMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const dirs = fs
    .readdirSync(CONTENT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory());

  const projects = dirs.map((d) => {
    const metaPath = path.join(CONTENT_DIR, d.name, "meta.json");
    let meta: Partial<ProjectMeta> = {};
    if (fs.existsSync(metaPath)) {
      meta = JSON.parse(fs.readFileSync(metaPath, "utf-8"));
    }
    return {
      slug: d.name,
      label: meta.label ?? d.name,
      description: meta.description,
      order: meta.order ?? 999,
    };
  });

  return projects.sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export function getProject(projectSlug: string): ProjectMeta | undefined {
  return getProjects().find((p) => p.slug === projectSlug);
}

export function getProjectPages(projectSlug: string): PageMeta[] {
  const dir = path.join(CONTENT_DIR, projectSlug);
  if (!fs.existsSync(dir)) return [];

  const files = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  const pages = files.map((filename) => {
    const raw = fs.readFileSync(path.join(dir, filename), "utf-8");
    const { data } = matter(raw);
    const slug = slugFromFilename(filename);
    return {
      slug,
      title: data.title ?? slug,
      order: data.order ?? 999,
      filename,
    };
  });

  return pages.sort((a, b) => a.order - b.order);
}

export function getPageSource(projectSlug: string, pageSlug: string) {
  const pages = getProjectPages(projectSlug);
  const page = pages.find((p) => p.slug === pageSlug);
  if (!page) return null;

  const filePath = path.join(CONTENT_DIR, projectSlug, page.filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(raw);

  return { content, data, meta: page };
}

export function getAllProjectSlugPairs() {
  const pairs: { project: string; slug: string }[] = [];
  for (const project of getProjects()) {
    for (const page of getProjectPages(project.slug)) {
      pairs.push({ project: project.slug, slug: page.slug });
    }
  }
  return pairs;
}
