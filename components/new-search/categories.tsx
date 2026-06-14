import { db } from "@/db";
import { category, good } from "@/db/schema";
import {
  CategoriesSectionProps,
  CategoryCount,
} from "@/lib/db/new-search/definitions";
import { count, eq, inArray, sql } from "drizzle-orm";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { CategoryResults } from "./category-results";

export function Categories(props: CategoriesSectionProps) {
  return (
    <Suspense
      fallback={
        <div className='flex gap-2'>
          <Skeleton className='w-[129px] h-[36px] rounded-full bg-[#F2F2F2]' />
          <Skeleton className='w-[129px] h-[36px] rounded-full bg-[#F2F2F2]' />
        </div>
      }
    >
      <CategoriesSection {...props} />
    </Suspense>
  );
}

export async function CategoriesSection({
  query,
  allMatchingIdsForOptions,
  categoryId,
  filterParams,
}: CategoriesSectionProps) {
  // Fetch categories
  const categoriesWithCounts = await db
    .select({
      id: good.categoryId,
      title: category.title,
      count: count(good.id),
    })
    .from(good)
    .leftJoin(category, eq(good.categoryId, category.id))
    .where(
      inArray(
        good.id,
        allMatchingIdsForOptions.map((g) => g.goodId)
      )
    )
    .groupBy(good.categoryId, category.title)
    .orderBy(sql`COUNT(${good.id}) DESC`);

  // Process the results
  const categories: CategoryCount[] = categoriesWithCounts
    .map((cat) => ({
      id: cat.id,
      title: !cat.id ? "Без категории" : cat.title || "Неизвестно",
      count: Number(cat.count),
    }))
    .sort((a, b) =>
      b.count === a.count ? a.title.localeCompare(b.title) : b.count - a.count
    );

  return (
    <CategoryResults
      categories={categories}
      categoryId={categoryId}
      query={query}
      filterParams={filterParams}
    />
  );
}
