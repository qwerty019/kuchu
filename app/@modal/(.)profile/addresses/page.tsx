import OverlayDesktopBackdrop from "@/components/layout/overlay-desktop-backdrop";
import MobileInterceptBypass from "@/components/layout/mobile-intercept-bypass";
import { MainModal } from "@/components/modal/main-modal";
import Addresses from "@/components/profile/adresses";
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

export default async function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <AddressesModal />
    </Suspense>
  );
}

async function AddressesModal() {
  const { user } = await validateRequest();

  if (!user) redirect("/login?callbackUrl=/profile/addresses");

  return (
    <MobileInterceptBypass>
      <OverlayDesktopBackdrop />
      <MainModal title='Адреса' path='/profile/addresses' isBackButton>
        <Addresses user={user} />
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
          <DialogTitle className='font-medium text-xs'>Адреса</DialogTitle>
          <DialogDescription className='hidden'>Description</DialogDescription>
          <Button
            type='button'
            variant='secondary'
            className='p-2 flex items-center justify-center bg-accent rounded-full h-auto'
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
        <div className='space-y-6 truncate'>
          <div className='space-y-2 truncate'>
            {Array.from({ length: 2 }).map((_, index) => (
              <Skeleton key={index} className='h-[62px] rounded-2xl' />
            ))}
          </div>
          <Button
            className='w-full text-xs rounded-full bg-[#A03968] hover:bg-[#A03968] text-white'
            disabled
          >
            Добавить или изменить адрес доставки
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
