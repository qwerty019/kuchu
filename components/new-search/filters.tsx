import {
  FiltersSectionProps,
  GroupedFilter,
} from "@/lib/db/new-search/definitions";
import { Suspense } from "react";
import { filter, filterOption, goodFilter } from "@/db/schema";
import { db } from "@/db";
import { count, eq, inArray } from "drizzle-orm";
import { Skeleton } from "../ui/skeleton";
import { FilterResults } from "./filter-results";

export function Filters(props: FiltersSectionProps) {
  return (
    <Suspense
      fallback={
        <Skeleton className='w-[125px] h-[36px] rounded-full bg-[#F2F2F2]' />
      }
    >
      <FiltersSection {...props} />
    </Suspense>
  );
}

export async function FiltersSection({
  allMatchingIdsForOptions,
}: FiltersSectionProps) {
  // Fetch filters
  const filtersData = await db
    .select({
      id: filter.id,
      title: filter.title,
      type: filter.type,
      optionValue: filterOption.value,
      count: count(),
    })
    .from(filter)
    .innerJoin(filterOption, eq(filter.id, filterOption.filterId))
    .innerJoin(goodFilter, eq(filterOption.id, goodFilter.optionId))
    .where(
      inArray(
        goodFilter.goodId,
        allMatchingIdsForOptions.map((g) => g.goodId)
      )
    )
    .groupBy(filter.id, filter.title, filter.type, filterOption.value)
    .orderBy(filter.title, filterOption.value);

  // Process filter data
  const groupedFilters: GroupedFilter[] = [];

  for (const item of filtersData) {
    const existingFilter = groupedFilters.find((f) => f.id === item.id);

    if (existingFilter) {
      existingFilter.options.push({
        value: item.optionValue,
        count: Number(item.count),
      });
    } else {
      groupedFilters.push({
        id: item.id,
        title: item.title,
        type: item.type,
        options: [{ value: item.optionValue, count: Number(item.count) }],
      });
    }
  }

  // Sort options
  groupedFilters.forEach((filter) => {
    filter.options.sort((a, b) => b.count - a.count);
  });

  if (groupedFilters.length === 0) {
    return null;
  }

  return <FilterResults filters={groupedFilters} />;
}
