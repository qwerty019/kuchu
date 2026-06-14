"use server";

import { db } from "@/db";
import { searchExclusion } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getExclusions() {
  try {
    const exclusions = await db
      .select()
      .from(searchExclusion)
      .orderBy(asc(searchExclusion.query));

    return exclusions;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при получении исключений.");
  }
}

export async function getExclusion(query: string) {
  try {
    const exclusion = await db
      .select()
      .from(searchExclusion)
      .where(eq(searchExclusion.query, query));

    return exclusion;
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при получении исключения.");
  }
}
