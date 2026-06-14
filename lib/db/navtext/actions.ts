"use server";

import { db } from "@/db";
import { navText } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AddNavTextSchema } from "./schema";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function addText(body: z.infer<typeof AddNavTextSchema>) {
  const parse = AddNavTextSchema.safeParse(body);

  if (!parse.success) {
    return {
      message: "Ошибка валидации",
      errors: parse.error.flatten().fieldErrors,
    };
  }

  const { text, show } = parse.data;

  try {
    await db.insert(navText).values({
      text,
      show,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при добавлении текста" };
  }

  revalidatePath("/admin/navtext");
}

export async function editText(
  id: number,
  body: z.infer<typeof AddNavTextSchema>
) {
  const parse = AddNavTextSchema.safeParse(body);

  if (!parse.success) {
    return {
      message: "Ошибка валидации",
      errors: parse.error.flatten().fieldErrors,
    };
  }

  const { text, show } = parse.data;

  try {
    await db
      .update(navText)
      .set({ text, show, updatedAt: new Date().toISOString() })
      .where(eq(navText.id, id));
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при редактировании текста" };
  }

  revalidatePath("/admin/navtext");
}

export async function deleteText(id: number) {
  try {
    await db
      .update(navText)
      .set({ isDeleted: true, updatedAt: new Date().toISOString() })
      .where(eq(navText.id, id));
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }

  revalidatePath("/admin/navtext");
}
