"use server";

import { db } from "@/db";
import { suggestion } from "@/db/schema";
import { and, asc, eq, ilike } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";

export async function getSuggestions() {
  noStore();

  try {
    const suggestions = await db.query.suggestion.findMany({
      orderBy: [asc(suggestion.title)],
      columns: { id: true, title: true },
    });

    return suggestions;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при получении предложений.");
  }
}

export async function getSuggestionsByQuery(query: string) {
  noStore();

  if (!query) return [];

  try {
    const suggestions = await db.query.suggestion.findMany({
      where: and(
        eq(suggestion.isDeleted, false),
        ilike(suggestion.title, `%${query}%`)
      ),
      orderBy: [asc(suggestion.title)],
      limit: 5,
      columns: { title: true },
    });

    return suggestions;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при получении предложений.");
  }
}
