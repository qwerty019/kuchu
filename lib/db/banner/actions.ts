"use server";

import { z } from "zod";
import { AddBannerSchema } from "./schema";
import { db } from "@/db";
import { banner, bannerBranch } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function addBanner({
  body,
}: {
  body: z.infer<typeof AddBannerSchema>;
}) {
  const parse = AddBannerSchema.safeParse(body);

  if (!parse.success) {
    return {
      message: "Ошибка валидации",
      errors: parse.error.flatten().fieldErrors,
    };
  }

  const { title, img, subtitle, position, show, bannerbranches } = parse.data;

  try {
    await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(banner)
        .values({
          title,
          img,
          subtitle,
          position,
          show,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        .returning();

      await tx.insert(bannerBranch).values(
        bannerbranches.map((branchId) => ({
          bannerId: created.id,
          branchId,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }))
      );
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при добавлении баннера" };
  }
}

export async function editBanner({
  id,
  body,
}: {
  id: number;
  body: z.infer<typeof AddBannerSchema>;
}) {
  const parse = AddBannerSchema.safeParse(body);

  if (!parse.success) {
    return {
      message: "Ошибка валидации",
      errors: parse.error.flatten().fieldErrors,
    };
  }

  const { title, img, subtitle, position, show, bannerbranches } = parse.data;

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(banner)
        .set({
          title,
          img,
          subtitle,
          position,
          show,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(banner.id, id))
        .returning();

      await tx.delete(bannerBranch).where(eq(bannerBranch.bannerId, id));

      await tx.insert(bannerBranch).values(
        bannerbranches.map((branchId) => ({
          bannerId: id,
          branchId,
          updatedAt: new Date().toISOString(),
        }))
      );
    });

    return { success: true };
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при редактировании баннера" };
  }
}

export async function deleteBanner({ id }: { id: number }) {
  try {
    await db.transaction(async (tx) => {
      await tx
        .update(banner)
        .set({
          isDeleted: true,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(banner.id, id));
      await tx
        .update(bannerBranch)
        .set({
          isDeleted: true,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(bannerBranch.bannerId, id));
    });
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при удалении баннера" };
  }
}
