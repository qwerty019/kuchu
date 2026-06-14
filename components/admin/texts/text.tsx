"use client";

import { Button } from "@/components/ui/button";
import { NavText } from "@/lib/db/navtext/schema";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { EditNavText } from "./text-actions";

export function Text({ text }: { text: NavText }) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <div className='relative w-full border rounded-xl p-2 flex items-center justify-between'>
        <div>
          <p className='text-sm'>{text.text}</p>
          {!text.show && <p className='text-xs text-muted-foreground'>Скрыт</p>}
        </div>
        <Button
          type='button'
          variant='outline'
          size='icon'
          className='h-8 w-8 shrink-0'
          onClick={() => setEdit(true)}
        >
          <Pencil className='w-4 h-4' />
        </Button>
      </div>
      {edit && <EditNavText open={edit} setOpen={setEdit} navText={text} />}
    </>
  );
}
