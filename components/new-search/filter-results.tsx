"use client";

import { useEffect } from "react";
import { Button } from "../ui/button";
import { CheckSquare, Settings2, Square, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMainStore } from "@/providers/main-store-provider";
import { FilterParam, GroupedFilter } from "@/lib/db/new-search/definitions";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "../ui/drawer";
import FilterList from "../right-side/filter-list";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export function FilterResults({ filters }: { filters: GroupedFilter[] }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const searchParams = useSearchParams();
  const filtersParam = searchParams.get("filters");
  const stock = searchParams.get("stock");

  const { setShowFilters, showFilters, setFilters } = useMainStore(
    (state) => state
  );

  useEffect(() => {
    setFilters(filters);
  }, [filters, setFilters]);

  // Get active filters from URL
  const activeFilters = getActiveFilters(filtersParam, filters);

  const stockUrl = getStockUrl(stock, searchParams);

  return (
    <div className='flex gap-2 items-center flex-wrap'>
      <Button
        variant='secondary'
        size='sm'
        className='rounded-full gap-2 bg-[#F4E6DE] hover:bg-[#F4E6DE]/80 text-xs'
        onClick={() => setShowFilters(!showFilters)}
      >
        <Settings2 className='w-4 h-4' />
        Все фильтры
      </Button>
      <Button
        variant='secondary'
        size='sm'
        className='rounded-full gap-2 bg-[#A03968] hover:bg-[#A03968]/80 text-xs text-white'
        asChild
      >
        <Link href={stockUrl}>
          {!stock ? (
            <CheckSquare className='w-4 h-4' />
          ) : (
            <Square className='w-4 h-4' />
          )}
          Только доступные
        </Link>
      </Button>
      {/* Display active filters */}
      {activeFilters.map((filter, index) => (
        <ActiveFilterBadge
          key={`${filter.type}-${filter.value}-${index}`}
          filter={filter}
          filtersParam={filtersParam}
        />
      ))}

      {!isDesktop && <FilterDrawer />}
    </div>
  );
}

// Component to display an active filter badge
const ActiveFilterBadge = ({
  filter,
  filtersParam,
}: {
  filter: { type: string; title: string; value: string };
  filtersParam: string | null;
}) => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const category = searchParams.get("category");

  // Create URL for removing this filter
  const removeFilterUrl = createRemoveFilterUrl(
    filtersParam,
    filter.type,
    filter.value,
    category,
    query
  );

  return (
    <Button
      variant='secondary'
      size='sm'
      className='rounded-full gap-1 bg-[#F4E6DE] hover:bg-[#F4E6DE]/80 text-xs'
      asChild
    >
      <Link href={removeFilterUrl}>
        {filter.title}: {filter.value}
        <X className='w-3 h-3 ml-1' />
      </Link>
    </Button>
  );
};

// Function to create a URL that removes a specific filter
const createRemoveFilterUrl = (
  filtersParam: string | null,
  filterType: string,
  valueToRemove: string,
  category: string | null,
  query: string | null
) => {
  const filterParams: FilterParam[] = filtersParam
    ? JSON.parse(filtersParam)
    : [];

  const newFilters = JSON.parse(JSON.stringify(filterParams));
  const existingIndex = newFilters.findIndex(
    (f: FilterParam) => f.type === filterType
  );

  if (existingIndex >= 0) {
    const values = [...newFilters[existingIndex].values];
    const valueIndex = values.indexOf(valueToRemove);

    if (valueIndex >= 0) {
      values.splice(valueIndex, 1);
    }

    if (values.length === 0) {
      newFilters.splice(existingIndex, 1);
    } else {
      newFilters[existingIndex].values = values;
    }
  }

  const queryParams = new URLSearchParams();

  if (query) {
    queryParams.set("query", query);
  }

  if (category) {
    queryParams.set("category", category);
  }

  if (newFilters.length > 0) {
    queryParams.set("filters", JSON.stringify(newFilters));
  }

  return `/search?${queryParams.toString()}`;
};

// Function to get active filters from URL
const getActiveFilters = (
  filtersParam: string | null,
  allFilters: GroupedFilter[]
) => {
  if (!filtersParam) return [];

  try {
    const filterParams = JSON.parse(filtersParam) as FilterParam[];
    const activeFilters: { type: string; title: string; value: string }[] = [];

    filterParams.forEach((param) => {
      const matchingFilter = allFilters.find((f) => f.type === param.type);

      if (matchingFilter) {
        param.values.forEach((value) => {
          activeFilters.push({
            type: param.type,
            title: matchingFilter.title,
            value: value,
          });
        });
      }
    });

    return activeFilters;
  } catch (e) {
    console.error("Failed to parse filters:", e);
    return [];
  }
};

const FilterDrawer = () => {
  const { showFilters, setShowFilters } = useMainStore((state) => state);

  return (
    <Drawer open={showFilters} onOpenChange={setShowFilters}>
      <DrawerContent className='max-h-[90vh] [&_.close-drawer]:hidden p-4 h-full'>
        <DrawerTitle className='text-left hidden'>Фильтры</DrawerTitle>
        <DrawerDescription className='text-xs leading-none text-left hidden'>
          Выберите фильтры для поиска
        </DrawerDescription>
        <FilterList />
      </DrawerContent>
    </Drawer>
  );
};

function getStockUrl(stock: string | null, searchParams: URLSearchParams) {
  const params = new URLSearchParams(searchParams);

  if (stock) {
    params.delete("stock");
  } else {
    params.set("stock", "false");
  }

  return `/search?${params.toString()}`;
}
