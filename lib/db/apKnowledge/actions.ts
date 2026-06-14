"use server";

import { z } from "zod";
import { AddApKnowledgeSchema, EditApKnowledgeSchema } from "./schema";
import { db } from "@/db";
import { apKnowledge } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getEmbedding } from "@/lib/yandex";

export async function addApKnowledge({
  body,
}: {
  body: z.infer<typeof AddApKnowledgeSchema>;
}) {
  const parse = AddApKnowledgeSchema.safeParse(body);

  if (!parse.success) {
    return {
      message: "Ошибка валидации",
      errors: parse.error.flatten().fieldErrors,
    };
  }

  const { title, content, projectId } = parse.data;

  try {
    const embedding = await getEmbedding(content);
    const embeddings = embedding.embedding.map(Number);

    await db
      .insert(apKnowledge)
      .values({
        projectId,
        title,
        content,
        embeddings,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return { success: true };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при добавлении знания" };
  }
}

export async function editApKnowledge({
  id,
  body,
}: {
  id: number;
  body: z.infer<typeof EditApKnowledgeSchema>;
}) {
  const parse = EditApKnowledgeSchema.safeParse(body);

  if (!parse.success) {
    return {
      message: "Ошибка валидации",
      errors: parse.error.flatten().fieldErrors,
    };
  }

  const { title, content } = parse.data;

  try {
    const existing = await db.query.apKnowledge.findFirst({
      where: eq(apKnowledge.id, id),
      columns: {
        content: true,
      },
    });

    if (!existing) {
      return { message: "Знание не найдено" };
    }

    let embeddings: number[] | undefined;

    if (existing.content !== content) {
      const embedding = await getEmbedding(content);
      embeddings = embedding.embedding.map(Number);
    }

    await db
      .update(apKnowledge)
      .set({
        title,
        content,
        ...(embeddings && { embeddings }),
        updatedAt: new Date().toISOString(),
      })
      .where(eq(apKnowledge.id, id))
      .returning();

    return { success: true };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при редактировании проекта" };
  }
}

export async function deleteApKnowledge({ id }: { id: number }) {
  try {
    await db
      .update(apKnowledge)
      .set({
        isDeleted: true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(apKnowledge.id, id))
      .returning();

    return { success: true };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при удалении знания" };
  }
}
