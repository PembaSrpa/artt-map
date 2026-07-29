import { redirect, notFound } from "next/navigation";
import { getProject, getProjectPages } from "@/lib/content";

export default async function ProjectIndexPage({
  params,
}: {
  params: Promise<{ project: string }>;
}) {
  const { project: projectSlug } = await params;
  const project = getProject(projectSlug);
  if (!project) notFound();

  const pages = getProjectPages(projectSlug);
  if (pages.length === 0) notFound();

  redirect(`/docs/${projectSlug}/${pages[0].slug}`);
}
