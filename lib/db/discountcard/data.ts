"use server";

import { db } from "@/db";
import { discountCard } from "@/db/schema";
import { validateRequest } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";

export async function getDiscountCard(userId: string | number) {
  noStore();

  try {
    const dc = await db.query.discountCard.findFirst({
      where: and(
        eq(discountCard.isDeleted, false),
        eq(discountCard.userId, Number(userId))
      ),
      columns: {
        id: true,
        accumulation: true,
        barcode: true,
        discount: true,
        rateAccumulation: true,
      },
    });

    if (!dc) return null;

    return dc;
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении данных карты скидок");
  }
}

export async function getCard() {
  noStore();

  const { user } = await validateRequest();

  if (!user) {
    return { message: "Войдите в ваш аккаунт и сделайте заказ." };
  }

  try {
    const dc = await db.query.discountCard.findFirst({
      where: and(
        eq(discountCard.isDeleted, false),
        eq(discountCard.userId, Number(user.id))
      ),
      columns: {
        id: true,
        accumulation: true,
        barcode: true,
        discount: true,
        rateAccumulation: true,
      },
    });

    if (!dc) {
      return { message: "Бонусная карта не найдена." };
    }

    return dc;
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}
