"use client";

import { Button } from "@/components/ui/button";
import type { Filter } from "@/lib/db/filter/schema";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { EditFilter } from "./filter-actions";

export function Filter({ filter }: { filter: Filter }) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <div className='border rounded-2xl p-3 flex items-center justify-between gap-2'>
        <Link href={`/admin/filters/${filter.id}`} className='w-full'>
          <p className='text-sm font-medium'>{filter.title}</p>
        </Link>
        <Button
          variant='outline'
          size='icon'
          className='w-8 h-8 rounded-xl shrink-0'
          onClick={() => setEdit(true)}
        >
          <Pencil className='w-4 h-4' />
        </Button>
      </div>
      {edit && <EditFilter open={edit} setOpen={setEdit} filter={filter} />}
    </>
  );
}
