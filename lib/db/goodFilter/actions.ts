"use server";

import { z } from "zod";
import { AddGoodFilterSchema, EditGoodFilterSchema } from "./schema";
import { db } from "@/db";
import { goodFilter } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function addGoodFilter(body: z.infer<typeof AddGoodFilterSchema>) {
  const parse = AddGoodFilterSchema.safeParse(body);

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось добавить фильтр к товару.",
    };
  }

  const { goodId, optionId } = parse.data;

  try {
    await db.insert(goodFilter).values({
      goodId,
      optionId,
    });
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при добавлении фильтра к товару." };
  }
}

export async function editGoodFilter(
  id: number,
  body: z.infer<typeof EditGoodFilterSchema>
) {
  const parse = EditGoodFilterSchema.safeParse(body);

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось обновить фильтр в товаре.",
    };
  }

  const { goodId, optionId } = parse.data;

  try {
    await db
      .update(goodFilter)
      .set({ goodId, optionId })
      .where(eq(goodFilter.id, id));
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при обновлении опции." };
  }
}

export async function deleteGoodFilter(id: number) {
  try {
    await db.delete(goodFilter).where(eq(goodFilter.id, id));
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при удалении фильтра из товара." };
  }
}
