"use server";

import { db } from "@/db";
import { collGood, good } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { AddCategorySchema, AddGoodsSchema } from "./schema";
import { z } from "zod";

export async function deleteCollGood(id: number) {
  try {
    await db.delete(collGood).where(eq(collGood.id, id));
  } catch (error) {
    console.log(error);
    return { message: "Не удалось удалить товар из подборки." };
  }
}

export async function reorderCollGoods({
  collGoods,
}: {
  collGoods: { id: number; position: number }[];
}) {
  if (collGoods.length === 0) {
    return { message: "Не хватает данных" };
  }

  try {
    await db.transaction(async (tx) => {
      for (const cg of collGoods) {
        await tx
          .update(collGood)
          .set({ position: cg.position, updatedAt: new Date().toISOString() })
          .where(eq(collGood.id, cg.id));
      }
    });
  } catch (error) {
    console.log(error);
    return { message: "Не удалось переупорядочить товары." };
  }
}

export async function addCategoryToCollection(
  body: z.infer<typeof AddCategorySchema>
) {
  const parse = AddCategorySchema.safeParse(body);

  if (!parse.success) {
    return { message: "Некорректные данные." };
  }

  const { categoryId, collectionId } = parse.data;

  try {
    const goods = await db.query.good.findMany({
      where: and(eq(good.categoryId, categoryId), eq(good.isDeleted, false)),
      columns: { id: true },
    });

    if (goods.length === 0) {
      return { message: "Нет товаров в этой категории." };
    }

    const existingGoods = await db.query.collGood.findMany({
      where: and(
        eq(collGood.collectionId, collectionId),
        inArray(
          collGood.goodId,
          goods.map((good) => good.id)
        )
      ),
      columns: { goodId: true },
    });

    const notAdded = goods.filter(
      (good) => !existingGoods.some((g) => g.goodId === good.id)
    );

    if (notAdded.length === 0) {
      return { message: "Все товары уже добавлены." };
    }

    await db.insert(collGood).values(
      notAdded.map((good) => ({
        goodId: good.id,
        collectionId,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }))
    );
  } catch (error) {
    console.log(error);
    return { message: "Не удалось добавить товары категории." };
  }
}

export async function addGoodsToCollection(
  body: z.infer<typeof AddGoodsSchema>
) {
  const parse = AddGoodsSchema.safeParse(body);

  if (!parse.success) {
    return { message: "Некорректные данные." };
  }

  const { goods, collectionId } = parse.data;

  try {
    const existingGoods = await db.query.collGood.findMany({
      where: and(
        eq(collGood.collectionId, collectionId),
        inArray(collGood.goodId, goods)
      ),
      columns: { goodId: true },
    });

    const notAdded = goods.filter(
      (goodId) => !existingGoods.some((g) => g.goodId === goodId)
    );

    if (notAdded.length === 0) {
      return { message: "Все товары уже добавлены." };
    }

    await db.insert(collGood).values(
      notAdded.map((goodId) => ({
        goodId,
        collectionId,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      }))
    );
  } catch (error) {
    console.log(error);
    return { message: "Не удалось добавить товары." };
  }
}
