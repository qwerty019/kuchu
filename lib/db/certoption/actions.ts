"use server";

import { db } from "@/db";
import { certOption } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AddCertOptionSchema } from "./schema";
import { z } from "zod";

export async function addCertOption(body: z.infer<typeof AddCertOptionSchema>) {
  const parse = AddCertOptionSchema.safeParse(body);

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось добавить сертификат.",
    };
  }

  const { nominal, show } = parse.data;

  try {
    await db.insert(certOption).values({
      nominal: nominal,
      show: show,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    return { message: "Что-то пошло не так." };
  }
}

export async function editCertOption(
  id: number,
  body: z.infer<typeof AddCertOptionSchema>
) {
  const parse = AddCertOptionSchema.safeParse(body);

  if (!parse.success) {
    return {
      errors: parse.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось обновить сертификат.",
    };
  }

  const { nominal, show } = parse.data;

  try {
    await db
      .update(certOption)
      .set({
        nominal: nominal,
        show: show,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(certOption.id, id));
  } catch (error) {
    return { message: "Что-то пошло не так." };
  }
}

export async function deleteCertOption(id: number) {
  try {
    await db.delete(certOption).where(eq(certOption.id, id));
  } catch (error) {
    return { message: "Что-то пошло не так." };
  }
}
