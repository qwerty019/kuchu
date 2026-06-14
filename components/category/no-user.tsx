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
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function NoUser({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent className='sm:rounded-2xl'>
        <AlertDialogHeader>
          <AlertDialogTitle>Авторизация</AlertDialogTitle>
          <AlertDialogDescription>
            Для добавления товара в избранное необходимо авторизоваться.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='rounded-full p-4 text-xs'>
            Отмена
          </AlertDialogCancel>
          <Button
            type='button'
            className='rounded-full bg-[#A03968] hover:bg-[#A03968] p-4 text-xs'
            asChild
          >
            <Link href='/login'>Войти</Link>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
