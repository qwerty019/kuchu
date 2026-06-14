"use server";

import { z } from "zod";
import { AddCitySchema, EditCitySchema } from "./schema";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { branch, city, deliveryZone } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function editCity(
  id: number,
  body: z.infer<typeof EditCitySchema>
) {
  const validatedFields = EditCitySchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось редактировать город.",
    };
  }

  const { title, route } = validatedFields.data;

  try {
    if (route) {
      const old = await db.query.city.findFirst({
        where: and(eq(city.route, route), eq(city.isDeleted, false)),
      });

      if (old?.id !== id) {
        return {
          errors: { route: ["Такая ссылка уже существует."] },
          message: "Не удалось редактировать город.",
        };
      }
    }

    await db
      .update(city)
      .set({ title, route, updatedAt: new Date().toISOString() })
      .where(eq(city.id, id));
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }

  revalidatePath("/admin/cities");
}

export async function createCity(body: z.infer<typeof AddCitySchema>) {
  const validatedFields = AddCitySchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось создать город.",
    };
  }

  const { title, route } = validatedFields.data;

  try {
    const old = await db.query.city.findFirst({
      where: and(eq(city.route, route), eq(city.isDeleted, false)),
    });

    if (old) {
      return {
        errors: { route: ["Такая ссылка уже существует."] },
        message: "Не удалось создать город.",
      };
    }

    await db.insert(city).values({
      title,
      route,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }

  revalidatePath("/admin/cities");
}

export async function deleteCity(id: number) {
  try {
    const existingBranch = await db.query.branch.findFirst({
      where: and(eq(branch.isDeleted, false), eq(branch.cityId, id)),
    });

    if (existingBranch) {
      return {
        message: "Нельзя удалить город, у которой есть филиалы.",
      };
    }

    const existingZone = await db.query.deliveryZone.findFirst({
      where: and(
        eq(deliveryZone.isDeleted, false),
        eq(deliveryZone.cityId, id)
      ),
    });

    if (existingZone) {
      return {
        message: "Нельзя удалить город, у которого есть зоны.",
      };
    }

    await db
      .update(city)
      .set({ isDeleted: true, updatedAt: new Date().toISOString() })
      .where(eq(city.id, id));
  } catch (error) {
    console.log(error);
    return { message: "Произошла ошибка при удалении город." };
  }

  revalidatePath("/admin/cities");
}
