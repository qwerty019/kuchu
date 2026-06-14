"use server";

import { db } from "@/db";
import { good, ost, userGood } from "@/db/schema";
import { validateRequest } from "@/lib/auth";
import { and, asc, eq } from "drizzle-orm";
import { Good } from "@/lib/db/good/definitions";

export async function addUserGood(goodId: number) {
  const { user } = await validateRequest();

  if (!user) {
    return { message: "Пользователь не найден." };
  }

  try {
    const existing = await db.query.userGood.findFirst({
      where: and(
        eq(userGood.userId, Number(user.id)),
        eq(userGood.goodId, goodId)
      ),
    });

    if (existing) {
      await db.delete(userGood).where(eq(userGood.id, existing.id));

      return null;
    }

    await db.insert(userGood).values({
      userId: Number(user.id),
      goodId,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    const addedGood = await db.query.good.findFirst({
      where: eq(good.id, goodId),
      columns: {
        id: true,
        regId: true,
        drug: true,
        form: true,
        img: true,
        title: true,
        subtitle: true,
      },
      with: {
        osts: {
          where: eq(ost.isDeleted, false),
          orderBy: [asc(ost.priceRoznWNDS)],
          columns: {
            branchId: true,
            uQntOst: true,
            recipe: true,
            priceRoznWNDS: true,
            fixPriceValue: true,
            naklDataId: true,
          },
        },
      },
    });

    if (!addedGood) return null;

    const { osts, ...rest } = addedGood;

    return { ...rest, ost: osts } satisfies Good;
  } catch (error) {
    return { message: "Ошибка добавления товара в избранное." };
  }
}
