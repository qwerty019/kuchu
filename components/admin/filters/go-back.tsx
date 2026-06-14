"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function GoBack() {
  const router = useRouter();

  return (
    <Button
      variant='secondary'
      className='bg-[#F2F2F2] flex items-center justify-center rounded-full lg:rounded-xl'
      onClick={() => router.back()}
    >
      <ArrowLeft className='w-4 h-4' />
    </Button>
  );
}
