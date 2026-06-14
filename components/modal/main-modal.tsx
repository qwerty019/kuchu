"use client";

import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { ChevronLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function MainModal({
  children,
  title,
  isBackButton,
  className,
  path,
}: {
  children: ReactNode;
  title: string;
  isBackButton?: boolean;
  className?: string;
  path?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();

  function onDismiss() {
    if (path === "/login") {
      router.push("/");
      return;
    }
    if (window.history.length <= 2) {
      router.push("/");
    } else {
      router.back();
    }
  }

  if (path && pathname !== path) {
    return null;
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(b) => {
        if (!b) onDismiss();
      }}
    >
      <DialogContent
        className={cn(
          "sm:max-w-[425px] [&_.close-dialog]:hidden rounded-2xl sm:rounded-2xl",
          className
        )}
      >
        <div className='flex items-center justify-between w-full h-fit'>
          <Button
            variant='secondary'
            className={`${
              isBackButton ? "" : "opacity-0"
            } p-2 flex items-center justify-center bg-accent rounded-full h-auto`}
            onClick={isBackButton ? onDismiss : undefined}
          >
            <ChevronLeft className='w-4 h-4' />
          </Button>
          <DialogTitle className='font-medium text-xs'>{title}</DialogTitle>
          <DialogDescription className='hidden'>Description</DialogDescription>
          <Button
            type='button'
            variant='secondary'
            className='p-2 flex items-center justify-center bg-accent rounded-full h-auto'
            onClick={onDismiss}
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}
