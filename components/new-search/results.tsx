import {
  GoodWithOsts,
  SearchResultsProps,
} from "@/lib/db/new-search/definitions";
import { getGoods } from "@/lib/db/new-search/search";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import GoodResults from "./good-results";

export function Results(props: SearchResultsProps) {
  return (
    <Suspense key={props.suspenseKey} fallback={<SearchResultsLoading />}>
      <SearchResults {...props} />
    </Suspense>
  );
}

export async function SearchResults({
  allMatchingIds,
  matchingGoodIds,
  searchOrder,
  fallbackOrder,
  branchId,
  query,
}: SearchResultsProps) {
  // Get search results
  let searchResults: GoodWithOsts[] = [];

  if (allMatchingIds.length > 0) {
    if (matchingGoodIds.length > 0) {
      // Use primary search results with relevance ranking
      searchResults = await getGoods(
        allMatchingIds.map((g) => g.goodId),
        branchId,
        searchOrder,
        20,
        0
      );
    } else {
      // Use fallback results with similarity ranking
      searchResults = await getGoods(
        allMatchingIds.map((g) => g.goodId),
        branchId,
        fallbackOrder,
        20,
        0
      );
    }
  }

  return (
    <GoodResults
      initial={searchResults}
      total={allMatchingIds.length}
      allMatchingIds={allMatchingIds}
      matchingGoodIds={matchingGoodIds}
      branchId={branchId}
      query={query}
    />
  );
}

function SearchResultsLoading() {
  return (
    <section className='space-y-4'>
      <Skeleton className='w-1/2 h-[36px] rounded-full bg-[#F2F2F2]' />
      <section className='grid grid-cols-2 md:grid-cols-3 min-[1025px]:grid-cols-2 min-[1170px]:grid-cols-3 xl:grid-cols-4 gap-3'>
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton
            key={i}
            className='w-full h-full aspect-square rounded-2xl bg-[#F2F2F2]'
          />
        ))}
      </section>
    </section>
  );
}
