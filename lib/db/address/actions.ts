"use server";

import { z } from "zod";
import { AddAddressSchema } from "./schema";
import { validateRequest } from "@/lib/auth";
import { db } from "@/db";
import { address, user as userTable } from "@/db/schema";
import { and, eq, not } from "drizzle-orm";

export async function addAddress(body: z.infer<typeof AddAddressSchema>) {
  const { user } = await validateRequest();

  if (!user) return { message: "Вы не авторизованы." };

  const validatedFields = AddAddressSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось добавить адрес.",
    };
  }

  const { search, ...rest } = validatedFields.data;

  try {
    const created = await db
      .insert(address)
      .values({
        userId: Number(user.id),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...rest,
      })
      .returning();

    return { id: created[0].id };
  } catch (err) {
    console.log(err);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function editAddress(
  id: number,
  body: z.infer<typeof AddAddressSchema>
) {
  const { user } = await validateRequest();

  if (!user) return { message: "Вы не авторизованы." };

  const validatedFields = AddAddressSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось добавить адрес.",
    };
  }

  const { search, ...rest } = validatedFields.data;

  try {
    await db
      .update(address)
      .set({
        userId: Number(user.id),
        ...rest,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(address.id, id));
  } catch (err) {
    console.log(err);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function deleteAddress(id: number) {
  const { user } = await validateRequest();

  if (!user) return { message: "Вы не авторизованы." };

  try {
    await db
      .update(address)
      .set({
        selected: false,
        isDeleted: true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(address.id, id));
  } catch (err) {
    console.log(err);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function changeAddress(addressId: number) {
  const { user } = await validateRequest();

  if (!user) return { message: "Вы не авторизованы." };

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(userTable)
        .set({ method: "delivery" })
        .where(eq(userTable.id, Number(user.id)));

      // Update all addresses except the selected one to have selected=false
      await tx
        .update(address)
        .set({ selected: false })
        .where(
          and(
            eq(address.userId, Number(user.id)),
            not(eq(address.id, Number(addressId)))
          )
        );

      // Update the selected address to have selected=true
      await tx
        .update(address)
        .set({ selected: true })
        .where(eq(address.id, Number(addressId)));
    });
  } catch (err) {
    console.log(err);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}
