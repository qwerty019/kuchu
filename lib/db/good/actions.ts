"use server";

import { z } from "zod";
import { EditGoodSchema, GoodAdmin } from "./schema";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { content, good } from "@/db/schema";
import { uploadToS3 } from "@/lib/upload";

export async function editGood(
  id: number,
  body: z.infer<typeof EditGoodSchema>,
) {
  const validatedFields = EditGoodSchema.safeParse(body);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Недостающие поля. Не удалось обновить товар.",
    };
  }

  const { categoryId, img, title, subtitle, isHidden } = validatedFields.data;

  try {
    if (title || subtitle) {
      const existing = await db.query.good.findFirst({
        where: eq(good.id, id),
        columns: {
          drug: true,
          form: true,
          title: true,
          subtitle: true,
          fullName: true,
        },
        with: {
          contents: {
            where: eq(content.isDeleted, false),
            columns: { text: true },
          },
        },
      });

      if (!existing) {
        return { message: "Товар не найден." };
      }

      let fullName = existing.fullName;

      if (title && subtitle) {
        fullName = `${title} ${subtitle}`;
      } else if (title) {
        fullName = `${title} ${existing.form}`;
      } else if (subtitle) {
        fullName = `${existing.form} ${subtitle}`;
      }

      if (fullName !== existing.fullName) {
        const contentText = [
          fullName,
          ...existing.contents.map((t) => t.text),
        ].join("\n");

        await db
          .update(good)
          .set({ fullName, contentText, updatedAt: new Date().toISOString() })
          .where(eq(good.id, id));
      }
    }

    await db
      .update(good)
      .set({
        categoryId,
        img,
        title,
        subtitle,
        isHidden,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(good.id, id));

    const updated = await db.query.good.findFirst({
      where: eq(good.id, id),
      columns: {
        id: true,
        regId: true,
        drug: true,
        form: true,
        img: true,
        isHidden: true,
        title: true,
        subtitle: true,
        descId: true,
        fabr: true,
        ean: true,
      },
      with: {
        category: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!updated) {
      return { message: "Не удалось обновить товар." };
    }

    return updated satisfies GoodAdmin;
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Не удалось изменить товар." };
  }
}

// import excel
export async function addCategoryToGood(id: number, categoryId: number) {
  try {
    await db
      .update(good)
      .set({ categoryId, updatedAt: new Date().toISOString() })
      .where(eq(good.id, id));

    return { success: true };
  } catch (error) {
    console.error("Database Error:", error);
    return { message: "Не удалось добавить категорию." };
  }
}

export async function addImageFromRlsToGood(
  id: number,
  regId: number,
  imageUrl: string,
) {
  try {
    const res = await fetch(imageUrl);
    const blob = await res.blob();

    const ext = imageUrl.split(".").pop()?.split(/[?#]/)[0];

    if (!ext) {
      return { message: "Не удалось получить расширение файла." };
    }

    const file = new File([blob], `${regId}.${ext}`, {
      type: blob.type,
    });

    const formData = new FormData();
    formData.append("file", file);

    const uploadResult = await uploadToS3(
      formData,
      `${regId}.${ext}`,
      "product",
      true,
    );

    await db
      .update(good)
      .set({ img: uploadResult.url, updatedAt: new Date().toISOString() })
      .where(eq(good.id, id));

    const updated = await db.query.good.findFirst({
      where: eq(good.id, id),
      columns: {
        id: true,
        regId: true,
        drug: true,
        form: true,
        img: true,
        isHidden: true,
        title: true,
        subtitle: true,
        descId: true,
        fabr: true,
        ean: true,
      },
      with: {
        category: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
    });

    if (!updated) {
      return { message: "Не удалось обновить товар." };
    }

    return updated satisfies GoodAdmin;
  } catch (error) {
    console.error(error);

    if (error instanceof Error) {
      return { message: error.message };
    }

    return { message: "Не удалось изменить изображение товара." };
  }
}
