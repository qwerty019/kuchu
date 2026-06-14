"use client";

import { Badge } from "@/components/ui/badge";
import { SearchExclusion } from "@/lib/db/searchExclusion/schema";
import { useState } from "react";
import { EditExclution } from "./exclution-actions";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";

export function Exclution({ exclution }: { exclution: SearchExclusion }) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <li className='border rounded-xl p-3 flex gap-2 items-center justify-between'>
        <div className='flex flex-col gap-2'>
          <p className='text-sm font-medium'>{exclution.query}</p>
          <div className='flex gap-1 flex-wrap'>
            {exclution.list.map((item) => (
              <Badge
                variant='secondary'
                key={item}
                className='text-xs font-normal'
              >
                {item}
              </Badge>
            ))}
          </div>
        </div>
        <Button
          variant='outline'
          size='icon'
          className='w-8 h-8 shrink-0 rounded-xl'
          onClick={() => setEdit(true)}
        >
          <Pencil className='w-4 h-4' />
        </Button>
      </li>
      {edit && (
        <EditExclution exclution={exclution} open={edit} setOpen={setEdit} />
      )}
    </>
  );
}
