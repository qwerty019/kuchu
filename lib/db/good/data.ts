"use server";

import { unstable_noStore as noStore } from "next/cache";
import { Good, GoodAdmin, GoodWithContents, GoodWithFilters } from "./schema";
import { db } from "@/db";
import {
  and,
  asc,
  count,
  eq,
  gte,
  ilike,
  inArray,
  ne,
  SQL,
  sql,
} from "drizzle-orm";
import { category, classGood, good, ost } from "@/db/schema";
import { GoodDetails } from "./definitions";
import { cookies } from "next/headers";
import { Good as GoodType } from "./definitions";

function getConditions(query?: string, category?: string, hidden?: string) {
  const conditions = [
    eq(good.isDeleted, false),
    query ? ilike(good.fullName, `%${query}%`) : undefined,
  ];

  if (category) {
    conditions.push(eq(good.categoryId, Number(category)));
  }

  if (hidden) {
    conditions.push(eq(good.isHidden, true));
  }

  return conditions.filter(Boolean) as SQL<unknown>[];
}

export async function fetchGoods({
  page,
  limit,
  query,
  category,
  hidden,
}: {
  page: string | number;
  limit: string | number;
  query?: string;
  category?: string;
  hidden?: string;
}) {
  noStore();

  try {
    const conditions = getConditions(query, category, hidden);

    const goods = await db.query.good.findMany({
      offset: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      where: and(...conditions),
      orderBy: [asc(good.drug)],
      columns: {
        id: true,
        regId: true,
        drug: true,
        form: true,
        img: true,
        title: true,
        subtitle: true,
        isHidden: true,
        ean: true,
        descId: true,
        fabr: true,
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

    return goods satisfies GoodAdmin[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список товаров.");
  }
}

export async function getGoodsCount({
  query,
  category,
  hidden,
}: {
  query?: string;
  category?: string;
  hidden?: string;
}) {
  noStore();

  try {
    const conditions = getConditions(query, category, hidden);

    const counts = await db
      .select({ count: count() })
      .from(good)
      .where(and(...conditions));

    return counts[0].count satisfies number;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список товаров.");
  }
}

export async function fetchGoodsWithPage({
  page,
  limit,
  query,
}: {
  page: string;
  limit: string;
  query?: string;
}) {
  noStore();

  if (!query) {
    return { goods: [], count: 0 };
  }

  try {
    const goods = await db.query.good.findMany({
      offset: (Number(page) - 1) * Number(limit),
      limit: Number(limit),
      where: and(eq(good.isDeleted, false), ilike(good.fullName, `%${query}%`)),
      orderBy: [asc(good.drug)],
      columns: {
        id: true,
        regId: true,
        drug: true,
        img: true,
        form: true,
        categoryId: true,
        title: true,
        subtitle: true,
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

    const counts = await db
      .select({ count: count() })
      .from(good)
      .where(
        and(eq(good.isDeleted, false), ilike(good.fullName, `%${query}%`))
      );

    return { goods, count: counts[0].count } satisfies {
      goods: Good[];
      count: number;
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список товаров.");
  }
}

export async function getGoodById(id: string) {
  noStore();

  try {
    const goodData = await db.query.good.findFirst({
      where: and(
        eq(good.isDeleted, false),
        eq(good.regId, Number(id)),
        eq(good.isHidden, false)
      ),
      columns: {
        id: true,
        regId: true,
        drugId: true,
        drug: true,
        form: true,
        formId: true,
        fabr: true,
        mnn: true,
        img: true,
        title: true,
        subtitle: true,
      },
      with: {
        contents: {
          columns: {
            id: true,
            title: true,
            content: true,
          },
        },
        osts: {
          where: eq(ost.isDeleted, false),
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
    });

    if (!goodData) return null;

    const { osts, ...rest } = goodData;

    const transformed = { ...rest, ost: osts };

    return transformed satisfies GoodDetails;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список товаров.");
  }
}

export async function getSimilarGoods(id: number) {
  noStore();

  try {
    const classifierData = await db.query.classifier.findFirst({
      where: (c) => {
        const subquery = db
          .select()
          .from(classGood)
          .where(and(eq(classGood.classId, c.id), eq(classGood.goodId, id)));

        return sql`exists (${subquery})`;
      },
      with: {
        classGoods: {
          where: ne(classGood.goodId, id),
          columns: {
            goodId: true,
          },
        },
      },
    });

    if (!classifierData) return [];

    const goodIds = classifierData.classGoods.map((cg) => cg.goodId);

    if (!goodIds.length) return [];

    const goods = await db.query.good.findMany({
      where: and(
        eq(good.isDeleted, false),
        eq(good.isHidden, false),
        inArray(good.id, goodIds)
      ),
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
        category: {
          columns: {
            id: true,
            title: true,
          },
        },
        osts: {
          where: eq(ost.isDeleted, false),
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
    });

    const transformedGoods = goods
      .filter((g) => g.osts.length > 0)
      .map(({ osts, ...g }) => ({
        ...g,
        ost: osts,
      }));

    return transformedGoods satisfies Good[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список товаров.");
  }
}

export async function getGoodWithContents(id: number) {
  noStore();

  try {
    const goodWithContents = await db.query.good.findFirst({
      where: eq(good.id, id),
      columns: { id: true, imported: true },
      with: {
        contents: {
          columns: {
            id: true,
            title: true,
            content: true,
          },
        },
      },
    });

    if (!goodWithContents) return null;

    return goodWithContents satisfies GoodWithContents;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить товар.");
  }
}

export async function getGoodWithFilters(id: number) {
  noStore();

  try {
    const goodWithFilters = await db.query.good.findFirst({
      where: eq(good.id, id),
      columns: { id: true },
      with: {
        goodFilters: {
          columns: { id: true },
          with: {
            filterOption: {
              columns: { id: true, value: true },
              with: {
                filter: {
                  columns: {
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!goodWithFilters) return null;

    const { goodFilters, ...rest } = goodWithFilters;

    const transformed = {
      ...rest,
      filters: goodFilters.map(({ filterOption, ...gf }) => ({
        ...gf,
        option: filterOption,
      })),
    };

    return transformed satisfies GoodWithFilters;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить товар.");
  }
}

// import excel
export async function getGoodsAndCategories() {
  noStore();

  try {
    const [goods, categories] = await Promise.all([
      db.query.good.findMany({
        where: eq(good.isDeleted, false),
        columns: {
          id: true,
          categoryId: true,
          regId: true,
        },
      }),
      db.query.category.findMany({
        where: eq(category.isDeleted, false),
        columns: { id: true, title: true },
        with: {
          parent: {
            columns: {
              id: true,
              title: true,
            },
          },
        },
      }),
    ]);

    return { goods, categories };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список товаров и категорий.");
  }
}

export async function searchGoods(query: string) {
  noStore();

  if (!query) return [];

  try {
    const goods = await db.query.good.findMany({
      where: and(eq(good.isDeleted, false), ilike(good.drug, `%${query}%`)),
      columns: { id: true, drug: true, form: true },
      orderBy: asc(good.id),
      limit: 10,
      with: {
        category: {
          columns: {
            title: true,
          },
        },
      },
    });

    return goods;
  } catch (error) {
    console.log(error);
    throw new Error("Не удалось найти товары.");
  }
}

export async function getGoods(ids: number[]) {
  noStore();

  if (!ids || ids.length === 0) return [];

  try {
    const goods = await db.query.good.findMany({
      where: and(eq(good.isDeleted, false), inArray(good.id, ids)),
      columns: { id: true, drug: true, form: true },
      with: {
        category: { columns: { title: true } },
      },
    });

    return goods;
  } catch (error) {
    console.log(error);
    throw new Error("Не удалось найти товары.");
  }
}

export async function getGoodsByDrugId(drugIds: number[], goodId: number) {
  noStore();

  if (!drugIds || drugIds.length === 0) return [];

  const branchId = cookies().get("branch")?.value;

  try {
    const goods = await db.query.good.findMany({
      where: and(
        eq(good.isDeleted, false),
        eq(good.isHidden, false),
        ne(good.id, goodId),
        inArray(good.drugId, drugIds)
      ),
      columns: {
        id: true,
        drugId: true,
        regId: true,
        drug: true,
        form: true,
        img: true,
        title: true,
        subtitle: true,
      },
      with: {
        osts: {
          where: and(
            eq(ost.isDeleted, false),
            gte(ost.uQntOst, 1),
            branchId ? eq(ost.branchId, Number(branchId)) : undefined
          ),
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
    });

    const transformed = goods
      .filter((x) => x.osts.length > 0)
      .map(({ osts, ...g }) => ({
        ...g,
        ost: osts,
      }));

    return transformed satisfies GoodType[];
  } catch (error) {
    console.log(error);
    throw new Error("Не удалось найти товары рекомендаций.");
  }
}
