"use server";

import { z } from "zod";
import { AddApChatMessageSchema, EditApChatMessageSchema } from "./schema";
import { db } from "@/db";
import { apChat, apChatMessage, apKnowledge } from "@/db/schema";
import { asc, eq } from "drizzle-orm";
import { getEmbedding, textGeneration } from "@/lib/yandex";
import { getPrice, simulateVectorDbSearch } from "@/lib/utils";

export async function addApChatMessage({
  body,
}: {
  body: z.infer<typeof AddApChatMessageSchema>;
}): Promise<
  | {
      id: number;
      chatId: number;
      role: string;
      content: string;
      inputTokens: number | null;
      outputTokens: number | null;
      price: number | null;
      usedContext: string | null;
      createdAt: string;
      isDeleted: boolean;
      updatedAt: string;
    }[]
  | { message: string; errors?: Record<string, string[] | undefined> }
> {
  const parse = AddApChatMessageSchema.safeParse(body);

  if (!parse.success) {
    return {
      message: "Ошибка валидации",
      errors: parse.error.flatten().fieldErrors,
    };
  }

  const { chatId, role, content, usedContext } = parse.data;

  try {
    const chat = await db.query.apChat.findFirst({
      where: eq(apChat.id, chatId),
      columns: { projectId: true },
      with: {
        project: {
          columns: {
            id: true,
            title: true,
            instructions: true,
            description: true,
          },
          with: {
            apKnowledges: {
              where: eq(apKnowledge.isDeleted, false),
              columns: { content: true, embeddings: true },
            },
          },
        },
        apChatMessages: {
          where: eq(apChatMessage.isDeleted, false),
          orderBy: asc(apChatMessage.createdAt),
          columns: {
            role: true,
            content: true,
          },
        },
      },
    });

    if (!chat) {
      return { message: "Чат не найден" };
    }

    let context: string[] = [];

    if (chat.project.apKnowledges.length > 0) {
      const knowledges = chat.project.apKnowledges
        .map((k) =>
          k.embeddings ? { content: k.content, embeddings: k.embeddings } : null
        )
        .filter((k) => k !== null);
      const queryVector = await getEmbedding(content);
      const scoredDocuments = simulateVectorDbSearch(
        queryVector.embedding.map(Number),
        knowledges as { content: string; embeddings: number[] }[]
      );
      context = scoredDocuments;
    }

    const generated = await textGeneration({
      instructions: chat.project.instructions,
      messages: [
        ...chat.apChatMessages.map((m) => ({ role: m.role, text: m.content })),
        { role: "user", text: content },
      ],
      context,
    });

    const text = generated.result.alternatives[0].message.text;
    const inputTokens = generated.result.usage.inputTextTokens;
    const outputTokens = generated.result.usage.completionTokens;

    const price = getPrice(inputTokens, outputTokens, "yandexgpt-lite");

    const messages = await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(apChatMessage)
        .values({
          chatId,
          role,
          content,
          inputTokens: null,
          outputTokens: null,
          price: null,
          usedContext: null,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        .returning();

      const [createdAssistant] = await tx
        .insert(apChatMessage)
        .values({
          chatId,
          role: "assistant",
          content: text,
          inputTokens: inputTokens ? Number(inputTokens) : null,
          outputTokens: outputTokens ? Number(outputTokens) : null,
          price: price ? Number(price) : null,
          usedContext:
            context.length > 0
              ? context.map((c, i) => `${i + 1}. ${c}`).join("\n")
              : null,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        .returning();

      return [created, createdAssistant];
    });

    return messages;
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при добавлении сообщения" };
  }
}

export async function editApChatMessage({
  id,
  body,
}: {
  id: number;
  body: z.infer<typeof EditApChatMessageSchema>;
}) {
  const parse = EditApChatMessageSchema.safeParse(body);

  if (!parse.success) {
    return {
      message: "Ошибка валидации",
      errors: parse.error.flatten().fieldErrors,
    };
  }

  const { role, content, inputTokens, outputTokens, price, usedContext } =
    parse.data;

  try {
    const [updated] = await db
      .update(apChatMessage)
      .set({
        role,
        content,
        inputTokens,
        outputTokens,
        price,
        usedContext,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(apChatMessage.id, id))
      .returning();

    return updated;
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при редактировании сообщения" };
  }
}

export async function deleteApChatMessage({ id }: { id: number }) {
  try {
    const [deleted] = await db
      .update(apChatMessage)
      .set({
        isDeleted: true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(apChatMessage.id, id))
      .returning();

    return deleted;
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при удалении сообщения" };
  }
}
