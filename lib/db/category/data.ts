"use server";

import { unstable_noStore as noStore } from "next/cache";
import {
  Category,
  CategoryForPage,
  CategoryInEdit,
  CategoryLeftSide,
  NestedCategory,
} from "./schema";
import { db } from "@/db";
import {
  and,
  asc,
  count,
  countDistinct,
  eq,
  gte,
  ilike,
  inArray,
  isNull,
  not,
  sql,
} from "drizzle-orm";
import { category, good, ost } from "@/db/schema";
import { cookies } from "next/headers";
import { Option } from "@/lib/definitions";

export async function fetchCategoriesAdmin({
  parentId,
}: {
  parentId: string | number | null;
}) {
  noStore();

  try {
    const categories = await db.query.category.findMany({
      where: and(
        eq(category.isDeleted, false),
        parentId !== null
          ? eq(category.parentId, Number(parentId))
          : isNull(category.parentId)
      ),
      orderBy: [asc(category.position)],
      columns: {
        id: true,
        title: true,
        position: true,
        url: true,
      },
      with: {
        parent: {
          columns: {
            id: true,
            title: true,
          },
        },
        children: {
          where: eq(category.isDeleted, false),
          columns: { id: true },
        },
      },
    });

    const transformed = categories.map(({ children, ...rest }) => ({
      ...rest,
      _count: {
        children: children.length,
      },
    }));

    return transformed satisfies Category[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список категорий.");
  }
}

export async function searchCategories({
  page,
  limit,
  query,
}: {
  page: string;
  limit: string;
  query?: string;
}) {
  noStore();

  try {
    const categories = await db.query.category.findMany({
      limit: Number(limit),
      offset: (Number(page) - 1) * Number(limit),
      where: and(
        eq(category.isDeleted, false),
        ilike(category.title, `%${query}%`)
      ),
      orderBy: [asc(category.title)],
      columns: {
        id: true,
        title: true,
        position: true,
        url: true,
      },
      with: {
        parent: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
    });

    const result = await db
      .select({ count: count() })
      .from(category)
      .where(
        and(eq(category.isDeleted, false), ilike(category.title, `%${query}%`))
      );

    return { categories, count: result[0].count };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список категорий.");
  }
}

export async function fetchCategories({ parentId }: { parentId?: string }) {
  noStore();

  try {
    const conditions = [eq(category.isDeleted, false)];

    if (parentId === "notNull") {
      conditions.push(not(isNull(category.parentId)));
    }

    const categories = await db.query.category.findMany({
      where: and(...conditions),
      columns: {
        id: true,
        title: true,
        position: true,
        url: true,
      },
      with: {
        parent: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
    });

    return categories;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список категорий.");
  }
}

export async function fetchCategoriesForLeftSide() {
  noStore();

  try {
    const categories2 = await db.query.category.findMany({
      where: and(eq(category.isDeleted, false), isNull(category.parentId)),
      orderBy: [asc(category.position)],
      columns: {
        id: true,
        title: true,
        route: true,
        url: true,
      },
      with: {
        children: {
          where: eq(category.isDeleted, false),
          orderBy: [asc(category.position)],
          columns: {
            id: true,
            title: true,
            route: true,
          },
          with: {
            children: {
              where: eq(category.isDeleted, false),
              orderBy: [asc(category.position)],
              columns: {
                id: true,
              },
            },
          },
        },
      },
    });

    const idsSet = new Set<number>();

    categories2.forEach((c1) => {
      idsSet.add(c1.id);
      c1.children.forEach((c2) => {
        idsSet.add(c2.id);
        c2.children.forEach((c3) => {
          idsSet.add(c3.id);
        });
      });
    });

    const ids = Array.from(idsSet);

    if (ids.length === 0) return [];

    const stockCountsResults = await db
      .select({
        categoryId: good.categoryId,
        goodsWithStockCount: countDistinct(good.id).mapWith(Number), // Ensure it's a number
      })
      .from(good)
      .innerJoin(ost, eq(ost.goodId, good.id))
      .where(
        and(
          inArray(good.categoryId, ids), // Check for goods in any of the collected IDs
          eq(good.isDeleted, false),
          eq(ost.isDeleted, false),
          gte(ost.uQntOst, 1)
        )
      )
      .groupBy(good.categoryId);

    const result = [];

    for (const c1 of categories2) {
      // Parent categories
      const validC1Children = []; // Will store the child objects {id, title, route} that are valid

      for (const c2 of c1.children) {
        // Children of c1
        // Check if any of c2's children (c3 - grandchildren of c1) have stock
        const c2HasStockedGrandchildren = c2.children.some((c3) => {
          const c3StockInfo = stockCountsResults.find(
            (item) => item.categoryId === c3.id
          );
          return (c3StockInfo?.goodsWithStockCount || 0) > 0;
        });

        // Check if c2 itself has direct stock
        const c2StockInfo = stockCountsResults.find(
          (item) => item.categoryId === c2.id
        );
        const c2HasDirectStock = (c2StockInfo?.goodsWithStockCount || 0) > 0;

        // C2 is valid if it has direct stock OR its children (c3) have stock
        if (c2HasDirectStock || c2HasStockedGrandchildren) {
          validC1Children.push({ id: c2.id, title: c2.title, route: c2.route });
        }
      }

      // C1 (parent) is included if it has at least one valid child (c2)
      // This matches the Prisma `children: { some: { CONDITION } }` logic for the parent.
      if (validC1Children.length > 0) {
        result.push({
          id: c1.id,
          title: c1.title,
          route: c1.route,
          url: c1.url,
          children: validC1Children, // Add the array of valid children
        });
      }
      // If you also want to include c1 if ITSELF has stock, even with no valid children (this deviates from original Prisma):
      // const c1StockInfo = stockCountsResults.find(item => item.categoryId === c1.id);
      // const c1HasDirectStock = (c1StockInfo?.goodsWithStockCount || 0) > 0;
      // if (c1HasDirectStock || validC1Children.length > 0) {
      //   result.push({ /* c1 data, children: validC1Children */ });
      // }
    }

    return result satisfies CategoryLeftSide[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список категорий.");
  }
}

export async function fetchCategoriesForLeftSideNew() {
  noStore();

  try {
    // First, get categories with stock information in a single query
    const categoriesWithStock = await db
      .select({
        id: category.id,
        title: category.title,
        route: category.route,
        url: category.url,
        parentId: category.parentId,
        position: category.position,
        hasStock: sql<boolean>`
          EXISTS (
            SELECT 1 
            FROM ${good} g 
            INNER JOIN ${ost} o ON g.id = o.good_id
            WHERE g.category_id = ${category.id} 
              AND g.is_deleted = false 
              AND o.is_deleted = false 
              AND o.u_qnt_ost >= 1
          )
        `.as("has_stock"),
      })
      .from(category)
      .where(
        and(
          eq(category.isDeleted, false),
          // Only get root categories and their direct children
          sql`(${category.parentId} IS NULL OR ${category.parentId} IN (
            SELECT id FROM ${category} WHERE parent_id IS NULL AND is_deleted = false
          ))`
        )
      )
      .orderBy(asc(category.position), asc(category.title));

    // Build the hierarchy efficiently
    const rootCategories: any[] = [];

    // First pass: create all categories and identify roots
    for (const cat of categoriesWithStock) {
      if (!cat.parentId) {
        rootCategories.push({
          id: cat.id,
          title: cat.title,
          route: cat.route,
          url: cat.url,
          hasStock: cat.hasStock,
        });
      }
    }

    // Second pass: build parent-child relationships and filter
    const validRootCategories: CategoryLeftSide[] = [];

    for (const rootCat of rootCategories) {
      const validChildren = categoriesWithStock
        .filter((cat) => cat.parentId === rootCat.id && cat.hasStock)
        .map((cat) => ({
          id: cat.id,
          title: cat.title,
          route: cat.route,
        }));

      // Include root category if it has stock OR has children with stock
      if (rootCat.hasStock || validChildren.length > 0) {
        validRootCategories.push({
          id: rootCat.id,
          title: rootCat.title,
          route: rootCat.route,
          url: rootCat.url,
          children: validChildren,
        });
      }
    }

    return validRootCategories satisfies CategoryLeftSide[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список категорий.");
  }
}

export async function getCategoryForPage({
  route,
  stock,
}: {
  route: string;
  stock?: string;
}) {
  noStore();

  try {
    const category2 = await db.query.category.findFirst({
      where: and(eq(category.isDeleted, false), eq(category.route, route)),
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
        children: {
          where: and(eq(category.isDeleted, false)),
          orderBy: [asc(category.position)],
          columns: {
            id: true,
            title: true,
            route: true,
          },
          with: {
            goods: {
              where: and(eq(good.isDeleted, false), eq(good.isHidden, false)),
              limit: 4,
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
      },
    });

    if (!category2) return null;

    const branch = cookies().get("branch")?.value;

    const transformed = {
      ...category2,
      goods: category2.goods
        .filter((x) => x.osts.length > 0)
        .filter((x) => {
          if (branch && !stock) {
            return x.osts.some((ost) => ost.branchId === Number(branch));
          }
          return true;
        })
        .map(({ osts, ...rest }) => ({
          ...rest,
          ost: osts,
        })),
      children: category2.children
        .filter((child) => child.goods.length > 0)
        .map((child) => ({
          ...child,
          goods: child.goods
            .filter((x) => x.osts.length > 0)
            .filter((x) => {
              if (branch && !stock) {
                return x.osts.some((ost) => ost.branchId === Number(branch));
              }
              return true;
            })
            .map(({ osts, ...rest }) => ({
              ...rest,
              ost: osts,
            })),
        })),
    };

    return transformed satisfies CategoryForPage;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить категорию.");
  }
}

export async function fetchAllCategories({ parentId }: { parentId?: string }) {
  noStore();

  const conditions = [eq(category.isDeleted, false)];

  if (parentId === "notNull") {
    conditions.push(not(isNull(category.parentId)));
  }

  try {
    const categories = await db.query.category.findMany({
      where: and(...conditions),
      orderBy: [asc(category.position)],
      columns: {
        id: true,
        title: true,
        position: true,
        url: true,
      },
      with: {
        parent: {
          columns: {
            id: true,
            title: true,
          },
        },
      },
    });

    const transformed = categories.map((c) => ({
      value: c.id.toString(),
      label: c.title,
      desc: c.parent?.title,
    }));

    return transformed satisfies Option[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список категорий.");
  }
}

export async function getCategoryInEdit({ id }: { id: number }) {
  noStore();

  try {
    const categoryData = await db.query.category.findFirst({
      where: and(eq(category.isDeleted, false), eq(category.id, id)),
      columns: {
        id: true,
        title: true,
        url: true,
        parentId: true,
      },
    });

    if (!categoryData) {
      throw new Error("Категория не найдена.");
    }

    return categoryData satisfies CategoryInEdit;
  } catch (error) {
    console.error("Database Error:", error);

    if (error instanceof Error) {
      throw new Error(error.message);
    }

    throw new Error("Не удалось загрузить данные категории.");
  }
}

export async function fetchCategoriesInAdmin() {
  noStore();

  try {
    const categories = await db.query.category.findMany({
      where: and(eq(category.isDeleted, false)),
      orderBy: [asc(category.position)],
      columns: {
        id: true,
        title: true,
        route: true,
        parentId: true,
      },
    });

    // Transform flat array into nested structure
    const categoryMap = new Map<number, NestedCategory>();
    const rootCategories: NestedCategory[] = [];

    // First pass: create map of all categories
    categories.forEach((cat) => {
      categoryMap.set(cat.id, { ...cat, collapsed: true, children: [] });
    });

    // Second pass: build nested structure
    categories.forEach((cat) => {
      const categoryWithChildren = categoryMap.get(cat.id);
      if (!categoryWithChildren) return;

      if (cat.parentId === null) {
        rootCategories.push({
          id: cat.id,
          title: cat.title,
          route: cat.route,
          collapsed: categoryWithChildren.children.length > 0,
          children: categoryWithChildren.children,
        });
      } else {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children.push({
            id: cat.id,
            title: cat.title,
            route: cat.route,
            collapsed: categoryWithChildren.children.length > 0,
            children: categoryWithChildren.children,
          });
        }
      }
    });

    return rootCategories satisfies NestedCategory[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список категорий.");
  }
}
