"use client";

import { useState } from "react";
import { DataTable } from "./data-table";
import { Button } from "@/components/ui/button";
import { getSearchs } from "@/lib/db/search/data";
import { toast } from "sonner";
import { Search } from "@/lib/db/search/schema";
import { columns } from "./columns";

export default function List({
  searchs,
  count,
}: {
  searchs: Search[];
  count: number;
}) {
  const [arr, setArr] = useState<Search[]>(searchs);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (loading) return;
    if (arr.length >= count) return;

    setLoading(true);

    try {
      const newArr = await getSearchs({ page: page + 1, limit: 50 });
      setArr((prev) => [...prev, ...newArr]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      toast.error("Ошибка при загрузке поисковых запросов.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='space-y-4'>
      <DataTable data={arr} columns={columns} />
      <div className='flex items-center justify-center flex-col gap-1'>
        <Button
          variant='outline'
          size='sm'
          className='mx-auto rounded-full text-xs h-8'
          onClick={loadMore}
          disabled={loading}
        >
          {loading ? "Загружается..." : "Загрузить еще"}
        </Button>
        <p className='text-xs text-muted-foreground text-center'>
          {arr.length} запросов из {count}
        </p>
      </div>
    </div>
  );
}
