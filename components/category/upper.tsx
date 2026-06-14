"use client";

import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function Upper({ title }: { title: string }) {
  const router = useRouter();

  return (
    <section className='flex justify-between items-center'>
      <div className='w-full flex gap-4 items-center justify-between lg:justify-start'>
        <Button
          variant='secondary'
          className='bg-[#F2F2F2] flex items-center justify-center rounded-full lg:rounded-xl'
          onClick={() => router.back()}
        >
          <ArrowLeft className='w-4 h-4' />
        </Button>
        <h1 className='text-center lg:text-left leading-none w-full scroll-m-20 font-semibold text-sm lg:text-2xl lg:font-bold tracking-tight'>
          {title}
        </h1>
        <Button
          variant='secondary'
          className='bg-[#F2F2F2] lg:hidden flex items-center justify-center rounded-full lg:rounded-xl opacity-0'
          asChild
        >
          <Link href='/search'>
            <SearchIcon className='w-4 h-4' />
          </Link>
        </Button>
      </div>
    </section>
  );
}
