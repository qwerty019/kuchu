"use server";

import { db } from "@/db";
import { order, orderPromo, promo } from "@/db/schema";
import { validateRequest } from "@/lib/auth";
import { and, asc, countDistinct, eq, ilike } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { Promo, PromoInEdit } from "./schema";

export async function fetchPromos() {
  noStore();

  try {
    const promos = await db.query.promo.findMany({
      where: eq(promo.isDeleted, false),
      orderBy: [asc(promo.id)],
      columns: {
        id: true,
        code: true,
      },
      with: {
        orderPromos: {
          where: and(eq(orderPromo.isDeleted, false)),
          columns: { id: true },
          with: {
            order: {
              columns: {
                id: true,
                isDeleted: true,
              },
            },
          },
        },
      },
    });

    const transformed = promos.map((promo) => ({
      ...promo,
      orderpromos: promo.orderPromos.filter((x) => x.order.isDeleted === false),
    }));

    return transformed satisfies Promo[];
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Ошибка при получении промокодов.");
  }
}

export async function getPromoInEdit({ id }: { id: number }) {
  noStore();

  try {
    const promoResult = await db.query.promo.findFirst({
      where: and(eq(promo.isDeleted, false), eq(promo.id, id)),
      columns: {
        id: true,
        code: true,
        amount: true,
        percent: true,
        forFirstOrder: true,
        completed: true,
      },
    });

    if (!promoResult) {
      throw new Error("Промокод не найден.");
    }

    return promoResult satisfies PromoInEdit;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Ошибка при получении промокода.");
  }
}

export async function checkPromoCode(code: string) {
  if (!code) {
    return { message: "Введите промокод." };
  }

  const { user } = await validateRequest();

  if (!user) {
    return { message: "Вы должны быть авторизованы." };
  }

  try {
    const found = await db.query.promo.findFirst({
      where: and(
        eq(promo.isDeleted, false),
        eq(promo.completed, false),
        ilike(promo.code, code)
      ),
      columns: {
        id: true,
        code: true,
        amount: true,
        percent: true,
        forFirstOrder: true,
      },
    });

    if (!found) {
      return { message: "Промокод не найден." };
    }

    const orderPromos = await db.query.orderPromo.findMany({
      where: and(
        eq(orderPromo.isDeleted, false),
        eq(orderPromo.promoId, Number(found.id))
      ),
      columns: { id: true },
      with: {
        order: {
          columns: {
            isDeleted: true,
            userId: true,
            status: true,
          },
        },
      },
    });

    const usedByUser = orderPromos.find(
      (op) => !op.order.isDeleted && op.order.userId === Number(user.id)
    );

    if (usedByUser) {
      return { message: "Промокод уже использован." };
    }

    if (found.forFirstOrder) {
      const result = await db
        .select({ count: countDistinct(order.id) })
        .from(order)
        .where(
          and(eq(order.isDeleted, false), eq(order.userId, Number(user.id)))
        );

      if (result[0].count > 0) {
        return { message: "Промокод доступен только для первого заказа." };
      }
    }

    return found;
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}
