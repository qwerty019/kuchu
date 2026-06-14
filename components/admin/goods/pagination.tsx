"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export function Pagination({
  count,
  limit,
  page,
}: {
  count: number;
  limit: number;
  page: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div className='flex items-center justify-between px-2'>
      <div className='flex-1 text-sm text-muted-foreground'></div>
      <div className='flex items-center space-x-6 lg:space-x-8'>
        <div className='flex items-center space-x-2'>
          <p className='text-sm font-medium'>Строк на стр.</p>
          <Select
            value={`${limit}`}
            onValueChange={(value) => {
              const params = new URLSearchParams(searchParams);
              params.set("limit", value);
              params.set("page", "1");
              router.replace(`/admin/goods?${params.toString()}`);
            }}
          >
            <SelectTrigger className='h-8 w-[80px]'>
              <SelectValue placeholder={limit} />
            </SelectTrigger>
            <SelectContent side='top'>
              {Array.from(new Set([10, 20, 30, 40, 50, 100, limit]))
                .sort((a, b) => a - b)
                .map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex w-fit items-center justify-center text-sm font-medium'>
          Стр. {page} из {Math.ceil(count / limit)}
        </div>
        <div className='flex items-center space-x-2'>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              params.set("page", "1");
              router.replace(`/admin/goods?${params.toString()}`);
            }}
            disabled={page <= 1}
          >
            <span className='sr-only'>Go to first page</span>
            <ChevronsLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              const value = page - 1;
              params.set("page", `${value}`);
              router.replace(`/admin/goods?${params.toString()}`);
            }}
            disabled={page <= 1}
          >
            <span className='sr-only'>Go to previous page</span>
            <ChevronLeftIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='h-8 w-8 p-0'
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              const value = page + 1;
              params.set("page", `${value}`);
              router.replace(`/admin/goods?${params.toString()}`);
            }}
            disabled={page >= Math.ceil(count / limit)}
          >
            <span className='sr-only'>Go to next page</span>
            <ChevronRightIcon className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            className='hidden h-8 w-8 p-0 lg:flex'
            onClick={() => {
              const params = new URLSearchParams(searchParams);
              const value = Math.ceil(count / limit);
              params.set("page", `${value}`);
              router.replace(`/admin/goods?${params.toString()}`);
            }}
            disabled={page >= Math.ceil(count / limit)}
          >
            <span className='sr-only'>Go to last page</span>
            <ChevronsRightIcon className='h-4 w-4' />
          </Button>
        </div>
      </div>
    </div>
  );
}
