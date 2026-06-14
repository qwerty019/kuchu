"use client";

import { Search } from "@/lib/db/search/schema";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Search>[] = [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => (
      <div className='w-fit mx-auto text-xs text-muted-foreground'>
        {row.index + 1}
      </div>
    ),
  },
  {
    accessorKey: "query",
    header: "Запрос",
    cell: ({ row }) => {
      const { query, createdAt } = row.original;

      return (
        <div className='w-fit'>
          <p className='font-medium text-sm'>{query}</p>
          <p className='text-xs text-muted-foreground'>
            {new Date(createdAt).toLocaleDateString("ru-RU", {
              day: "2-digit",
              month: "2-digit",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "user",
    header: "Пользователь",
    cell: ({ row }) => {
      const { name, surname, phone } = row.original.user || {};

      if (!row.original.user) return null;

      return (
        <div className='w-fit mx-auto text-xs truncate max-w-xs text-center'>
          <p className='truncate'>{phone}</p>
          {name || surname ? (
            <p className='text-xs text-muted-foreground'>
              {name} {surname}
            </p>
          ) : null}
        </div>
      );
    },
  },
];
