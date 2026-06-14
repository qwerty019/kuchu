"use server";

import { z } from "zod";
import { AddBranchSchema, EditBranchSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { validateRequest } from "@/lib/auth";
import { db } from "@/db";
import { and, eq, not } from "drizzle-orm";
import { branch, user as userTable } from "@/db/schema";

export async function addBranch(body: z.infer<typeof AddBranchSchema>) {
  const validatedFields = AddBranchSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось создать филиал.",
    };
  }

  const { title, cityId, address, fbId, main } = validatedFields.data;

  try {
    if (main) {
      const existing = await db.query.branch.findFirst({
        where: and(
          eq(branch.isDeleted, false),
          eq(branch.cityId, cityId),
          eq(branch.main, main)
        ),
      });

      if (existing) {
        return {
          errors: {
            main: ["Главный филиал уже существует в этом городе."],
          },
          message: "Не удалось создать филиал.",
        };
      }
    }

    if (fbId) {
      const existing = await db.query.branch.findFirst({
        where: and(eq(branch.isDeleted, false), eq(branch.fbId, fbId)),
      });

      if (existing) {
        return {
          errors: {
            fbId: ["Филиал с таким ID Фармбазиса уже существует."],
          },
          message: "Не удалось создать филиал.",
        };
      }
    }

    await db.insert(branch).values({
      title,
      cityId,
      address,
      fbId,
      main,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }

  revalidatePath("/admin/cities");
}

export async function editBranch(
  id: number,
  body: z.infer<typeof EditBranchSchema>
) {
  const validatedFields = EditBranchSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось создать филиал.",
    };
  }

  const { title, address, fbId, main, lat, long } = validatedFields.data;

  try {
    if (main) {
      const existing = await db.query.branch.findFirst({
        where: and(
          eq(branch.isDeleted, false),
          not(eq(branch.id, id)),
          eq(branch.main, true)
        ),
      });

      if (existing) {
        return {
          errors: {
            main: ["Главный филиал уже существует в этом городе."],
          },
          message: "Не удалось создать филиал.",
        };
      }
    }

    if (fbId) {
      const existing = await db.query.branch.findFirst({
        where: and(
          eq(branch.isDeleted, false),
          not(eq(branch.id, id)),
          eq(branch.fbId, fbId)
        ),
      });

      if (existing) {
        return {
          errors: {
            fbId: ["Филиал с таким ID Фармбазиса уже существует."],
          },
          message: "Не удалось создать филиал.",
        };
      }
    }

    await db
      .update(branch)
      .set({ title, address, fbId, main, lat, long })
      .where(eq(branch.id, id));
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }

  revalidatePath("/admin/cities");
}

export async function deleteBranch(id: number) {
  try {
    const existing = await db.query.branch.findFirst({
      where: eq(branch.id, id),
      columns: { main: true },
    });

    if (!existing) {
      return { message: "Филиал не найден." };
    }

    if (existing.main) {
      return { message: "Нельзя удалить главный филиал." };
    }

    await db.update(branch).set({ isDeleted: true }).where(eq(branch.id, id));
  } catch (error) {
    console.log(error);
    return { message: "Произошла ошибка при удалении филиала." };
  }

  revalidatePath("/admin/cities");
}

export async function changeBranch(branchId: number) {
  const { user } = await validateRequest();

  if (!user) return { message: "Вы не авторизованы." };

  try {
    await db
      .update(userTable)
      .set({ branchId, method: "pickup" })
      .where(eq(userTable.id, Number(user.id)));
  } catch (err) {
    console.log(err);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}
