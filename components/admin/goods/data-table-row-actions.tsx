"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import React, { useState } from "react";
import { GoodAdmin } from "@/lib/db/good/schema";
import GoodContents from "./good-contents";
import GoodFilters from "./good-filters";
import { EditGood } from "./good-actions";
import { Option } from "@/lib/definitions";
import { RlsImport } from "./rls-import";
import Link from "next/link";

interface DataTableRowActionsProps {
  good: GoodAdmin;
  setGoods: React.Dispatch<React.SetStateAction<GoodAdmin[]>>;
  categories: Option[];
}

export function DataTableRowActions({
  good,
  setGoods,
  categories,
}: DataTableRowActionsProps) {
  const [edit, setEdit] = useState(false);
  const [showContents, setShowContents] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showRlsImport, setShowRlsImport] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem asChild>
            <Link href={`/product/${good.regId}`} target='_blank'>
              Открыть в новой вкладке
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setEdit(true)}>
            Изменить
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowContents(true)}>
            Описания
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowFilters(true)}>
            Фильтры
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowRlsImport(true)}>
            Импорт RLS
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {edit && (
        <EditGood
          open={edit}
          setOpen={setEdit}
          good={good}
          setGoods={setGoods}
          categories={categories}
        />
      )}
      {showContents && (
        <GoodContents
          id={good.id}
          open={showContents}
          setOpen={setShowContents}
        />
      )}
      {showFilters && (
        <GoodFilters id={good.id} open={showFilters} setOpen={setShowFilters} />
      )}
      {showRlsImport && (
        <RlsImport
          good={good}
          open={showRlsImport}
          setOpen={setShowRlsImport}
        />
      )}
    </>
  );
}
