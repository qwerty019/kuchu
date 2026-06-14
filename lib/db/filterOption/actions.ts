"use server";

import { z } from "zod";
import { AddFilterOptionSchema, EditFilterOptionSchema } from "./schema";
import { db } from "@/db";
import { and, eq, ne } from "drizzle-orm";
import { filterOption, goodFilter } from "@/db/schema";

export async function addFilterOption(
  body: z.infer<typeof AddFilterOptionSchema>
) {
  const parse = AddFilterOptionSchema.safeParse(body);

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось добавить фильтр.",
    };
  }

  const { value, filterId } = parse.data;

  try {
    const existingFilterOption = await db.query.filterOption.findFirst({
      where: and(
        eq(filterOption.value, value),
        eq(filterOption.filterId, filterId)
      ),
    });

    if (existingFilterOption) {
      return {
        errors: {
          value: ["Опция с таким значением уже существует."],
        },
        message: "Ошибка при добавлении опции.",
      };
    }

    await db.insert(filterOption).values({
      value,
      filterId,
    });
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при добавлении фильтра." };
  }
}

export async function editFilterOption(
  id: number,
  body: z.infer<typeof EditFilterOptionSchema>
) {
  const parse = EditFilterOptionSchema.safeParse(body);

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось обновить опцию.",
    };
  }

  const { value } = parse.data;

  try {
    const option = await db.query.filterOption.findFirst({
      where: eq(filterOption.id, id),
    });

    if (!option) {
      return { message: "Опция не найдена." };
    }

    const existingFilterOption = await db.query.filterOption.findFirst({
      where: and(
        eq(filterOption.value, value),
        eq(filterOption.filterId, option.filterId),
        ne(filterOption.id, id)
      ),
    });

    if (existingFilterOption) {
      return {
        errors: {
          value: ["Опция с таким значением уже существует."],
        },
        message: "Ошибка при обновлении опции.",
      };
    }

    await db.update(filterOption).set({ value }).where(eq(filterOption.id, id));
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при обновлении опции." };
  }
}

export async function deleteFilterOption(id: number) {
  try {
    const filters = await db.query.goodFilter.findMany({
      where: eq(goodFilter.optionId, id),
      limit: 1,
    });

    if (filters.length > 0) {
      return { message: "Нельзя удалить опцию с товарами." };
    }

    await db.delete(filterOption).where(eq(filterOption.id, id));
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при удалении опции." };
  }
}
