"use client";

import { Button } from "../../ui/button";
import { ImageOff, Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useState } from "react";
import { AddCert } from "../../certificate/add-cert";
import { CertOption } from "@/lib/db/certoption/schema";

export default function Certificate({ option }: { option: CertOption }) {
  const [open, setOpen] = useState(false);

  return (
    <div className='space-y-1.5'>
      <div className='w-full block relative'>
        <Avatar className='w-full h-auto aspect-square rounded-2xl'>
          <AvatarImage
            src={option.url || getImageUrl(option.nominal) || undefined}
            alt={option.title || "Сертификат"}
            className='aspect-auto object-contain h-full bg-[#F2F2F2] rounded-2xl p-[15%]'
          />
          <AvatarFallback className='rounded-2xl text-muted-foreground bg-[#F2F2F2]'>
            <ImageOff className='w-8 h-8' />
          </AvatarFallback>
        </Avatar>
      </div>
      <div className='block text-xs font-semibold'>
        <p>{option.title || `Идеальный подарок на ${option.nominal}`}</p>
        <p className='text-muted-foreground'>Эко-сертификат</p>
      </div>
      <Button
        onClick={() => setOpen(true)}
        className='w-fit h-auto flex items-center gap-1 text-[#A03968] rounded-full bg-[#F2F2F2] hover:bg-[#F2F2F2] py-1 pl-3 pr-3'
      >
        <p className='font-semibold text-sm'>{option.nominal} ₽</p>
        <Plus className='w-4 h-4' />
      </Button>
      {open && (
        <AddCert open={open} nominal={option.nominal} setOpen={setOpen} />
      )}
    </div>
  );
}

function getImageUrl(nominal: number) {
  switch (nominal) {
    case 5000:
      return "/images/cert-5000.png";
    case 3000:
      return "/images/cert-3000.png";
    case 2000:
      return "/images/cert-2000.png";
    case 1000:
      return "/images/cert-1000.png";
    default:
      return "/images/cert-500.png";
  }
}
