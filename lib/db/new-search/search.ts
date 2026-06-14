"use server";

import { and, eq, gt, ilike, inArray, SQL, sql } from "drizzle-orm";
import { FilterParam, GoodWithOsts } from "./definitions";
import {
  branch,
  filter,
  filterOption,
  good,
  goodFilter,
  ost,
  searchExclusion,
} from "@/db/schema";
import { db } from "@/db";
import { cookies } from "next/headers";
import { normalizeQuery } from "./helpers";

export async function getSearchData({
  query,
  categoryId,
  filters,
  stock,
}: {
  query: string;
  categoryId?: string;
  filters?: string;
  stock?: string;
}) {
  const branchCookie = cookies().get("branch");
  let branchId = branchCookie ? parseInt(branchCookie.value) : null;

  if (!branchId) {
    branchId = await getMainBranchId();
  }

  if (!branchId) {
    throw new Error("Филиал не найден.");
  }

  let filterParams: FilterParam[] = [];

  if (filters) {
    try {
      filterParams = JSON.parse(filters) as FilterParam[];
    } catch (e) {
      console.error("Failed to parse filters:", e);
    }
  }

  const normalized = normalizeQuery(query);

  const exclutions = await db.query.searchExclusion.findFirst({
    where: ilike(searchExclusion.query, `%${query}%`),
    columns: { list: true },
  });

  // Add exclusion conditions if we have exclusion terms
  let exclusionCondition: SQL | undefined;

  if (exclutions?.list && exclutions.list.length > 0) {
    const list = exclutions.list.map(
      (term) => sql`LOWER(${good.fullName}) NOT LIKE LOWER(${`%${term}%`})`
    );

    exclusionCondition = and(...list);
  }

  const searchCondition = sql`${good.searchVector} @@ plainto_tsquery('russian', ${normalized})`;
  const fallbackCondition = sql`similarity(${good.fullName}, ${normalized}) > 0.2`;
  const containsCondition = sql`${good.fullName} ILIKE ${"%" + normalized + "%"}`;

  const withExclusion = exclusionCondition
    ? and(searchCondition, exclusionCondition)
    : searchCondition;
  const combinedSearchCondition = sql`(${withExclusion}) OR (${containsCondition})`;

  const searchOrder = sql`ts_rank(${good.searchVector}, plainto_tsquery('russian', ${normalized})) DESC`;
  const fallbackOrder = sql`similarity(${good.fullName}, ${normalized}) DESC`;

  let categoryFilter: SQL | undefined;

  if (categoryId) {
    if (categoryId === "no-category") {
      categoryFilter = sql`${good.categoryId} IS NULL`;
    } else {
      categoryFilter = sql`${good.categoryId} = ${parseInt(categoryId)}`;
    }
  }

  const filterConditions: SQL[] = [];

  if (filterParams.length > 0) {
    for (const param of filterParams) {
      if (param.values.length > 0) {
        // For each filter type, find goods that have any of the filter option values
        const filterOptionIds = await getFilterOptionIds(param);

        if (filterOptionIds.length > 0) {
          // Get goods that have any of these filter options
          const goodsWithFilter = await getGoodWithFilterIds(filterOptionIds);

          if (goodsWithFilter.length > 0) {
            filterConditions.push(inArray(good.id, goodsWithFilter));
          }
        }
      }
    }
  }

  // Build where condition for results - this includes all filters
  const buildResultsWhereCondition = (baseCondition: SQL<unknown>) => {
    const branchIdNonNull = branchId as number;

    const stockCondition = and(
      eq(ost.isDeleted, false),
      gt(ost.uQntOst, 0),
      eq(ost.branchId, branchIdNonNull),
      eq(good.isDeleted, false)
    );

    let conditions = [baseCondition, stockCondition];

    if (categoryFilter) {
      conditions.push(categoryFilter);
    }

    // Add filter conditions
    conditions = conditions.concat(filterConditions);

    return and(...conditions);
  };

  const stockCondition = and(
    eq(ost.isDeleted, false),
    gt(ost.uQntOst, 0),
    eq(good.isHidden, false),
    !stock ? eq(ost.branchId, branchId) : undefined
  );

  // Get all matching good IDs using the primary search condition for RESULTS
  const matchingGoodIds = await getGoodIds(
    buildResultsWhereCondition(combinedSearchCondition),
    stockCondition
  );

  // If no results, try fallback search
  let allMatchingIds = matchingGoodIds;

  if (matchingGoodIds.length === 0) {
    const fallbackIds = await getGoodIds(
      buildResultsWhereCondition(fallbackCondition),
      stockCondition
    );

    allMatchingIds = fallbackIds;
  }

  // Get all matching good IDs for CATEGORIES and FILTERS (based only on search query)
  const matchingGoodIdsForOptions = await getGoodIds(
    combinedSearchCondition,
    stockCondition
  );

  // If no results, try fallback search
  let allMatchingIdsForOptions = matchingGoodIdsForOptions;

  if (matchingGoodIdsForOptions.length === 0) {
    const fallbackIdsForOptions = await getGoodIds(
      fallbackCondition,
      stockCondition
    );

    allMatchingIdsForOptions = fallbackIdsForOptions;
  }

  // Prepare common props for components
  const categoriesProps = {
    query: normalized,
    allMatchingIdsForOptions,
    categoryId,
    filterParams,
  };

  const filtersProps = {
    query: normalized,
    allMatchingIdsForOptions,
    filterParams,
    categoryId,
  };

  const resultsProps = {
    allMatchingIds,
    matchingGoodIds,
    searchOrder,
    fallbackOrder,
    branchId,
    query: normalized,
  };

  return { categoriesProps, filtersProps, resultsProps };
}

