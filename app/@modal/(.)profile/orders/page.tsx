import OverlayDesktopBackdrop from "@/components/layout/overlay-desktop-backdrop";
import MobileInterceptBypass from "@/components/layout/mobile-intercept-bypass";
import { MainModal } from "@/components/modal/main-modal";
import Orders from "@/components/profile/orders";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { validateRequest } from "@/lib/auth";
import { ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function ProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <OrdersModal />
    </Suspense>
  );
}

async function OrdersModal() {
  const { user } = await validateRequest();

  if (!user) redirect("/login?callbackUrl=/profile/orders");

  return (
    <MobileInterceptBypass>
      <OverlayDesktopBackdrop />
      <MainModal title='Заказы' path='/profile/orders' isBackButton>
        <Orders />
      </MainModal>
    </MobileInterceptBypass>
  );
}

function Loading() {
  return (
    <Dialog open={true}>
      <DialogContent className='sm:max-w-[425px] [&_.close-dialog]:hidden rounded-2xl sm:rounded-2xl'>
        <div className='flex items-center justify-between w-full h-fit'>
          <Button
            variant='secondary'
            className='p-2 flex items-center justify-center bg-accent rounded-full h-auto'
            asChild
          >
            <Link href='/profile'>
              <ChevronLeft className='w-4 h-4' />
            </Link>
          </Button>
          <DialogTitle className='font-medium text-xs'>Заказы</DialogTitle>
          <DialogDescription className='hidden'>Description</DialogDescription>
          <Button
            type='button'
            variant='secondary'
            className='p-2 flex items-center justify-center bg-accent rounded-full h-auto'
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
        <section className='w-full flex items-center justify-between flex-col gap-4 h-full'>
          <section className='w-full border-t'>
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className='border-b py-2 flex items-center gap-3 w-full'
              >
                <Skeleton className='w-16 h-16 aspect-square rounded-lg' />
                <div className='space-y-1'>
                  <Skeleton className='w-16 h-4' />
                  <Skeleton className='w-52 h-4' />
                </div>
              </div>
            ))}
          </section>
        </section>
      </DialogContent>
    </Dialog>
  );
}
