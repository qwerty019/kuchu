import { useMainStore } from "@/providers/main-store-provider";
import { Button } from "../ui/button";
import { Check, X } from "lucide-react";
import { FilterParam, GroupedFilter } from "@/lib/db/new-search/definitions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function FilterList() {
  const searchParams = useSearchParams();
  const filtersParams = searchParams.get("filters");

  const [value, setValue] = useState<string>("");

  const { filters, setShowFilters } = useMainStore((state) => state);

  const filterParams = getFilterParams(filtersParams);
  const currentFilters = getCurrentFilters(filterParams);

  return (
    <div className='flex flex-col gap-4 h-full'>
      <div className='flex items-center justify-center relative h-8'>
        <Button
          type='button'
          variant='secondary'
          className='absolute left-0 top-0 p-0 w-8 h-8 flex items-center justify-center bg-[#F2F2F2] rounded-full shrink-0'
          onClick={() => setShowFilters(false)}
        >
          <X className='w-4 h-4' />
        </Button>
        <h4 className='scroll-m-20 text-xl font-bold text-center'>Фильтры</h4>
      </div>
      <Accordion
        type='single'
        collapsible
        className='w-full space-y-1 overflow-y-auto h-full'
        value={value}
        onValueChange={setValue}
      >
        {filters.map((filter) => (
          <FilterItem
            key={filter.id}
            filter={filter}
            value={value}
            currentFilters={currentFilters}
            filterParams={filterParams}
          />
        ))}
      </Accordion>
    </div>
  );
}

const FilterItem = ({
  filter,
  value,
  currentFilters,
  filterParams,
}: {
  filter: GroupedFilter;
  value: string;
  currentFilters: Map<string, string[]>;
  filterParams: FilterParam[];
}) => {
  const searchParams = useSearchParams();

  const query = searchParams.get("query");
  const category = searchParams.get("category");

  return (
    <AccordionItem value={filter.type} className='border-none'>
      <AccordionTrigger
        className={`bg-[#F5F5F5] rounded-t-2xl py-2 px-4 hover:no-underline hover:bg-[#F5F5F5]/80 text-sm font-normal ${
          value === filter.type ? "" : "rounded-b-2xl"
        }`}
      >
        <p className='text-sm font-normal'>
          {filter.title}
          {currentFilters.get(filter.type)?.length && (
            <span className='text-xs text-muted-foreground'>
              {` · ${currentFilters.get(filter.type)?.length}`}
            </span>
          )}
        </p>
      </AccordionTrigger>
      <AccordionContent className='px-4 pt-2 pb-4 bg-[#F5F5F5] rounded-b-2xl flex flex-col gap-3 items-start'>
        {filter.options.map((option, index) => {
          const isActive =
            currentFilters.get(filter.type)?.includes(option.value) || false;

          return (
            <Button
              key={index}
              variant='link'
              className='text-sm font-medium p-0 h-auto whitespace-pre-wrap text-left gap-2 w-full justify-start'
              asChild
            >
              <Link
                key={option.value}
                href={createFilterUrl(
                  filterParams,
                  filter.type,
                  option.value,
                  isActive,
                  category,
                  query
                )}
              >
                <Check
                  className={`w-4 h-4 shrink-0 ${isActive ? "" : "opacity-0"}`}
                />
                <p>{option.value}</p>
              </Link>
            </Button>
          );
        })}
      </AccordionContent>
    </AccordionItem>
  );
};

function getCurrentFilters(filterParams: FilterParam[]) {
  const currentFilters = new Map<string, string[]>();

  for (const param of filterParams) {
    currentFilters.set(param.type, param.values);
  }

  return currentFilters;
}

function getFilterParams(filters: string | null) {
  let filterParams: FilterParam[] = [];

  if (filters) {
    try {
      filterParams = JSON.parse(filters) as FilterParam[];
    } catch (e) {
      console.error("Failed to parse filters:", e);
    }
  }

  return filterParams;
}

const createFilterUrl = (
  filterParams: FilterParam[],
  filterType: string,
  value: string,
  isActive: boolean,
  category: string | null,
  query: string | null
) => {
  const newFilters = JSON.parse(JSON.stringify(filterParams));
  const existingIndex = newFilters.findIndex(
    (f: FilterParam) => f.type === filterType
  );

  if (existingIndex >= 0) {
    const values = [...newFilters[existingIndex].values];

    if (isActive) {
      const valueIndex = values.indexOf(value);
      if (valueIndex >= 0) {
        values.splice(valueIndex, 1);
      }
    } else {
      values.push(value);
    }

    if (values.length === 0) {
      newFilters.splice(existingIndex, 1);
    } else {
      newFilters[existingIndex].values = values;
    }
  } else if (!isActive) {
    newFilters.push({
      type: filterType,
      values: [value],
    });
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
