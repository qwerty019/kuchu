"use server";

import { AddCollectionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { collection, collGood } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

export async function addCollection(body: z.infer<typeof AddCollectionSchema>) {
  const validatedFields = AddCollectionSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, position, show } = validatedFields.data;

  try {
    await db.insert(collection).values({
      title,
      position,
      show,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
    return { message: "Не удалось добавить подборку." };
  }

  revalidatePath(`/admin/collection`);
}

export async function editCollection(
  id: number,
  body: z.infer<typeof AddCollectionSchema>
) {
  const validatedFields = AddCollectionSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, position, show } = validatedFields.data;

  try {
    await db
      .update(collection)
      .set({
        title,
        position,
        show,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(collection.id, id));
  } catch (error) {
    console.log(error);
    return { message: "Не удалось редактировать подборку." };
  }

  revalidatePath(`/admin/collection`);
}

export async function deleteCollection(id: number) {
  if (!id) {
    return { message: "Не хватает данных." };
  }

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(collection)
        .set({ isDeleted: true })
        .where(eq(collection.id, id));
      await tx.delete(collGood).where(eq(collGood.collectionId, id));
    });
  } catch (error) {
    console.log(error);
    return { message: "Не удалось удалить подборку." };
  }
}
