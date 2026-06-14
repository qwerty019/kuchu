"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function MapAlert({
  title,
  onClick,
  clicked,
  message,
  open,
  setOpen,
}: {
  title: string;
  onClick: () => void;
  clicked?: boolean;
  message?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className='sm:rounded-2xl'>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы точно уверены?</AlertDialogTitle>
          <AlertDialogDescription>{title}</AlertDialogDescription>
          {message && (
            <AlertDialogDescription className='text-destructive'>
              {message}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='rounded-full p-4 text-xs'>
            Отмена
          </AlertDialogCancel>
          <Button
            type='button'
            className='rounded-full bg-[#A03968] hover:bg-[#A03968] p-4 text-xs'
            onClick={onClick}
            disabled={clicked}
          >
            {clicked ? (
              <Loader2 className='animate-spin w-4 h-4' />
            ) : (
              "Подтвердить"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
