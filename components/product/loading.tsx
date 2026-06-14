"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import { Separator } from "../ui/separator";
import Upper from "../category/upper";

export default function Loading() {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <Dialog open={true}>
        <DialogContent className='sm:max-w-3xl w-full [&_.close-dialog]:hidden rounded-2xl sm:rounded-2xl h-full sm:h-[700px] flex flex-col'>
          <section className='flex gap-4 w-full h-full'>
            <div className='w-1/2 space-y-4'>
              <div className='w-full relative'>
                <Skeleton className='w-full h-auto aspect-square rounded-2xl' />
              </div>
            </div>
            <div className='w-1/2 flex flex-col'>
              <div className='font-semibold flex justify-between gap-2'>
                <div className='w-full space-y-1'>
                  <DialogTitle className='hidden text-lg'>
                    Название товара
                  </DialogTitle>
                  <DialogDescription className='hidden text-sm text-muted-foreground'>
                    Форма товара
                  </DialogDescription>
                  <Skeleton className='w-4/5 h-6' />
                  <Skeleton className='w-1/2 h-5' />
                </div>
                <Button
                  type='button'
                  variant='secondary'
                  className='p-0 w-8 h-8 flex items-center justify-center bg-[#F2F2F2] rounded-full shrink-0'
                >
                  <X className='w-4 h-4' />
                </Button>
              </div>
              <Separator className='my-4' />
              <div className='space-y-6'>
                <div className='text-sm space-y-1 font-medium'>
                  <Skeleton className='w-24 h-5' />
                  <Skeleton className='w-full h-5' />
                </div>
                <div className='text-sm space-y-1 font-medium'>
                  <Skeleton className='w-24 h-5' />
                  <Skeleton className='w-full h-5' />
                </div>
              </div>
              <Button
                className='w-full h-auto p-3 mt-auto bg-[#A03968] text-white hover:bg-[#A03968] flex items-center gap-2 rounded-full'
                disabled
              >
                Подождите...
              </Button>
            </div>
          </section>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <main className='relative main-page'>
      <div className='flex flex-col gap-4'>
        <Upper title='' />
        <Skeleton className='aspect-square w-full rounded-2xl' />
        <Skeleton className='h-5 w-1/2' />
        <Skeleton className='h-10 w-full rounded-full' />
        <Skeleton className='h-32 w-full rounded-2xl' />
      </div>
    </main>
  );
}
