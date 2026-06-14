export const dynamic = "force-dynamic";

import { getAiProjects } from "@/lib/db/aiProject/data";
import Link from "next/link";
import { AiProject } from "@/lib/db/aiProject/schema";
import { isAdmin } from "@/lib/utils-server";
import { AddProject, EditProject } from "@/components/admin/ai/project-actions";

export default async function Page() {
  await isAdmin("/admin/ai");

  const projects = await getAiProjects();

  return (
    <main className='admin-page space-y-6'>
      <section className='flex items-center justify-between gap-2'>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
          Список проектов
        </h1>
        <AddProject />
      </section>
      <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </section>
    </main>
  );
}

function ProjectCard({ project }: { project: AiProject }) {
  return (
    <div className='w-full border rounded-2xl p-4 transition-colors flex items-center justify-between gap-2'>
      <Link href={`/admin/ai/${project.id}`} className='w-full'>
        <p className='text-base font-medium'>{project.title}</p>
        <p className='text-xs text-muted-foreground'>
          {project.description || "Без описания"}
        </p>
      </Link>
      <EditProject project={project} />
    </div>
  );
}
