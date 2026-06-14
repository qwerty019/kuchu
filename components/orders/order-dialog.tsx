"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer";
import Thanks from "../cart/ordering/thanks";
import OrderGoods from "./order-goods";
import { useMemo } from "react";
import { useMainStore } from "@/providers/main-store-provider";

export default function OrderDialog() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const { orders, orderIndex, setShowDialog } = useMainStore((state) => state);

  const order = useMemo(() => orders[orderIndex], [orders, orderIndex]);

  if (isDesktop) {
    return (
      <DialogWrapper>
        <section className='bg-[#F3F2F2] flex gap-4 h-[652px]'>
          <Thanks order={order} setOpen={setShowDialog} />
          <OrderGoods className='w-[300px]' hideButtons />
        </section>
      </DialogWrapper>
    );
  }

  return (
    <DrawerWrapper>
      <div className='overflow-y-auto scrollbar-hide'>
        <section className='bg-[#F3F2F2] flex flex-col gap-4 h-full'>
          <Thanks order={order} setOpen={setShowDialog} hideMainButton />
          <OrderGoods className='w-full' hideButtons />
        </section>
      </div>
    </DrawerWrapper>
  );
}

function DrawerWrapper({ children }: { children: React.ReactNode }) {
  const { setShowDialog, showDialog } = useMainStore((state) => state);

  return (
    <Drawer open={showDialog} onOpenChange={setShowDialog}>
      <DrawerContent className='h-[90vh] [&_.close-drawer]:hidden overflow-hidden bg-[#F3F2F2] border-none'>
        <div className='flex items-center justify-between gap-2 p-4'>
          <DrawerHeader className='flex flex-col text-left p-0 gap-1'>
            <DrawerTitle className='text-sm'>
              Время для здоровья – сейчас
            </DrawerTitle>
            <DrawerDescription className='hidden'>
              Подзаголовок
            </DrawerDescription>
          </DrawerHeader>
          <div className='flex items-center gap-1'>
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
        </div>
        {children}
      </DrawerContent>
    </Drawer>
  );
}

function DialogWrapper({ children }: { children: React.ReactNode }) {
  const { setShowDialog, showDialog } = useMainStore((state) => state);

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
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
            onClick={() => setShowDialog(false)}
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}
