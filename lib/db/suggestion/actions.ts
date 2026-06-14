"use server";

import { z } from "zod";
import { AddSuggestionSchema, EditSuggestionSchema } from "./schema";
import { db } from "@/db";
import { and, eq, ne } from "drizzle-orm";
import { suggestion } from "@/db/schema";

export async function addSuggestion(body: z.infer<typeof AddSuggestionSchema>) {
  const parse = AddSuggestionSchema.safeParse(body);

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось добавить предложение.",
    };
  }

  const { title } = parse.data;

  try {
    const existing = await db.query.suggestion.findFirst({
      where: eq(suggestion.title, title),
    });

    if (existing) {
      return {
        errors: {
          title: ["Предложение с таким названием уже существует."],
        },
        message: "Ошибка при добавлении предложения.",
      };
    }

    await db.insert(suggestion).values({
      title,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при добавлении предложения." };
  }
}

export async function editSuggestion(
  id: number,
  body: z.infer<typeof EditSuggestionSchema>
) {
  const parse = EditSuggestionSchema.safeParse(body);

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось обновить предложение.",
    };
  }

  const { title } = parse.data;

  try {
    const existing = await db.query.suggestion.findFirst({
      where: and(eq(suggestion.title, title), ne(suggestion.id, id)),
    });

    if (existing) {
      return {
        errors: {
          title: ["Предложение с таким названием уже существует."],
        },
        message: "Ошибка при обновлении предложения.",
      };
    }

    await db
      .update(suggestion)
      .set({
        title,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(suggestion.id, id));
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при обновлении предложения." };
  }
}

export async function deleteSuggestion(id: number) {
  try {
    await db.delete(suggestion).where(eq(suggestion.id, id));
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при удалении предложения." };
  }
}
