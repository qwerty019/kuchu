"use server";

import { db } from "@/db";
import { searchExclusion } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AddSearchExclusionSchema, EditSearchExclusionSchema } from "./schema";
import { z } from "zod";

export async function addExclusion(
  data: z.infer<typeof AddSearchExclusionSchema>
) {
  const validatedFields = AddSearchExclusionSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      message: "Некорректные данные.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { query, list } = validatedFields.data;

  try {
    await db.insert(searchExclusion).values({ query, list });
  } catch (error) {
    console.error(error);
    return { message: "Ошибка при добавлении исключения." };
  }
}

export async function editExclusion(
  id: number,
  data: z.infer<typeof EditSearchExclusionSchema>
) {
  const validatedFields = EditSearchExclusionSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      message: "Некорректные данные.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { query, list } = validatedFields.data;

  try {
    await db
      .update(searchExclusion)
      .set({ query, list })
      .where(eq(searchExclusion.id, id));
  } catch (error) {
    console.error(error);
    return { message: "Ошибка при редактировании исключения." };
  }
}

export async function deleteExclusion(id: number) {
  try {
    await db.delete(searchExclusion).where(eq(searchExclusion.id, id));
  } catch (error) {
    console.error(error);
    return { message: "Ошибка при удалении исключения." };
  }
}
