"use server";

import { unstable_noStore as noStore } from "next/cache";
import { User } from "@/lib/auth";
import { Good } from "../good/definitions";
import { db } from "@/db";
import { ost, userGood } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getUserGoods({ user }: { user: User | null }) {
  noStore();

  try {
    if (!user) return [];

    const userGoods = await db.query.userGood.findMany({
      where: eq(userGood.userId, Number(user.id)),
      with: {
        good: {
          columns: {
            id: true,
            regId: true,
            drug: true,
            form: true,
            img: true,
            title: true,
            subtitle: true,
            isHidden: true,
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
        },
      },
    });

    const transformed = userGoods
      .filter((item) => !item.good.isHidden)
      .map((item) => {
        const { osts, isHidden, ...rest } = item.good;
        return { ...rest, ost: osts };
      });

    return transformed satisfies Good[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить избранное.");
  }
}
