import Good from "@/components/category/good";
import { AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Sale } from "@/lib/db/sale/definitions";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import SaleCarousel from "./sale-carousel";

export default function SaleDialog({
  sale,
  open,
  setOpen,
}: {
  sale: Sale;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className='w-[128px] shrink-0 relative rounded-xl bg-accent aspect-[3/4]'>
          <div className='z-10 absolute inset-0 h-1/2 bg-gradient-to-b from-black/50 rounded-xl' />
          <Avatar className='w-full h-full rounded-xl'>
            <AvatarImage
              src={sale.img}
              alt={sale.title}
              className='w-full h-full object-cover rounded-xl'
            />
            <AvatarFallback className='rounded-xl text-muted-foreground flex items-center justify-center' />
          </Avatar>
          <p className='z-10 absolute top-3 left-3 text-sm leading-tight text-white font-medium'>
            {sale.title}
          </p>
        </div>
      </DialogTrigger>
      <Content open={open} sale={sale} />
    </Dialog>
  );
}

const Content = ({ open, sale }: { open: boolean; sale: Sale }) => {
  if (!open) return null;

  return (
    <DialogContent className='max-w-4xl [&_.close-dialog]:hidden w-full flex gap-6'>
      <SaleCarousel sale={sale} />
      <div className='w-1/2 flex flex-col gap-6'>
        <DialogHeader className='flex-row items-start gap-2 space-y-0 justify-between'>
          <div className='space-y-1.5'>
            <DialogTitle className='text-3xl font-semibold'>
              {sale.title}
            </DialogTitle>
            <DialogDescription
              className={`text-sm leading-none ${
                !sale.subtitle ? "hidden" : ""
              }`}
            >
              {sale.subtitle}
            </DialogDescription>
          </div>
          <DialogClose asChild>
            <Button
              type='button'
              variant='secondary'
              className='p-2 flex items-center justify-center bg-accent rounded-full h-auto'
            >
              <X className='w-4 h-4' />
            </Button>
          </DialogClose>
        </DialogHeader>
        {sale.text && (
          <p className='whitespace-pre-line text-sm'>{sale.text}</p>
        )}
        <div className='grid grid-cols-3 gap-2'>
          {sale.category?.goods.map((good) => (
            <Good key={good.id} good={good} className='text-xs' />
          ))}
          {sale.category ? (
            <Link
              href={`/category/${sale.category?.route}`}
              className='w-full block'
            >
              <div className='flex items-center justify-center w-full aspect-square bg-[#F2F2F2] rounded-2xl'>
                <div className='py-3 px-4 rounded-full bg-background flex items-center justify-center gap-1'>
                  <p className='font-medium text-sm'>Больше</p>
                  <ArrowRight className='w-4 h-4' />
                </div>
              </div>
            </Link>
          ) : null}
          {sale.salegoods.map((sg) => (
            <Good key={sg.good.id} good={sg.good} className='text-xs' />
          ))}
        </div>
      </div>
    </DialogContent>
  );
};
