"use server";

import { db } from "@/db";
import { discountCard } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export async function updateCard(id: number, amount: number, type?: number) {
  if (!id) {
    return { message: "Карта не найдена." };
  }

  try {
    if (type === 1) {
      await db
        .update(discountCard)
        .set({
          accumulation: sql`${discountCard.accumulation} + ${amount}`,
        })
        .where(eq(discountCard.id, id));

      return { success: true };
    }

    await db
      .update(discountCard)
      .set({
        accumulation: sql`${discountCard.accumulation} - ${amount}`,
      })
      .where(eq(discountCard.id, id));

    return { success: true };
  } catch (error) {
    return { message: "Не удалось обновить дисконтную карту." };
  }
}
