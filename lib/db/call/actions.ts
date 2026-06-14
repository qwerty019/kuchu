"use server";

import { db } from "@/db";
import { call } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { AddCallSchema, EditCallSchema } from "./schema";

export async function addCall(body: z.infer<typeof AddCallSchema>) {
  const validatedFields = AddCallSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось добавить звонок.",
    };
  }

  try {
    const [created] = await db
      .insert(call)
      .values({
        ...validatedFields.data,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return created;
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function editCall(
  id: number,
  body: z.infer<typeof EditCallSchema>
) {
  const validatedFields = EditCallSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось обновить звонок.",
    };
  }

  try {
    const [updated] = await db
      .update(call)
      .set({ ...validatedFields.data, updatedAt: new Date().toISOString() })
      .where(eq(call.id, id))
      .returning();

    return updated;
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function deleteCall({ id }: { id: number }) {
  try {
    await db
      .update(call)
      .set({ isDeleted: true, updatedAt: new Date().toISOString() })
      .where(eq(call.id, id));
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}
