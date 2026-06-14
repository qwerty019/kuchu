"use client";

import { useState } from "react";
import { FilterOption } from "@/lib/db/filterOption/schema";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { EditFilterOption } from "./option-actions";

export default function Option({ option }: { option: FilterOption }) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <div className='border rounded-2xl p-3 flex items-center justify-between gap-2'>
        <p className='text-sm font-medium'>{option.value}</p>
        <Button
          variant='outline'
          size='icon'
          className='w-8 h-8 rounded-xl shrink-0'
          onClick={() => setEdit(true)}
        >
          <Pencil className='w-4 h-4' />
        </Button>
      </div>
      {edit && (
        <EditFilterOption open={edit} setOpen={setEdit} option={option} />
      )}
    </>
  );
}
