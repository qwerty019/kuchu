"use server";

import { validateRequest } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { user as userTable } from "@/db/schema";

export async function updateRole(id: number) {
  const { user } = await validateRequest();

  if (!user) {
    return { message: "Нужно авторизоваться." };
  }

  if (!user.roles || user.roles.length === 0) {
    return { message: "Нет прав." };
  }

  if (Number(user.id) === id) {
    return { message: "Нельзя изменить свою роль." };
  }

  try {
    const user = await db.query.user.findFirst({
      where: and(eq(userTable.isDeleted, false), eq(userTable.id, id)),
      columns: { roles: true },
    });

    if (!user) {
      return { message: "Пользователь не найден." };
    }

    const roles = !user.roles
      ? ["admin"]
      : user.roles.includes("admin")
        ? user.roles.filter((role) => role !== "admin")
        : [...user.roles, "admin"];

    const [updated] = await db
      .update(userTable)
      .set({ roles, updatedAt: new Date() })
      .where(eq(userTable.id, id))
      .returning();

    return updated;
  } catch (error) {
    return { message: "Не удалось обновить роль." };
  }
}
