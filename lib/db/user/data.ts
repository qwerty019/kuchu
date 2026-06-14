"use server";

import { db } from "@/db";
import { and, asc, count, eq, ilike } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { discountCard, user as userTable } from "@/db/schema";
import { ExportedUser, UserInAdmin, UserPreferences } from "./schema";

function getConditions(query?: string) {
  const conditions = [eq(userTable.isDeleted, false)];

  if (query) {
    conditions.push(ilike(userTable.phone, `%${query}%`));
  }

  return conditions;
}

export async function fetchUsers({
  page,
  limit,
  query,
}: {
  page: string | number;
  limit: string | number;
  query?: string;
}) {
  noStore();

  try {
    const conditions = getConditions(query);

    const users = await db.query.user.findMany({
      offset: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      where: and(...conditions),
      orderBy: [asc(userTable.id)],
      columns: {
        id: true,
        phone: true,
        name: true,
        surname: true,
        patronymic: true,
        dob: true,
        applied: true,
        roles: true,
        createdAt: true,
      },
      with: {
        discountCards: {
          where: eq(discountCard.isDeleted, false),
          columns: { id: true, accumulation: true },
        },
      },
    });

    return users satisfies UserInAdmin[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить пользователей.");
  }
}

export async function getUsersCount(query?: string) {
  noStore();

  try {
    const conditions = getConditions(query);

    const result = await db
      .select({ count: count() })
      .from(userTable)
      .where(and(...conditions));

    return result[0].count satisfies number;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить пользователей.");
  }
}

export async function getUserPreferences(id: string | number) {
  noStore();

  try {
    const user = await db.query.user.findFirst({
      where: and(eq(userTable.id, Number(id)), eq(userTable.isDeleted, false)),
      columns: { share: true, promo: true },
    });

    if (!user) return null;

    return user satisfies UserPreferences;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить данные пользователя.");
  }
}

export async function exportUsers() {
  noStore();

  try {
    const users = await db.query.user.findMany({
      where: eq(userTable.isDeleted, false),
      orderBy: [asc(userTable.id)],
      columns: {
        id: true,
        phone: true,
        surname: true,
        name: true,
        patronymic: true,
        dob: true,
        applied: true,
      },
    });

    return users satisfies ExportedUser[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить пользователей.");
  }
}
