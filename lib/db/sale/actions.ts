"use server";

import { z } from "zod";
import { AddSaleSchema } from "./schema";
import { db } from "@/db";
import { sale, saleBranch, saleGood } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export async function addSale(body: z.infer<typeof AddSaleSchema>) {
  const parse = AddSaleSchema.safeParse(body);

  if (!parse.success) {
    return { message: "Некорректные данные." };
  }

  const {
    title,
    subtitle,
    img,
    text,
    images,
    startDate,
    endDate,
    categoryId,
    salebranches,
    salegoods,
    position,
  } = parse.data;

  try {
    await db.transaction(async (tx) => {
      const [created] = await tx
        .insert(sale)
        .values({
          title,
          img,
          subtitle,
          images,
          text,
          categoryId,
          position,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        .returning();

      await tx.insert(saleBranch).values(
        salebranches.map((branchId) => ({
          branchId,
          saleId: created.id,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }))
      );

      if (salegoods) {
        await tx.insert(saleGood).values(
          salegoods.map((goodId) => ({
            goodId,
            saleId: created.id,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          }))
        );
      }
    });
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}
export async function editSale(
  id: number,
  body: z.infer<typeof AddSaleSchema>
) {
  const parse = AddSaleSchema.safeParse(body);

  if (!parse.success) {
    return { message: "Некорректные данные." };
  }

  const {
    title,
    subtitle,
    img,
    text,
    images,
    startDate,
    endDate,
    categoryId,
    salebranches,
    salegoods,
    position,
    show,
    selected,
  } = parse.data;

  try {
    if (selected) {
      const existing = await db.query.sale.findFirst({
        where: and(eq(sale.isDeleted, false), eq(sale.selected, true)),
        columns: { id: true },
      });

      if (existing && existing.id !== id) {
        return { message: "Невозможно выбрать несколько акций." };
      }
    }

    await db.transaction(async (tx) => {
      await tx
        .update(sale)
        .set({
          title,
          img,
          subtitle,
          images,
          text,
          categoryId,
          position,
          show,
          startDate: new Date(startDate).toISOString(),
          endDate: new Date(endDate).toISOString(),
          selected,
        })
        .where(eq(sale.id, id));

      await tx.delete(saleBranch).where(eq(saleBranch.saleId, id));
      await tx.delete(saleGood).where(eq(saleGood.saleId, id));

      await tx.insert(saleBranch).values(
        salebranches.map((branchId) => ({
          branchId,
          saleId: id,
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        }))
      );

      if (salegoods) {
        await tx.insert(saleGood).values(
          salegoods.map((goodId) => ({
            goodId,
            saleId: id,
            updatedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
          }))
        );
      }
    });
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}

export async function deleteSale(id: number) {
  try {
    const existing = await db.query.sale.findFirst({
      where: eq(sale.id, id),
      columns: { selected: true },
    });

    if (existing && existing.selected) {
      return { message: "Невозможно удалить выбранную акцию." };
    }

    await db.transaction(async (tx) => {
      await tx.update(sale).set({ isDeleted: true }).where(eq(sale.id, id));
      await tx
        .update(saleBranch)
        .set({ isDeleted: true })
        .where(eq(saleBranch.saleId, id));
      await tx
        .update(saleGood)
        .set({ isDeleted: true })
        .where(eq(saleGood.saleId, id));
    });
  } catch (error) {
    console.log(error);
    return { message: "Что-то пошло не так. Повторите еще." };
  }
}
