"use server";

import { db } from "@/db";
import { good } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function updateDescId(id: number, desc_id: number) {
  try {
    const existing = await db.query.good.findFirst({
      where: eq(good.id, id),
      columns: {
        id: true,
        descId: true,
      },
    });

    if (!existing) {
      return { message: "Товар не найден." };
    }

    if (existing.descId === desc_id) {
      await db.update(good).set({ descId: null }).where(eq(good.id, id));
      return { desc_id: null };
    }

    await db.update(good).set({ descId: desc_id }).where(eq(good.id, id));
    return { desc_id };
  } catch (error) {
    return { message: "Ошибка при обновлении описания." };
  }
}
