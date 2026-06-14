"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ArrowLeft, MenuIcon } from "lucide-react";
import CategoryLinks from "../left-side/category-links";
import { useMainStore } from "@/providers/main-store-provider";

export default function NavSheet() {
  const { sheetOpen, setSheetOpen } = useMainStore((state) => state);

  return (
    <SheetWrapper
      open={sheetOpen}
      setOpen={setSheetOpen}
      trigger={
        <Button className='lg:hidden p-0 w-10 h-10 text-[#A03968] bg-[#F2F2F2] hover:bg-[#F2F2F2]/80 rounded-full shrink-0'>
          <MenuIcon className='w-5 h-5' />
        </Button>
      }
    >
      <SheetHeader className='space-y-0 flex flex-row items-center gap-2'>
        <SheetClose asChild>
          <Button
            variant='secondary'
            className='bg-[#F2F2F2] flex items-center justify-center rounded-full w-12 h-10 p-0 shrink-0'
          >
            <ArrowLeft className='w-4 h-4' />
          </Button>
        </SheetClose>
        <SheetTitle>Категории</SheetTitle>
        <SheetDescription className='hidden'>Категории</SheetDescription>
      </SheetHeader>
      <CategoryLinks setOpen={setSheetOpen} />
    </SheetWrapper>
  );
}

function SheetWrapper({
  children,
  open,
  setOpen,
  trigger,
}: {
  children: React.ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  trigger: React.ReactNode;
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent className='[&_.close-dialog]:hidden p-4 flex flex-col gap-6 w-full sm:max-w-none'>
        {children}
      </SheetContent>
    </Sheet>
  );
}
