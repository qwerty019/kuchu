"use server";

import { z } from "zod";
import { AddContentSchema, EditContentSchema } from "./schema";
import sanitizeHtml from "sanitize-html";
import { db } from "@/db";
import { content as contentTable, good } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function addContent(body: z.infer<typeof AddContentSchema>) {
  const validatedFields = AddContentSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось добавить описание.",
    };
  }

  const { content } = validatedFields.data;

  const sanitizedText = sanitizeHtml(content, {
    allowedTags: [],
    allowedAttributes: {},
  }).replaceAll(/<br\s*\/?>/g, " ");

  try {
    const [inserted] = await db
      .insert(contentTable)
      .values({
        ...validatedFields.data,
        text: sanitizedText,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    const goodObject = await db.query.good.findFirst({
      where: eq(good.id, inserted.goodId),
      columns: { id: true, fullName: true },
      with: {
        contents: {
          where: eq(contentTable.isDeleted, false),
          columns: { text: true },
        },
      },
    });

    if (!goodObject) {
      return { message: "Товар не найден." };
    }

    const contentText = [
      goodObject.fullName,
      ...goodObject.contents.map((t) => t.text),
    ].join("\n");

    await db
      .update(good)
      .set({ contentText, updatedAt: new Date().toISOString() })
      .where(eq(good.id, goodObject.id));
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при добавлении описания." };
  }
}

export async function editContent(
  id: number,
  body: z.infer<typeof EditContentSchema>
) {
  const validatedFields = EditContentSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось обновить описание.",
    };
  }

  const { content } = validatedFields.data;

  const sanitizedText = sanitizeHtml(content, {
    allowedTags: [],
    allowedAttributes: {},
  }).replaceAll(/<br\s*\/?>/g, " ");

  try {
    const [updated] = await db
      .update(contentTable)
      .set({
        ...validatedFields.data,
        text: sanitizedText,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(contentTable.id, id))
      .returning();

    const goodObject = await db.query.good.findFirst({
      where: eq(good.id, updated.goodId),
      columns: { id: true, fullName: true },
      with: {
        contents: {
          where: eq(contentTable.isDeleted, false),
          columns: { text: true },
        },
      },
    });

    if (!goodObject) {
      return { message: "Товар не найден." };
    }

    const contentText = [
      goodObject.fullName,
      ...goodObject.contents.map((t) => t.text),
    ].join("\n");

    await db
      .update(good)
      .set({ contentText, updatedAt: new Date().toISOString() })
      .where(eq(good.id, goodObject.id));
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при обновлении описания." };
  }
}

export async function deleteContent(id: number) {
  try {
    await db.delete(contentTable).where(eq(contentTable.id, id));
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при удалении описания." };
  }
}
