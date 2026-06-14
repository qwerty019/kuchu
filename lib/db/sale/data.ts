"use server";

import { cookies } from "next/headers";
import { unstable_noStore as noStore } from "next/cache";
import { db } from "@/db";
import { and, asc, eq, gte } from "drizzle-orm";
import { good, ost, sale, saleBranch, saleGood } from "@/db/schema";
import { Sale } from "./definitions";
import { SaleAdmin, SaleInEdit } from "./schema";

export async function fetchSales() {
  noStore();

  try {
    const sales = await db.query.sale.findMany({
      where: eq(sale.isDeleted, false),
      orderBy: [asc(sale.position)],
      columns: { id: true, title: true, img: true },
    });

    return sales satisfies SaleAdmin[];
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Ошибка при получении акций");
  }
}

export async function fetchPageSales() {
  noStore();

  const branch = cookies().get("branch")?.value;

  try {
    const sales = await db.query.sale.findMany({
      where: and(eq(sale.isDeleted, false), eq(sale.show, true)),
      orderBy: [asc(sale.position)],
      columns: {
        id: true,
        title: true,
        img: true,
        images: true,
        subtitle: true,
        text: true,
      },
      with: {
        category: {
          columns: {
            id: true,
            title: true,
            route: true,
          },
          with: {
            goods: {
              where: and(eq(good.isDeleted, false), eq(good.isHidden, false)),
              columns: {
                id: true,
                regId: true,
                drug: true,
                form: true,
                img: true,
                title: true,
                subtitle: true,
              },
              with: {
                osts: {
                  where: and(eq(ost.isDeleted, false), gte(ost.uQntOst, 1)),
                  orderBy: [asc(ost.priceRoznWNDS)],
                  columns: {
                    branchId: true,
                    uQntOst: true,
                    recipe: true,
                    priceRoznWNDS: true,
                    fixPriceValue: true,
                    naklDataId: true,
                  },
                },
              },
            },
          },
        },
        saleGoods: {
          where: eq(saleGood.isDeleted, false),
          columns: { id: true },
          with: {
            good: {
              columns: {
                id: true,
                regId: true,
                drug: true,
                form: true,
                img: true,
                title: true,
                subtitle: true,
                isHidden: true,
              },
              with: {
                osts: {
                  where: and(eq(ost.isDeleted, false), gte(ost.uQntOst, 1)),
                  orderBy: [asc(ost.priceRoznWNDS)],
                  columns: {
                    branchId: true,
                    uQntOst: true,
                    recipe: true,
                    priceRoznWNDS: true,
                    fixPriceValue: true,
                    naklDataId: true,
                  },
                },
              },
            },
          },
        },
        saleBranches: {
          where: eq(saleBranch.isDeleted, false),
          columns: { branchId: true },
        },
      },
    });

    const filtered = branch
      ? sales.filter((s) =>
          s.saleBranches.some((sb) => sb.branchId.toString() === branch)
        )
      : sales;

    filtered.forEach((s) => {
      s.category?.goods.sort((a, b) => {
        const aBranch = a.osts.find(
          (ost) => ost.branchId.toString() === branch
        );
        const bBranch = b.osts.find(
          (ost) => ost.branchId.toString() === branch
        );

        // First prioritize items that are available in the selected branch
        if (aBranch && !bBranch) return -1;
        if (!aBranch && bBranch) return 1;

        return 0;
      });

      s.saleGoods.sort((a, b) => {
        const aBranch = a.good.osts.find(
          (ost) => ost.branchId.toString() === branch
        );
        const bBranch = b.good.osts.find(
          (ost) => ost.branchId.toString() === branch
        );

        if (aBranch && !bBranch) return -1;
        if (!aBranch && bBranch) return 1;

        return 0;
      });
    });

    const mutated = filtered.map((s) => ({
      ...s,
      category: s.category
        ? {
            ...s.category,
            goods: s.category.goods
              .filter((g) => g.osts.length > 0)
              .filter((g) =>
                branch
                  ? g.osts.some((ost) => ost.branchId.toString() === branch)
                  : true
              )
              .map((g) => ({
                ...g,
                ost: g.osts,
              })),
          }
        : null,
      salegoods: s.saleGoods
        .filter((sg) => !sg.good.isHidden)
        .filter((sg) => sg.good.osts.length > 0)
        .filter((sg) =>
          branch
            ? sg.good.osts.some((ost) => ost.branchId.toString() === branch)
            : true
        )
        .map((sg) => ({
          good: {
            ...sg.good,
            ost: sg.good.osts,
          },
        })),
      salebranches: s.saleBranches,
    }));

    return mutated satisfies Sale[];
  } catch (error) {
    console.log(error);
    return { message: "Ошибка при получении акций" };
  }
}

export async function fetchSale(id: number) {
  noStore();

  try {
    const found = await db.query.sale.findFirst({
      where: eq(sale.id, id),
      columns: {
        id: true,
        title: true,
        subtitle: true,
        text: true,
        img: true,
        position: true,
        images: true,
        categoryId: true,
        startDate: true,
        endDate: true,
        show: true,
        selected: true,
      },
      with: {
        saleBranches: {
          columns: {
            branchId: true,
          },
        },
        saleGoods: {
          columns: {
            goodId: true,
          },
        },
      },
    });

    if (!found) {
      throw new Error("Акция не найдена");
    }

    const transformed = {
      ...found,
      salebranches: found.saleBranches.map((x) => x.branchId),
      salegoods: found.saleGoods.map((x) => x.goodId),
    };

    return transformed satisfies SaleInEdit;
  } catch (error) {
    console.log(error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Ошибка при получении акции");
  }
}
