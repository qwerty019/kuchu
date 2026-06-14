"use server";

import { z } from "zod";
import { AddFilterSchema, EditFilterSchema } from "./schema";
import { db } from "@/db";
import { and, eq, ne, or } from "drizzle-orm";
import { filter, filterOption } from "@/db/schema";

export async function addFilter(body: z.infer<typeof AddFilterSchema>) {
  const parse = AddFilterSchema.safeParse(body);

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось добавить фильтр.",
    };
  }

  const { title, type } = parse.data;

  try {
    const existingFilter = await db.query.filter.findFirst({
      where: or(eq(filter.title, title), eq(filter.type, type)),
    });

    if (existingFilter && existingFilter.title === title) {
      return {
        errors: {
          title: ["Фильтр с таким названием уже существует."],
        },
        message: "Ошибка при добавлении фильтра.",
      };
    }

    if (existingFilter && existingFilter.type === type) {
      return {
        errors: {
          type: ["Фильтр с таким типом уже существует."],
        },
        message: "Ошибка при добавлении фильтра.",
      };
    }

    await db.insert(filter).values({
      title,
      type,
    });
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при добавлении фильтра." };
  }
}

export async function editFilter(
  id: number,
  body: z.infer<typeof EditFilterSchema>
) {
  const parse = EditFilterSchema.safeParse(body);

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось обновить фильтр.",
    };
  }

  const { title, type } = parse.data;

  try {
    const existingFilter = await db.query.filter.findFirst({
      where: and(
        ne(filter.id, id),
        or(eq(filter.title, title), eq(filter.type, type))
      ),
    });

    if (existingFilter && existingFilter.title === title) {
      return {
        errors: {
          title: ["Фильтр с таким названием уже существует."],
        },
        message: "Ошибка при обновлении фильтра.",
      };
    }

    if (existingFilter && existingFilter.type === type) {
      return {
        errors: {
          type: ["Фильтр с таким типом уже существует."],
        },
        message: "Ошибка при обновлении фильтра.",
      };
    }

    await db.update(filter).set({ title, type }).where(eq(filter.id, id));
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при обновлении фильтра." };
  }
}

export async function deleteFilter(id: number) {
  try {
    const options = await db.query.filterOption.findMany({
      where: eq(filterOption.filterId, id),
      columns: { id: true },
    });

    if (options.length > 0) {
      return { message: "Нельзя удалить фильтр с опциями." };
    }

    await db.delete(filter).where(eq(filter.id, id));
  } catch (err) {
    console.log(err);
    return { message: "Ошибка при удалении фильтра." };
  }
}