async function getFilterOptionIds(param: FilterParam) {
  const filterOptionIds = await db
    .select({ id: filterOption.id })
    .from(filterOption)
    .innerJoin(filter, eq(filterOption.filterId, filter.id))
    .where(
      and(
        eq(filter.type, param.type),
        inArray(filterOption.value, param.values)
      )
    );

  return filterOptionIds.map((f) => f.id);
}

async function getGoodWithFilterIds(filterOptionIds: number[]) {
  const goodsWithFilter = await db
    .select({ goodId: goodFilter.goodId })
    .from(goodFilter)
    .where(inArray(goodFilter.optionId, filterOptionIds))
    .groupBy(goodFilter.goodId);

  return goodsWithFilter.map((g) => g.goodId);
}

async function getMainBranchId() {
  const mainBranch = await db.query.branch.findFirst({
    where: and(eq(branch.isDeleted, false), eq(branch.main, true)),
    columns: { id: true },
  });

  return mainBranch?.id || null;
}

async function getGoodIds(
  whereCondition: SQL<unknown> | undefined,
  stockCondition: SQL<unknown> | undefined
) {
  return await db
    .select({ goodId: good.id })
    .from(good)
    .innerJoin(ost, eq(good.id, ost.goodId))
    .where(and(whereCondition, stockCondition))
    .groupBy(good.id);
}

export async function getGoods(
  ids: number[],
  branchId: number,
  order: SQL<unknown>,
  limit: number,
  page: number
) {
  const results = await db.query.good.findMany({
    where: inArray(good.id, ids),
    orderBy: order,
    limit: limit,
    offset: limit * page,
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
        where: and(eq(ost.isDeleted, false), gt(ost.uQntOst, 0)),
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

  return results;
}

export async function getGoodsOnClient(
  allMatchingIds: { goodId: number }[],
  matchingGoodIds: { goodId: number }[],
  branchId: number,
  query: string,
  page: number
) {
  try {
    const searchOrder = sql`ts_rank(${good.searchVector}, plainto_tsquery('russian', ${query})) DESC`;
    const fallbackOrder = sql`similarity(${good.fullName}, ${query}) DESC`;

    let searchResults: GoodWithOsts[] = [];

    if (allMatchingIds.length > 0) {
      if (matchingGoodIds.length > 0) {
        // Use primary search results with relevance ranking
        searchResults = await getGoods(
          allMatchingIds.map((g) => g.goodId),
          branchId,
          searchOrder,
          20,
          page - 1
        );
      } else {
        // Use fallback results with similarity ranking
        searchResults = await getGoods(
          allMatchingIds.map((g) => g.goodId),
          branchId,
          fallbackOrder,
          20,
          page - 1
        );
      }
    }

    return searchResults;
  } catch (err) {
    console.log(err);
    throw new Error("Что-то пошло не так. Попробуйте еще.");
  }
}
