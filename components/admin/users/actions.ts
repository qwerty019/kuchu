"use server";

import { db } from "@/db";
import { discountCard, user as userTable } from "@/db/schema";
import { validateRequest } from "@/lib/auth";
import { getDiscountCards } from "@/lib/farmbazis/data";
import { DiscountCard } from "@/lib/farmbazis/definitions";
import { and, eq, ne } from "drizzle-orm";

export async function getCards(phone: string) {
  if (!phone) {
    return { message: "Телефон не выбран." };
  }

  const dcs = await getDiscountCards(phone);

  if ("message" in dcs) {
    return { message: dcs.message };
  }

  if (!dcs || dcs.length === 0) {
    return { message: "Дисконтные карты не найдены." };
  }

  return dcs;
}

export async function updateCard(card: DiscountCard, id: number) {
  if (!card) {
    return { message: "Карта не выбрана." };
  }

  if (!id) {
    return { message: "Пользователь не найден." };
  }

  try {
    const dc = await db.query.discountCard.findFirst({
      where: and(
        eq(discountCard.isDeleted, false),
        eq(discountCard.userId, id)
      ),
    });

    if (!dc) {
      const [created] = await db
        .insert(discountCard)
        .values({
          userId: id,
          barcode: card.barcode,
          accumulation: card.accumulation,
          discount: card.discount,
          discountJ: card.discountJ,
          rateAccumulation: card.rateAccumulation,
          rateAccumulationJ: card.rateAccumulationJ,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        .returning();

      await db
        .update(discountCard)
        .set({ isDeleted: true, updatedAt: new Date().toISOString() })
        .where(
          and(
            eq(discountCard.isDeleted, false),
            eq(discountCard.userId, id),
            ne(discountCard.id, created.id)
          )
        );

      return created;
    }

    const [updated] = await db
      .update(discountCard)
      .set({
        barcode: card.barcode,
        accumulation: card.accumulation,
        discount: card.discount,
        discountJ: card.discountJ,
        rateAccumulation: card.rateAccumulation,
        rateAccumulationJ: card.rateAccumulationJ,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(discountCard.id, dc.id))
      .returning();

    await db
      .update(discountCard)
      .set({ isDeleted: true, updatedAt: new Date().toISOString() })
      .where(
        and(
          eq(discountCard.isDeleted, false),
          eq(discountCard.userId, id),
          ne(discountCard.id, updated.id)
        )
      );

    return updated;
  } catch (error) {
    return { message: "Не удалось обновить дисконтную карту." };
  }
}
