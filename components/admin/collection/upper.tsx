"use client";

import { Button } from "@/components/ui/button";
import { CollectionWithGoods } from "@/lib/db/collection/schema";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Upper({
  collection,
}: {
  collection: CollectionWithGoods;
}) {
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
          {collection.title}
        </h1>
      </div>
    </section>
  );
}
