"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Upper({ title }: { title: string }) {
  const router = useRouter();

  const handleButtonClick = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <div className='flex justify-between items-center mt-4'>
      <div className='w-full flex gap-4 items-center'>
        <Button
          variant='secondary'
          className='bg-[#F2F2F2] flex items-center justify-center rounded-full lg:rounded-xl'
          onClick={handleButtonClick}
        >
          <ArrowLeft className='w-4 h-4' />
        </Button>
        <h1 className='leading-none w-full scroll-m-20 font-semibold text-lg lg:text-2xl lg:font-bold tracking-tight'>
          {title}
        </h1>
      </div>
    </div>
  );
}
