"use server";

import { db } from "@/db";
import { aiProject } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { unstable_noStore as noStore } from "next/cache";
import { AiProject } from "./schema";

export async function getAiProjects() {
  noStore();

  try {
    const aiProjects = await db.query.aiProject.findMany({
      where: eq(aiProject.isDeleted, false),
      orderBy: asc(aiProject.id),
      columns: {
        id: true,
        title: true,
        instructions: true,
        description: true,
        selected: true,
      },
    });

    return aiProjects satisfies AiProject[];
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении проектов");
  }
}

export async function getAiProject({ id }: { id: number }) {
  noStore();

  try {
    const project = await db.query.aiProject.findFirst({
      where: eq(aiProject.id, id),
      columns: {
        id: true,
        title: true,
        instructions: true,
        description: true,
        selected: true,
      },
    });

    if (!project) return null;

    return project satisfies AiProject;
  } catch (error) {
    console.log(error);
    throw new Error("Ошибка при получении проекта");
  }
}
