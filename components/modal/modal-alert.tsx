"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";

export default function ModalAlert({
  title,
  onClick,
  children,
  clicked,
  message,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
  clicked?: boolean;
  message?: string;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
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
