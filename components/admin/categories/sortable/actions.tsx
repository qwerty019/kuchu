"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { EditCategory } from "../category-actions";
import { Option } from "@/lib/definitions";
import { UniqueIdentifier } from "@dnd-kit/core";
import Link from "next/link";

export function Actions({
  id,
  route,
  categories,
}: {
  id: UniqueIdentifier;
  route: string;
  categories: Option[];
}) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type='button'
            variant='ghost'
            size='icon'
            className='w-8 h-8 text-muted-foreground'
          >
            <MoreHorizontal className='w-4 h-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-fit'>
          <DropdownMenuItem onClick={() => setEdit(true)}>
            Изменить
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/category/${route}`}>Перейти к категории</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href={`/admin/goods?category=${id}&page=1&limit=10`}>
              Перейти к товарам
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {edit && (
        <EditCategory
          id={Number(id)}
          open={edit}
          setOpen={setEdit}
          categories={categories}
        />
      )}
    </>
  );
}
