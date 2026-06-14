"use client";

import { cn } from "@/lib/utils";
import HorizontalScroll from "./horizontal-scroll";
import { Button } from "../ui/button";
import Link from "next/link";
import { X } from "lucide-react";
import { CategoryCount, FilterParam } from "@/lib/db/new-search/definitions";

export function CategoryResults({
  categories,
  categoryId,
  query,
  filterParams,
}: {
  categories: CategoryCount[];
  query: string;
  filterParams: FilterParam[];
  categoryId?: string;
}) {
  return (
    <HorizontalScroll>
      {categories.map((cat) => {
        const isActive = categoryId === (cat.id?.toString() || "no-category");

        const link = `/search?query=${encodeURIComponent(query)}&category=${
          cat.id === null ? "no-category" : cat.id
        }${
          filterParams.length > 0
            ? `&filters=${encodeURIComponent(JSON.stringify(filterParams))}`
            : ""
        }`;

        const all = `/search?query=${encodeURIComponent(query)}${
          filterParams.length > 0
            ? `&filters=${encodeURIComponent(JSON.stringify(filterParams))}`
            : ""
        }`;

        return (
          <Button
            type='button'
            key={cat.id || "no-category"}
            variant='secondary'
            size='sm'
            className={cn(
              "shrink-0 rounded-full gap-2 text-xs bg-[#F2F2F2] hover:bg-[#F2F2F2]/80",
              isActive && "bg-[#F4E6DE] hover:bg-[#F4E6DE]/80"
            )}
            asChild
          >
            <Link href={isActive ? all : link}>
              <p>{cat.title}</p>
              {isActive ? (
                <X className='w-3 h-3 shrink-0' />
              ) : (
                <p className='text-muted-foreground'>{cat.count}</p>
              )}
            </Link>
          </Button>
        );
      })}
    </HorizontalScroll>
  );
}
