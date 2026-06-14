export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getAiProject } from "@/lib/db/aiProject/data";
import { getApKnowledges } from "@/lib/db/apKnowledge/data";
import { Knowledge } from "@/components/admin/ai/knowledge";
import { isAdmin } from "@/lib/utils-server";
import { AddKnowledge } from "@/components/admin/ai/knowledge-actions";
import GoBack from "@/components/admin/filters/go-back";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  await isAdmin(`/admin/ai/${id}/knowledges`);

  const project = await getAiProject({ id: Number(id) });

  if (!project) redirect("/admin/ai");

  const knowledges = await getApKnowledges({ projectId: Number(id) });

  return (
    <main className='admin-page space-y-6'>
      <section className='flex items-center justify-between gap-2'>
        <section className='flex items-center gap-2'>
          <GoBack />
          <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
            Список знаний
          </h1>
        </section>
        <AddKnowledge projectId={project.id} />
      </section>
      <div className='space-y-2'>
        {knowledges.map((knowledge) => (
          <Knowledge key={knowledge.id} knowledge={knowledge} />
        ))}
      </div>
    </main>
  );
}
