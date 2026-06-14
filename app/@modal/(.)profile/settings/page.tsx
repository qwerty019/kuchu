import OverlayDesktopBackdrop from "@/components/layout/overlay-desktop-backdrop";
import MobileInterceptBypass from "@/components/layout/mobile-intercept-bypass";
import { MainModal } from "@/components/modal/main-modal";
import Settings from "@/components/profile/settings";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { validateRequest } from "@/lib/auth";
import { getUserPreferences } from "@/lib/db/user/data";
import { ChevronLeft, X } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <SettingsModal />
    </Suspense>
  );
}

async function SettingsModal() {
  const { user } = await validateRequest();

  if (!user) redirect("/login?callbackUrl=/profile/settings");

  const data = await getUserPreferences(user.id);

  if (!data) redirect("/");

  if ("message" in data) return redirect("/profile");

  return (
    <MobileInterceptBypass>
      <OverlayDesktopBackdrop />
      <MainModal title='Настройки' path='/profile/settings' isBackButton>
        <Settings user={user} data={data} />
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
          <DialogTitle className='font-medium text-xs'>Настройки</DialogTitle>
          <DialogDescription className='hidden'>Description</DialogDescription>
          <Button
            type='button'
            variant='secondary'
            className='p-2 flex items-center justify-center bg-accent rounded-full h-auto'
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
        <div className='space-y-2'>
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton key={index} className='h-[64px] rounded-2xl' />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
