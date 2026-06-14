"use server";

import { db } from "@/db";
import { apChat, apChatMessage } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { ApChat, ApChatWithMessages } from "./schema";

export async function getApChats({ projectId }: { projectId: number }) {
  noStore();

  try {
    const apChats = await db.query.apChat.findMany({
      where: and(eq(apChat.isDeleted, false), eq(apChat.projectId, projectId)),
      orderBy: asc(apChat.id),
      columns: {
        id: true,
        title: true,
      },
    });

    return apChats satisfies ApChat[];
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении чатов");
  }
}

export async function getApChat({ id }: { id: number }) {
  noStore();

  try {
    const [chat, messages] = await Promise.all([
      db.query.apChat.findFirst({
        where: and(eq(apChat.isDeleted, false), eq(apChat.id, id)),
        columns: {
          id: true,
          title: true,
        },
      }),
      db.query.apChatMessage.findMany({
        where: and(
          eq(apChatMessage.isDeleted, false),
          eq(apChatMessage.chatId, id)
        ),
        orderBy: asc(apChatMessage.createdAt),
        columns: {
          id: true,
          role: true,
          content: true,
          createdAt: true,
          price: true,
          inputTokens: true,
          outputTokens: true,
          usedContext: true,
        },
      }),
    ]);

    if (!chat) return null;

    const chatWithMessages = {
      ...chat,
      messages,
    };

    return chatWithMessages satisfies ApChatWithMessages;
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении чата");
  }
}
