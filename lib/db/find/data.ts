"use server";

import { db } from "@/db";
import { good } from "@/db/schema";
import { asc, eq, sql } from "drizzle-orm";

export async function getCount() {
  try {
    const result = await db
      .select({ count: sql`count(*)` })
      .from(good)
      .where(eq(good.imported, false));

    return Number(result[0].count);
  } catch (error) {
    throw new Error("Ошибка при загрузке количества товаров.");
  }
}

export async function getGoods({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  try {
    const result = await db
      .select({
        id: good.id,
        drug: good.drug,
        form: good.form,
        mnn: good.mnn,
        fabr: good.fabr,
        desc_id: good.descId,
      })
      .from(good)
      .where(eq(good.imported, false))
      .orderBy(asc(good.drug))
      .limit(limit)
      .offset((page - 1) * limit);

    return result;
  } catch (error) {
    throw new Error("Ошибка при загрузке товаров.");
  }
}
