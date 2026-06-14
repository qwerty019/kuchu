import { AvatarFallback } from "@/components/ui/avatar";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerHeader,
  DrawerTrigger,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Sale } from "@/lib/db/sale/definitions";
import SaleCarousel from "./sale-carousel";
import Good from "@/components/category/good";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SaleDrawer({
  sale,
  open,
  setOpen,
}: {
  sale: Sale;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
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
      </DrawerTrigger>
      <DrawerContent className='max-h-[90vh] [&_.close-drawer]:hidden overflow-hidden p-0 border-none bg-transparent'>
        <div className='overflow-y-auto scrollbar-hide h-full'>
          <ContentDrawer open={open} sale={sale} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}

const ContentDrawer = ({ open, sale }: { open: boolean; sale: Sale }) => {
  if (!open) return null;

  return (
    <>
      <SaleCarousel sale={sale} isDrawer />
      <div className='relative space-y-4 p-4 bg-background rounded-t-[10px] h-full -mt-4 z-10'>
        <DrawerHeader className='p-0 flex items-start gap-2 space-y-0 justify-between'>
          <div className='space-y-1.5'>
            <DrawerTitle className='text-left text-2xl font-semibold'>
              {sale.title}
            </DrawerTitle>
            <DrawerDescription
              className={`text-sm leading-none text-left ${
                !sale.subtitle ? "hidden" : ""
              }`}
            >
              {sale.subtitle}
            </DrawerDescription>
          </div>
        </DrawerHeader>
        {sale.text && (
          <p className='whitespace-pre-line text-sm'>{sale.text}</p>
        )}
        <div className='grid grid-cols-2 gap-2'>
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
    </>
  );
};
