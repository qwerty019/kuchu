"use server";

import { AddZoneSchema, EditZoneSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/db";
import { address, deliveryZone } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function addZone(body: z.infer<typeof AddZoneSchema>) {
  const validatedFields = AddZoneSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось добавить зону.",
    };
  }

  try {
    await db.insert(deliveryZone).values({
      ...validatedFields.data,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }

  revalidatePath("/admin/cities");
}

export async function editZone(
  id: number,
  body: z.infer<typeof EditZoneSchema>
) {
  const validatedFields = EditZoneSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось редактировать зону.",
    };
  }

  try {
    await db
      .update(deliveryZone)
      .set({
        ...validatedFields.data,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(deliveryZone.id, id));
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }

  revalidatePath("/admin/cities");
}

export async function deleteZone(id: number) {
  try {
    const addresses = await db.query.address.findMany({
      where: eq(address.zoneId, id),
    });

    if (addresses.length > 0) {
      return { message: "Нельзя удалить зону, у которой есть адреса." };
    }

    await db
      .update(deliveryZone)
      .set({ isDeleted: true, updatedAt: new Date().toISOString() })
      .where(eq(deliveryZone.id, id));
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }

  revalidatePath("/admin/cities");
}
