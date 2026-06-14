import { unstable_noStore as noStore } from "next/cache";
import { cookies } from "next/headers";
import { and, asc, eq, gte, sql } from "drizzle-orm";
import { branch, collection, collGood, good, ost } from "@/db/schema";
import { db } from "@/db";
import { Collection, CollectionWithGoods } from "./schema";
import { CollectionInPage } from "./definitions";

export async function fetchCollections() {
  noStore();

  try {
    const collections = await db.query.collection.findMany({
      where: eq(collection.isDeleted, false),
      orderBy: sql`${collection.position} ASC NULLS LAST`,
      columns: {
        id: true,
        title: true,
        img: true,
        show: true,
        position: true,
      },
      with: {
        collGoods: {
          where: eq(collGood.isDeleted, false),
          columns: { id: true },
        },
      },
    });

    // Add count of collgoods to each collection
    const collectionsWithCount = collections.map((coll) => ({
      ...coll,
      count: coll.collGoods.length,
    }));

    return collectionsWithCount satisfies Collection[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список подборок.");
  }
}

export async function fetchCollection({ id }: { id: number }) {
  noStore();

  try {
    const found = await db.query.collection.findFirst({
      where: eq(collection.id, Number(id)),
      columns: {
        id: true,
        title: true,
      },
      with: {
        collGoods: {
          where: eq(collGood.isDeleted, false),
          columns: { id: true, position: true },
          orderBy: [asc(collGood.position)],
          with: {
            good: {
              columns: {
                id: true,
                drug: true,
                form: true,
              },
              with: {
                category: {
                  columns: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!found) return null;

    return {
      ...found,
      collgoods: found.collGoods.map((cg) => ({
        id: cg.id,
        good: cg.good,
      })),
    } satisfies CollectionWithGoods;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список подборок.");
  }
}

export async function fetchCollectionsForPage() {
  noStore();

  let branchId = cookies().get("branch")?.value;

  if (!branchId) {
    const mainBranch = await db.query.branch.findFirst({
      where: and(eq(branch.isDeleted, false), eq(branch.main, true)),
      columns: { id: true },
    });

    branchId = mainBranch?.id.toString();
  }

  if (!branchId) {
    return [];
  }

  try {
    const collections = await db.query.collection.findMany({
      where: and(eq(collection.isDeleted, false), eq(collection.show, true)),
      orderBy: [asc(collection.position)],
      columns: { id: true, title: true, position: true, show: true },
      with: {
        collGoods: {
          where: and(eq(collGood.isDeleted, false), eq(good.isDeleted, false)),
          columns: { id: true, position: true },
          orderBy: [asc(collGood.position)],
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
      },
    });

    const mutated = collections.map((collection) => ({
      ...collection,
      collgoods: collection.collGoods
        .filter((x) => !x.good.isHidden)
        .filter((x) => x.good.osts.length > 0)
        .filter((x) =>
          x.good.osts.some((ost) => ost.branchId.toString() === branchId)
        )
        .sort((a, b) => {
          // First, check if either good has an ost with the current branchId
          const aHasBranchOst = a.good.osts.some(
            (ost) => ost.branchId.toString() === branchId
          );
          const bHasBranchOst = b.good.osts.some(
            (ost) => ost.branchId.toString() === branchId
          );

          // If one has branch stock and the other doesn't, prioritize the one with stock
          if (aHasBranchOst && !bHasBranchOst) return -1;
          if (!aHasBranchOst && bHasBranchOst) return 1;

          // If both have the same branch status, sort by position
          return (a.position ?? 0) - (b.position ?? 0);
        })
        .map((cg) => ({
          ...cg,
          good: {
            ...cg.good,
            ost: cg.good.osts,
          },
        })),
      _count: {
        collgoods: collection.collGoods
          .filter((x) => !x.good.isHidden)
          .filter((x) => x.good.osts.length > 0)
          .filter((x) =>
            x.good.osts.some((ost) => ost.branchId.toString() === branchId)
          ).length,
      },
    }));

    return mutated satisfies CollectionInPage[];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить список подборок.");
  }
}

export async function fetchCollectionForPage({ id }: { id: string | number }) {
  noStore();

  let branchId = cookies().get("branch")?.value;

  if (!branchId) {
    const mainBranch = await db.query.branch.findFirst({
      where: and(eq(branch.isDeleted, false), eq(branch.main, true)),
      columns: { id: true },
    });

    branchId = mainBranch?.id.toString();
  }

  if (!branchId) {
    return null;
  }

  try {
    const found = await db.query.collection.findFirst({
      where: and(eq(collection.id, Number(id)), eq(collection.show, true)),
      orderBy: [asc(collection.position)],
      columns: { id: true, title: true, position: true, show: true },
      with: {
        collGoods: {
          where: and(eq(collGood.isDeleted, false), eq(good.isDeleted, false)),
          columns: { id: true, position: true },
          orderBy: [asc(collGood.position)],
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
      },
    });

    if (!found) return null;

    const mutated = {
      ...found,
      collgoods: found.collGoods
        .filter((x) => !x.good.isHidden)
        .filter((x) => x.good.osts.length > 0)
        .filter((x) =>
          x.good.osts.some((ost) => ost.branchId.toString() === branchId)
        )
        .sort((a, b) => {
          // First, check if either good has an ost with the current branchId
          const aHasBranchOst = a.good.osts.some(
            (ost) => ost.branchId.toString() === branchId
          );
          const bHasBranchOst = b.good.osts.some(
            (ost) => ost.branchId.toString() === branchId
          );

          // If one has branch stock and the other doesn't, prioritize the one with stock
          if (aHasBranchOst && !bHasBranchOst) return -1;
          if (!aHasBranchOst && bHasBranchOst) return 1;

          // If both have the same branch status, sort by position
          return (a.position ?? 0) - (b.position ?? 0);
        })
        .map((cg) => ({
          ...cg,
          good: {
            ...cg.good,
            ost: cg.good.osts,
          },
        })),
      _count: {
        collgoods: found.collGoods
          .filter((x) => !x.good.isHidden)
          .filter((x) => x.good.osts.length > 0)
          .filter((x) =>
            x.good.osts.some((ost) => ost.branchId.toString() === branchId)
          ).length,
      },
    };

    return mutated satisfies CollectionInPage;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Не удалось загрузить подборку.");
  }
}
