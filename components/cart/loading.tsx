"use client";

import { Loader2, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "../ui/drawer";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

export default function Loading() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={true}>
        <DialogContent className='sm:max-w-3xl w-full bg-[#F3F2F2] [&_.close-dialog]:hidden rounded-2xl sm:rounded-2xl h-[748px] flex flex-col'>
          <div className='flex items-center justify-between gap-2 w-full h-fit'>
            <div>
              <DialogTitle className='font-semibold text-base'>
                Время для здоровья – сейчас
              </DialogTitle>
              <DialogDescription className='text-xs text-muted-foreground hidden'>
                Подзаголовок
              </DialogDescription>
            </div>
            <Button
              type='button'
              variant='secondary'
              className='p-2 flex bg-white items-center justify-center rounded-full h-auto'
            >
              <X className='w-4 h-4' />
            </Button>
          </div>
          <section className='bg-[#F3F2F2] flex gap-4 h-full'>
            <section
              className={cn(
                "flex flex-col flex-1 bg-background rounded-2xl gap-4",
                isDesktop ? "p-4" : "py-4 mb-4"
              )}
            >
              <p className={cn("font-semibold text-lg", !isDesktop && "px-4")}>
                Добавить к заказу?
              </p>
              <section
                className={cn(
                  isDesktop
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
                    : "flex gap-2 overflow-x-auto scrollbar-hide px-4"
                )}
              >
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className='space-y-1.5'>
                    <Skeleton
                      className={cn(
                        "w-full h-auto aspect-square rounded-2xl",
                        !isDesktop ? "w-[120px] h-[120px]" : "w-full h-auto"
                      )}
                    />
                    <Skeleton className='w-4/5 h-3 rounded-full' />
                    <Skeleton className='w-3/5 h-3 rounded-full' />
                    <Skeleton className='w-2/3 h-8 rounded-full' />
                  </div>
                ))}
              </section>
            </section>
            <div className='bg-background p-4 flex flex-col justify-between gap-4 rounded-2xl w-full md:w-[300px]'>
              <div className='flex flex-col gap-4 h-full max-h-[300px] overflow-y-auto scrollbar-hide'>
                <Skeleton className='h-[66px]' />
                <Skeleton className='h-[66px]' />
              </div>
              <div className='space-y-2 text-xs mt-auto'>
                <div className='flex justify-between items-center'>
                  <p className='font-semibold text-lg'>Итого</p>
                  <Skeleton className='w-20 h-6' />
                </div>
                <Button
                  className='w-full rounded-full bg-[#A03968] hover:bg-[#A03968] p-6 text-xs'
                  disabled
                >
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Подождите...
                </Button>
              </div>
            </div>
          </section>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={true}>
      <DrawerContent className='h-[90vh] [&_.close-drawer]:hidden overflow-hidden bg-[#F3F2F2]'>
        <div className='flex items-center justify-between gap-2 p-4'>
          <Button
            variant='link'
            className='flex flex-col items-start h-full w-full p-0 truncate gap-1'
          >
            <div className='flex items-center gap-2'>
              <DrawerTitle className='text-sm'>
                Время для здоровья – сейчас
              </DrawerTitle>
            </div>
            <DrawerDescription className='text-muted-foreground text-xs hidden'>
              Корзина
            </DrawerDescription>
          </Button>
          <DrawerClose asChild>
            <Button
              type='button'
              variant='secondary'
              className='p-0 w-8 h-8 flex items-center justify-center bg-background rounded-full shrink-0'
            >
              <X className='w-4 h-4' />
            </Button>
          </DrawerClose>
        </div>
        <div className='overflow-y-auto scrollbar-hide'>
          <section className='bg-[#F3F2F2] flex flex-col gap-4 h-full'>
            <div className='bg-background p-4 flex flex-col justify-between gap-4 rounded-2xl w-full md:w-[300px]'>
              <div className='flex flex-col gap-4 h-full max-h-[300px] overflow-y-auto scrollbar-hide'>
                <Skeleton className='h-[66px]' />
                <Skeleton className='h-[66px]' />
              </div>
            </div>
            <section
              className={cn(
                "flex flex-col flex-1 bg-background rounded-2xl gap-4",
                isDesktop ? "p-4" : "py-4 mb-4"
              )}
            >
              <p className={cn("font-semibold text-lg", !isDesktop && "px-4")}>
                Добавить к заказу?
              </p>
              <section
                className={cn(
                  isDesktop
                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
                    : "flex gap-2 overflow-x-auto scrollbar-hide px-4"
                )}
              >
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className='space-y-1.5'>
                    <Skeleton
                      className={cn(
                        "w-full h-auto aspect-square rounded-2xl",
                        !isDesktop ? "w-[120px] h-[120px]" : "w-full h-auto"
                      )}
                    />
                    <Skeleton className='w-4/5 h-3 rounded-full' />
                    <Skeleton className='w-3/5 h-3 rounded-full' />
                    <Skeleton className='w-2/3 h-8 rounded-full' />
                  </div>
                ))}
              </section>
            </section>
            <div className='h-[190px] shrink-0 w-full' />
            <div className='p-4 fixed inset-x-0 bottom-0 z-50 bg-white border-t rounded-t-[10px]'>
              <div className='space-y-2 text-xs mt-auto'>
                <div className='flex justify-between items-center'>
                  <p className='font-semibold text-lg'>Итого</p>
                  <Skeleton className='w-16 h-6' />
                </div>
                <Button
                  className='w-full rounded-full bg-[#A03968] hover:bg-[#A03968] p-6 text-xs'
                  disabled
                >
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Подождите...
                </Button>
              </div>
            </div>
          </section>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
