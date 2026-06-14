"use server";

import { z } from "zod";
import { AddApChatSchema, EditApChatSchema } from "./schema";
import { db } from "@/db";
import { apChat } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function addApChat({
  body,
}: {
  body: z.infer<typeof AddApChatSchema>;
}) {
  const parse = AddApChatSchema.safeParse(body);

  if (!parse.success) {
    return {
      message: "Ошибка валидации",
      errors: parse.error.flatten().fieldErrors,
    };
  }

  const { title, projectId } = parse.data;

  try {
    await db.insert(apChat).values({
      title,
      projectId,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при добавлении чата" };
  }
}

export async function editApChat({
  id,
  body,
}: {
  id: number;
  body: z.infer<typeof EditApChatSchema>;
}) {
  const parse = EditApChatSchema.safeParse(body);

  if (!parse.success) {
    return {
      message: "Ошибка валидации",
      errors: parse.error.flatten().fieldErrors,
    };
  }

  const { title } = parse.data;

  try {
    await db
      .update(apChat)
      .set({
        title,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(apChat.id, id));

    return { success: true };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при редактировании чата" };
  }
}

export async function deleteApChat({ id }: { id: number }) {
  try {
    await db
      .update(apChat)
      .set({
        isDeleted: true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(apChat.id, id));

    return { success: true };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при удалении чата" };
  }
}
