"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function DialogWrapper({
  title,
  open,
  setOpen,
  trigger,
  children,
  className,
}: {
  title: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
  trigger?: React.ReactNode;
  className?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
    </Dialog>
  );
}
