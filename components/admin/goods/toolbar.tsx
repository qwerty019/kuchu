"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, Circle, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { DataTableFacetedFilter } from "./faceted-filter";
import { Option } from "@/lib/definitions";

export function Toolbar({ categories }: { categories: Option[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");
    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }
    router.replace(`/admin/goods?${params.toString()}`);
  }, 300);

  const hidden = searchParams.get("hidden");
  const category = searchParams.get("category");
  const query = searchParams.get("query");

  function handleHidden() {
    if (hidden) {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      params.delete("hidden");
      router.push(`/admin/goods?${params.toString()}`);
      return;
    } else {
      const params = new URLSearchParams(searchParams);
      params.set("page", "1");
      params.set("hidden", "true");
      router.push(`/admin/goods?${params.toString()}`);
    }
  }

  return (
    <div className='flex flex-wrap items-center gap-2'>
      <Input
        name='drug'
        placeholder='Фильтр по названию...'
        onChange={(e) => handleSearch(e.target.value)}
        defaultValue={query?.toString()}
        className='h-8 w-[150px] lg:w-[250px] rounded-full'
      />
      <DataTableFacetedFilter title='Категория' options={categories} />
      <Button
        variant='outline'
        size='sm'
        className='h-8 border-dashed'
        onClick={handleHidden}
      >
        {hidden ? (
          <CheckCircle className='mr-2 h-4 w-4' />
        ) : (
          <Circle className='mr-2 h-4 w-4' />
        )}
        Скрытые
      </Button>
      {(query || category || hidden) && (
        <Button
          variant='ghost'
          onClick={() => {
            const params = new URLSearchParams(searchParams);
            params.set("page", "1");
            params.delete("query");
            router.replace(`/admin/goods?${params.toString()}`);
          }}
          className='h-8 px-2 lg:px-3 rounded-full'
        >
          Очистить
          <X className='ml-2 h-4 w-4' />
        </Button>
      )}
    </div>
  );
}
