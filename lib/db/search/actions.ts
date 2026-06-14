"use server";

import { db } from "@/db";
import { validateRequest } from "@/lib/auth";
import { search as searchTable } from "@/db/schema";

export async function search(query: string) {
  if (!query) return;

  const { user } = await validateRequest();

  try {
    await db.insert(searchTable).values({
      query,
      userId: user?.id ? Number(user.id) : null,
      updatedAt: new Date(),
      createdAt: new Date(),
    });
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при сохранении поискового запроса." };
  }
}
