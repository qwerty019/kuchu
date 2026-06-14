export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { getAiProject } from "@/lib/db/aiProject/data";
import { Chats } from "@/components/admin/ai/chats";
import { getApChat, getApChats } from "@/lib/db/apChat/data";
import { ApChatWithMessages } from "@/lib/db/apChat/schema";
import { Chat } from "@/components/admin/ai/chat";
import { Instructions } from "@/components/admin/ai/instructions";
import { isAdmin } from "@/lib/utils-server";
import GoBack from "@/components/admin/filters/go-back";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { chatId?: string };
}) {
  const { id } = params;
  const { chatId } = searchParams;

  await isAdmin(`/admin/ai/${id}`);

  const [project, chats] = await Promise.all([
    getAiProject({ id: Number(id) }),
    getApChats({ projectId: Number(id) }),
  ]);

  if (!project) redirect("/admin/ai");

  let chat: ApChatWithMessages | null = null;

  if (chatId) {
    chat = await getApChat({ id: Number(chatId) });
  }

  if (chatId && !chat) redirect(`/admin/ai/${id}`);

  return (
    <main className='admin-page space-y-6'>
      <section className='flex items-center gap-2'>
        <GoBack />
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
          {project.title}
        </h1>
      </section>
      <section className='grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1 min-h-0'>
        <Instructions project={project} />
        {searchParams.chatId ? (
          <Chat chat={chat as ApChatWithMessages} projectId={project.id} />
        ) : (
          <Chats chats={chats} projectId={project.id} />
        )}
      </section>
    </main>
  );
}
