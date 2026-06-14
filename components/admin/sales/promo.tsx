"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Promo } from "@/lib/db/promo/schema";
import { EditPromo } from "./promo-actions";

export default function Promo({ promo }: { promo: Promo }) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <Button
        className='p-0 h-auto relative w-[100px] aspect-[3/4] bg-accent rounded-xl hover:bg-accent/80'
        onClick={() => setEdit(true)}
      >
        <p className='absolute top-0 left-0 text-sm text-primary font-medium w-[100px] p-2 whitespace-pre-line text-left'>
          {promo.code}
        </p>
        <p className='absolute bottom-0 left-0 text-xs text-primary font-normal leading-none w-[100px] p-2 whitespace-pre-line text-left'>
          <span className='text-xl'>{promo.orderpromos.length}</span>
          <br />
          активаций
        </p>
      </Button>
      {edit && <EditPromo id={promo.id} open={edit} setOpen={setEdit} />}
    </>
  );
}
