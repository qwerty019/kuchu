"use server";

import { AddStorySchema } from "./schema";
import { z } from "zod";
import { slide, story, storyBranch } from "@/db/schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";

export async function addStory(body: z.infer<typeof AddStorySchema>) {
  const parse = AddStorySchema.safeParse(body);

  if (!parse.success) {
    return { message: "Некорректные данные." };
  }

  const { title, img, storybranches, slides, position } = parse.data;

  try {
    await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(story)
        .values({
          title,
          img,
          position,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        .returning();

      await tx.insert(storyBranch).values(
        storybranches.map((branchId) => ({
          branchId,
          storyId: created.id,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }))
      );

      await tx.insert(slide).values(
        slides.map((x) => ({
          ...x,
          storyId: created.id,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }))
      );
    });
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function editStory(
  id: number,
  body: z.infer<typeof AddStorySchema>
) {
  const parse = AddStorySchema.safeParse(body);

  if (!parse.success) {
    return { message: "Некорректные данные." };
  }

  const { title, img, show, storybranches, slides, position } = parse.data;

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(story)
        .set({
          title,
          img,
          show,
          position,
        })
        .where(eq(story.id, id));

      await tx.delete(storyBranch).where(eq(storyBranch.storyId, id));
      await tx.delete(slide).where(eq(slide.storyId, id));

      await tx.insert(storyBranch).values(
        storybranches.map((branchId) => ({
          branchId,
          storyId: id,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }))
      );

      await tx.insert(slide).values(
        slides.map((x) => ({
          ...x,
          storyId: id,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }))
      );
    });
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function deleteStory(id: number) {
  try {
    await db.transaction(async (tx) => {
      await tx.update(story).set({ isDeleted: true }).where(eq(story.id, id));
      await tx
        .update(slide)
        .set({ isDeleted: true })
        .where(eq(slide.storyId, id));
      await tx
        .update(storyBranch)
        .set({ isDeleted: true })
        .where(eq(storyBranch.storyId, id));
    });
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}
