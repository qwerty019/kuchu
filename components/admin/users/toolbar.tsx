"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";

export function Toolbar() {
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
    router.replace(`/admin/users?${params.toString()}`);
  }, 300);

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        <Input
          name='drug'
          placeholder='Фильтр по номеру...'
          onChange={(e) => handleSearch(e.target.value)}
          defaultValue={searchParams.get("query")?.toString()}
          className='h-8 w-[150px] lg:w-[250px] rounded-full'
        />

        {searchParams.get("query") && (
          <Button
            variant='ghost'
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("page", "1");
              params.delete("query");
              router.replace(`/admin/users?${params.toString()}`);
            }}
            className='h-8 px-2 lg:px-3'
          >
            Очистить
            <X className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  );
}
