"use client";

import { ColumnDef } from "@tanstack/react-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { GoodAdmin } from "@/lib/db/good/schema";
import { Option } from "@/lib/definitions";

export const columns: ColumnDef<GoodAdmin>[] = [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => (
      <div className='w-fit mx-auto text-xs text-muted-foreground'>
        {row.index + 1}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "drug",
    header: "Название",
    cell: ({ row }) => {
      const { drug, form, title, subtitle } = row.original;

      return (
        <div className='w-fit'>
          <p className='font-medium text-sm'>{title ?? drug}</p>
          <p className='text-muted-foreground text-xs'>{subtitle ?? form}</p>
          {title && <p className='text-muted-foreground text-xs'>*{drug}</p>}
          {subtitle && <p className='text-muted-foreground text-xs'>*{form}</p>}
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Категория",
    cell: ({ row }) => {
      return (
        <div className='w-fit mx-auto text-xs truncate max-w-xs'>
          <p className='truncate'>{row.original.category?.title}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "hidden",
    header: "Скрыт",
    cell: ({ row }) => {
      const { isHidden } = row.original;

      if (!isHidden) return null;

      return (
        <div className='w-fit mx-auto text-xs truncate max-w-xs'>
          <p className='truncate'>Скрыто</p>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const { setGoods, categories } = table.options.meta as {
        setGoods: React.Dispatch<React.SetStateAction<GoodAdmin[]>>;
        categories: Option[];
      };

      return (
        <div className='w-fit mx-auto'>
          <DataTableRowActions
            good={row.original}
            setGoods={setGoods}
            categories={categories}
          />
        </div>
      );
    },
  },
];
