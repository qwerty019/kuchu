"use server";

import { z } from "zod";
import { AddCategorySchema, EditCategorySchema } from "./schema";
import { v4 as uuidv4 } from "uuid";
import { revalidatePath } from "next/cache";
import { Flatten } from "@/components/admin/categories/import-excel";
import { db } from "@/db";
import { and, count, eq, inArray, isNull, notInArray } from "drizzle-orm";
import { category, good } from "@/db/schema";

export async function addCategory(body: z.infer<typeof AddCategorySchema>) {
  const validatedFields = AddCategorySchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось создать категорию.",
    };
  }

  const { title, parentId } = validatedFields.data;

  try {
    if (parentId) {
      const parent = await db.query.category.findFirst({
        where: and(eq(category.isDeleted, false), eq(category.id, parentId)),
      });

      if (!parent) {
        return {
          errors: { parentId: ["Родительская категория не найдена."] },
          message: "Не удалось создать категорию.",
        };
      }
    }

    await db.insert(category).values({
      title,
      route: uuidv4(),
      parentId,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.log(error);
    return { message: "Произошла ошибка при создании категории." };
  }

  revalidatePath("/admin/categories");
}

export async function editCategory(
  id: number,
  body: z.infer<typeof EditCategorySchema>
) {
  const validatedFields = EditCategorySchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось обновить категорию.",
    };
  }

  const { title, parentId, url } = validatedFields.data;

  try {
    if (parentId) {
      const parent = await db.query.category.findFirst({
        where: and(eq(category.isDeleted, false), eq(category.id, parentId)),
      });

      if (!parent) {
        return {
          errors: { parentId: ["Родительская категория не найдена."] },
          message: "Не удалось обновить категорию.",
        };
      }
    }

    if (parentId) {
      // Check if parentId is the same as the current category
      if (parentId === id) {
        return {
          errors: {
            parentId: ["Категория не может быть родителем самой себя."],
          },
          message: "Не удалось обновить категорию.",
        };
      }

      if (parentId) {
        const isDescendant = await checkIfDescendant(id, parentId);

        if (isDescendant) {
          return {
            errors: {
              parentId: [
                "Родительская категория не может быть потомком текущей категории.",
              ],
            },
            message: "Не удалось обновить категорию.",
          };
        }
      }
    }

    await db
      .update(category)
      .set({
        title,
        parentId,
        url,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(category.id, id));
  } catch (error) {
    console.log(error);
    return {
      message: "Произошла ошибка при редактировании категории.",
    };
  }

  revalidatePath("/admin/categories");
}

async function checkIfDescendant(
  currentId: number,
  potentialDescendantId: number
): Promise<boolean> {
  let categoryToCheck = await db.query.category.findFirst({
    where: eq(category.id, potentialDescendantId),
    columns: { id: true, parentId: true },
  });

  while (categoryToCheck) {
    if (categoryToCheck.id === currentId) {
      return true;
    }

    if (categoryToCheck.parentId === null) {
      return false;
    }

    categoryToCheck = await db.query.category.findFirst({
      where: eq(category.id, categoryToCheck.parentId),
      columns: { id: true, parentId: true },
    });
  }

  return false;
}

export async function deleteCategory(id: number) {
  try {
    const existing = await db.query.category.findFirst({
      where: and(eq(category.isDeleted, false), eq(category.id, id)),
      with: {
        children: {
          where: eq(category.isDeleted, false),
          columns: { id: true },
        },
      },
      columns: { id: true },
    });

    if (!existing) {
      return { message: "Категория не найдена." };
    }

    if (existing.children.length) {
      return {
        message: "Нельзя удалить категорию, у которой есть дочерние категории.",
      };
    }

    const parent = await db.query.category.findFirst({
      where: and(eq(category.isDeleted, false), eq(category.parentId, id)),
    });

    if (parent) {
      return {
        message: "Нельзя удалить категорию, у которой есть дочерние категории.",
      };
    }

    const result = await db
      .select({ count: count() })
      .from(good)
      .where(and(eq(good.isDeleted, false), eq(good.categoryId, id)));

    if (result[0].count > 0) {
      return {
        message: "Нельзя удалить категорию, у которой есть товары.",
      };
    }

    await db
      .update(category)
      .set({
        isDeleted: true,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(category.id, id));
  } catch (error) {
    console.log(error);
    return { message: "Произошла ошибка при удалении категории." };
  }

  revalidatePath("/admin/categories");
}

// for import from excel
export async function createOrUpdate(data: Flatten) {
  const { title, parentId } = data;

  try {
    const existing = await db.query.category.findFirst({
      where: and(
        eq(category.isDeleted, false),
        parentId === null
          ? isNull(category.parentId)
          : eq(category.parentId, parentId),
        eq(category.title, title)
      ),
    });

    if (existing) return { ...data, id: existing.id };

    const created = await db
      .insert(category)
      .values({
        title,
        route: uuidv4(),
        parentId,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return { ...data, id: created[0].id };
  } catch (error) {
    return { message: "Произошла ошибка при создании категории." };
  }
}

export async function deleteRest(arr: number[]) {
  try {
    const categories = await db.query.category.findMany({
      where: and(eq(category.isDeleted, false), notInArray(category.id, arr)),
      columns: { id: true },
    });

    const categoryIds = categories.map((c) => c.id);

    if (!categoryIds.length) return { success: true };

    for (const id of categoryIds) {
      await db
        .update(good)
        .set({
          categoryId: null,
          updatedAt: new Date().toISOString(),
        })
        .where(eq(good.categoryId, id));
    }

    await db
      .update(category)
      .set({
        isDeleted: true,
        updatedAt: new Date().toISOString(),
      })
      .where(inArray(category.id, categoryIds));

    return { success: true };
  } catch (error) {
    return { message: "Произошла ошибка при удалении категорий." };
  }
}

export async function reorder(
  categories: {
    id: number | string;
    position: number;
    parentId: number | string | null;
  }[]
) {
  try {
    await db.transaction(async (tx) => {
      for (const { id, position, parentId } of categories) {
        await tx
          .update(category)
          .set({
            position,
            parentId: parentId ? Number(parentId) : null,
            updatedAt: new Date().toISOString(),
          })
          .where(eq(category.id, Number(id)));
      }
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { message: "Ошибка при обновлении позиций." };
  }
}
