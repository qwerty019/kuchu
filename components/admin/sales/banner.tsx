"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditBanner } from "./banner-actions";
import { Option } from "@/lib/definitions";
import type { Banner } from "@/lib/db/banner/schema";

export default function Banner({
  banner,
  branches,
}: {
  banner: Banner;
  branches: Option[];
}) {
  const [edit, setEdit] = useState(false);

  return (
    <>
      <Button
        className='p-0 w-auto relative h-[133px] shrink-0 aspect-[16/9] bg-accent rounded-xl'
        onClick={() => setEdit(true)}
      >
        <div className='z-10 absolute inset-0 h-1/2 bg-gradient-to-b from-black/50 rounded-t-xl' />
        <Avatar className='w-full h-full rounded-xl'>
          <AvatarImage
            src={banner.img}
            alt={banner.title}
            className='w-full h-full object-cover rounded-xl'
          />
          <AvatarFallback className='w-full h-full rounded-xl' />
        </Avatar>
        <p className='z-10 absolute top-0 left-0 text-xs text-white font-medium w-auto p-2 whitespace-pre-line text-left'>
          {banner.title}
        </p>
      </Button>
      {edit && (
        <EditBanner
          id={banner.id}
          branches={branches}
          open={edit}
          setOpen={setEdit}
        />
      )}
    </>
  );
}
