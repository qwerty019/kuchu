"use server";

import { db } from "@/db";
import { search } from "@/db/schema";
import { count, desc } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { Search } from "./schema";

export async function getSearchs({
  page,
  limit,
}: {
  page: number;
  limit: number;
}) {
  noStore();

  try {
    const searchs = await db.query.search.findMany({
      offset: (page - 1) * limit,
      limit,
      columns: {
        id: true,
        query: true,
        createdAt: true,
      },
      orderBy: [desc(search.createdAt)],
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            surname: true,
            phone: true,
          },
        },
      },
    });

    return searchs satisfies Search[];
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при получении поисковых запросов.");
  }
}

export async function getSearchsCount() {
  noStore();

  try {
    const result = await db.select({ count: count() }).from(search);

    return result[0].count;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при получении количества поисковых запросов.");
  }
}

export async function exportSearchs() {
  noStore();

  try {
    const searchs = await db.query.search.findMany({
      columns: {
        id: true,
        query: true,
        createdAt: true,
      },
      orderBy: [desc(search.createdAt)],
      with: {
        user: {
          columns: {
            id: true,
            name: true,
            surname: true,
            phone: true,
          },
        },
      },
    });

    return searchs satisfies Search[];
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при экспорте поисковых запросов.");
  }
}
