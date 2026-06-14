"use server";

import { z } from "zod";
import {
  AddAiProjectSchema,
  EditAiProjectSchema,
  EditInstructionsSchema,
} from "./schema";
import { db } from "@/db";
import { aiProject } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";

export async function addAiProject({
  body,
}: {
  body: z.infer<typeof AddAiProjectSchema>;
}) {
  const parse = AddAiProjectSchema.safeParse(body);

  if (!parse.success) {
    return {
      message: "Ошибка валидации",
      errors: parse.error.flatten().fieldErrors,
    };
  }

  const { title, description, instructions } = parse.data;

  try {
    await db.insert(aiProject).values({
      title,
      description,
      instructions,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при добавлении проекта" };
  }
}

export async function editAiProject({
  id,
  body,
}: {
  id: number;
  body: z.infer<typeof EditAiProjectSchema>;
}) {
  const parse = EditAiProjectSchema.safeParse(body);

  if (!parse.success) {
    return {
      message: "Ошибка валидации",
      errors: parse.error.flatten().fieldErrors,
    };
  }

  const { title, description, selected } = parse.data;

  try {
    if (selected) {
      const existing = await db.query.aiProject.findFirst({
        where: and(eq(aiProject.selected, true), ne(aiProject.id, id)),
        columns: { id: true },
      });

      if (existing) {
        return {
          message: "Невозможно выбрать несколько проектов.",
          errors: {
            selected: ["Невозможно выбрать несколько проектов."],
          },
        };
      }
    }

    await db
      .update(aiProject)
      .set({
        title,
        description,
        selected,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(aiProject.id, id));

    return { success: true };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при редактировании проекта" };
  }
}

export async function deleteAiProject({ id }: { id: number }) {
  try {
    await db
      .update(aiProject)
      .set({
        isDeleted: true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(aiProject.id, id));

    return { success: true };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при удалении проекта" };
  }
}

export async function editInstructions({
  id,
  body,
}: {
  id: number;
  body: z.infer<typeof EditInstructionsSchema>;
}) {
  const parse = EditInstructionsSchema.safeParse(body);

  if (!parse.success) {
    return {
      message: "Ошибка валидации",
      errors: parse.error.flatten().fieldErrors,
    };
  }

  const { instructions } = parse.data;

  try {
    await db
      .update(aiProject)
      .set({ instructions, updatedAt: new Date().toISOString() })
      .where(eq(aiProject.id, id));

    return { success: true };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при редактировании проекта" };
  }
}
