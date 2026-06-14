"use client";

import { ApChat } from "@/lib/db/apChat/schema";
import Link from "next/link";
import { AddChat, EditChat } from "./chat-actions";

export function Chats({
  chats,
  projectId,
}: {
  chats: ApChat[];
  projectId: number;
}) {
  return (
    <div className='border rounded-2xl p-4 flex flex-col h-[calc(100dvh-170px)]'>
      <div className='flex items-center justify-between gap-2 mb-4'>
        <p className='text-sm font-medium'>Чаты</p>
        <AddChat projectId={projectId} />
      </div>
      <div className='w-full flex-1 overflow-y-auto space-y-1 thin-scrollbar'>
        {chats.map((chat) => (
          <ChatItem key={chat.id} chat={chat} projectId={projectId} />
        ))}
      </div>
    </div>
  );
}

function ChatItem({ chat, projectId }: { chat: ApChat; projectId: number }) {
  return (
    <div className='border rounded-xl flex items-center justify-between gap-2 w-full p-2'>
      <Link
        href={`/admin/ai/${projectId}?chatId=${chat.id}`}
        className='w-full flex items-center justify-between gap-2'
        replace
      >
        <p className='text-sm font-medium w-full pl-2'>{chat.title}</p>
      </Link>
      <EditChat chat={chat} />
    </div>
  );
}
