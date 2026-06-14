"use client";

import { Home } from "lucide-react";
import { useState } from "react";
import { BranchInCity } from "@/lib/db/branch/schema";
import { EditBranch } from "./branch-actions";

export default function Branch({
  branch,
  goods,
  osts,
}: {
  branch: BranchInCity;
  goods: number;
  osts: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <section
        className='relative border rounded-xl h-52 overflow-hidden cursor-pointer'
        onClick={() => setOpen(true)}
      >
        <div className='absolute bottom-0 h-[60%] bg-accent w-full p-4 space-y-4'>
          <div>
            <div className='flex items-center gap-2'>
              <p className='text-base font-medium'>{branch.title}</p>
              {branch.main && (
                <Home className='w-4 h-4 text-muted-foreground' />
              )}
            </div>
            <p className='text-xs text-muted-foreground'>
              {branch.fbId || "Без ID"}
            </p>
          </div>
          <div className='flex gap-4'>
            <div>
              <p className='text-lg leading-none font-medium'>{goods}</p>
              <p className='text-xs text-muted-foreground'>Товаров</p>
            </div>
            <div>
              <p className='text-lg leading-none font-medium'>{osts}</p>
              <p className='text-xs text-muted-foreground'>Остатков</p>
            </div>
          </div>
        </div>
      </section>
      <EditBranch id={branch.id} open={open} setOpen={setOpen} />
    </>
  );
}
