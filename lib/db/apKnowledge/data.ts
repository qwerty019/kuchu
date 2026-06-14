"use server";

import { db } from "@/db";
import { apKnowledge } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { ApKnowledge } from "./schema";

export async function getApKnowledges({ projectId }: { projectId: number }) {
  noStore();

  try {
    const apKnowledges = await db.query.apKnowledge.findMany({
      where: and(
        eq(apKnowledge.isDeleted, false),
        eq(apKnowledge.projectId, projectId)
      ),
      orderBy: asc(apKnowledge.id),
      columns: {
        id: true,
        title: true,
        content: true,
      },
    });

    return apKnowledges satisfies ApKnowledge[];
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении знаний");
  }
}
