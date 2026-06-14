"use client";

import {
  Dialog as DialogUI,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../drawer";

export default function Dialog({
  title,
  open: externalOpen,
  setOpen: externalSetOpen,
  trigger,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  trigger?: React.ReactNode;
  className?: string;
}) {
  const [internalOpen, setInternalOpen] = useState(false);

  const open = externalOpen !== undefined ? externalOpen : internalOpen;
  const setOpen = externalSetOpen || setInternalOpen;

  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isDesktop) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
        <DrawerContent
          className={cn(
            "[&_.close-drawer]:hidden max-w-sm sm:rounded-2xl",
            className
          )}
        >
          <DrawerHeader className='flex flex-row space-y-0 items-center justify-between gap-2'>
            <div>
              <DrawerTitle>{title}</DrawerTitle>
              <DrawerDescription className='hidden'>
                Подзаголовок
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button
                type='button'
                variant='secondary'
                className='close-button p-0 w-8 h-8 flex items-center justify-center bg-[#F2F2F2] rounded-full shrink-0'
              >
                <X className='w-4 h-4' />
              </Button>
            </DrawerClose>
          </DrawerHeader>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <DialogUI open={open} onOpenChange={setOpen}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent
        className={cn(
          "[&_.close-dialog]:hidden max-w-sm sm:rounded-2xl",
          className
        )}
      >
        <DialogHeader className='flex flex-row space-y-0 items-center justify-between gap-2'>
          <div>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className='hidden'>
              Подзаголовок
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button
              type='button'
              variant='secondary'
              className='close-button p-0 w-8 h-8 flex items-center justify-center bg-[#F2F2F2] rounded-full shrink-0'
            >
              <X className='w-4 h-4' />
            </Button>
          </DialogClose>
        </DialogHeader>
        {children}
      </DialogContent>
    </DialogUI>
  );
}
