"use server";

import { db } from "@/db";
import { orderPromo, promo } from "@/db/schema";
import { revalidatePath } from "next/cache";
import { AddPromoSchema } from "./schema";
import { z } from "zod";
import { and, eq } from "drizzle-orm";

export async function addPromo(body: z.infer<typeof AddPromoSchema>) {
  const parse = AddPromoSchema.safeParse(body);

  if (!parse.success) {
    return { message: "Некорректные данные." };
  }

  try {
    const { code, percent, amount, forFirstOrder, completed } = parse.data;

    await db.insert(promo).values({
      code,
      percent,
      amount,
      forFirstOrder,
      completed,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }

  revalidatePath("/admin/promos");
}

export async function editPromo(
  id: number,
  body: z.infer<typeof AddPromoSchema>
) {
  const parse = AddPromoSchema.safeParse(body);

  if (!parse.success) {
    return { message: "Некорректные данные." };
  }

  try {
    const { code, percent, amount, forFirstOrder, completed } = parse.data;

    await db
      .update(promo)
      .set({
        code,
        percent,
        amount,
        forFirstOrder,
        completed,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(promo.id, id));
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }

  revalidatePath("/admin/promos");
}

export async function deletePromo(id: number) {
  try {
    const orderPromos = await db.query.orderPromo.findMany({
      where: and(eq(orderPromo.isDeleted, false), eq(orderPromo.promoId, id)),
      columns: { id: true },
      with: {
        order: {
          columns: {
            id: true,
            isDeleted: true,
          },
        },
      },
    });

    const filtered = orderPromos.filter((op) => op.order.isDeleted === false);

    if (filtered.length > 0) {
      return {
        message: "Нельзя удалить промокод, который используется в заказах",
      };
    }

    await db
      .update(promo)
      .set({ isDeleted: true, updatedAt: new Date().toISOString() })
      .where(eq(promo.id, id));
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }

  revalidatePath("/admin/promos");
}
