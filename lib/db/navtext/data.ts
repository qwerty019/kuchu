"use server";

import { db } from "@/db";
import { navText } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { NavText } from "./schema";

export async function fetchText() {
  noStore();

  try {
    const texts = await db.query.navText.findMany({
      where: and(eq(navText.isDeleted, false), eq(navText.show, true)),
      columns: { id: true, text: true },
    });

    if (!texts.length) return [];

    return texts;
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при загрузке текстов.");
  }
}

export async function fetchTexts() {
  noStore();

  try {
    const texts = await db.query.navText.findMany({
      where: eq(navText.isDeleted, false),
      columns: { id: true, text: true, show: true },
    });

    return texts satisfies NavText[];
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при загрузке текстов.");
  }
}
