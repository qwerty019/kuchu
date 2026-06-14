import OverlayDesktopBackdrop from "@/components/layout/overlay-desktop-backdrop";
import MobileInterceptBypass from "@/components/layout/mobile-intercept-bypass";
import { LogoSvg, Svg1, Svg2 } from "@/components/icons";
import { MainModal } from "@/components/modal/main-modal";
import Profile from "@/components/profile/profile";
import UnauthProfileIntercept from "@/components/profile/unauth-profile-intercept";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { validateRequest } from "@/lib/auth";
import {
  ChevronLeft,
  ShoppingBag,
  Loader2,
  X,
  MapPin,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export default async function ProfilePage() {
  return (
    <Suspense fallback={<Loading />}>
      <ProfileModal />
    </Suspense>
  );
}

async function ProfileModal() {
  const { user } = await validateRequest();

  if (!user) {
    return (
      <MobileInterceptBypass>
        <UnauthProfileIntercept
          desktopBackdrop={<OverlayDesktopBackdrop />}
        />
      </MobileInterceptBypass>
    );
  }

  return (
    <MobileInterceptBypass>
      <OverlayDesktopBackdrop />
      <MainModal
        title='Личный кабинет'
        className='h-full sm:h-[700px]'
        path='/profile'
      >
        <Profile user={user} />
      </MainModal>
    </MobileInterceptBypass>
  );
}

function Loading() {
  return (
    <Dialog open={true}>
      <DialogContent className='sm:max-w-[425px] [&_.close-dialog]:hidden rounded-2xl sm:rounded-2xl h-full sm:h-[700px]'>
        <div className='flex items-center justify-between w-full h-fit'>
          <Button
            variant='secondary'
            className='opacity-0 p-2 flex items-center justify-center bg-accent rounded-full h-auto'
          >
            <ChevronLeft className='w-4 h-4' />
          </Button>
          <DialogTitle className='font-medium text-xs'>
            Личный кабинет
          </DialogTitle>
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
          <section className='w-full flex flex-col items-center gap-4'>
            <div className='flex flex-col items-center gap-1'>
              <div className='flex items-center gap-1 cursor-pointer'>
                <Skeleton className='w-32 h-8' />
              </div>
              <Skeleton className='w-20 h-4' />
            </div>
            <div className='w-full space-y-2'>
              <div className='flex flex-col justify-between w-full aspect-video rounded-2xl bg-[#865BBD] p-4 gap-3'>
                <div className='flex justify-between gap-2'>
                  <LogoSvg />
                </div>
                <Svg2 className='ml-auto' />
                <div className='flex justify-between items-center gap-1'>
                  <p className='text-white text-[10px]'>
                    1% начисляем бонусами <br />
                    До 30% — ваша скидка на заказ
                  </p>
                </div>
              </div>
              <div className='w-full flex gap-2'>
                {buttons.map(({ title, link, icon: Icon }) => (
                  <Link
                    key={title}
                    href={link}
                    className='w-full flex flex-col items-center justify-center gap-2 aspect-video bg-secondary rounded-xl'
                  >
                    <Icon className='w-5 h-5' />
                    <p className='text-xs'>{title}</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
          <div className='flex flex-col gap-2 justify-center items-center'>
            <div className='flex gap-2'>
              <Button
                variant='secondary'
                asChild
                className='rounded-full text-xs py-3 h-auto'
              >
                <a
                  href={`https://wa.me/79245902200?text=Здравствуйте!%0aУ%20меня%20вопрос`}
                  target='_blank'
                >
                  Связаться с нами
                </a>
              </Button>
            </div>
            <Button
              className='w-[137px] rounded-full text-xs py-3 h-auto'
              variant='secondary'
              disabled
            >
              <Loader2 className='w-4 h-4 animate-spin mr-2' /> Подождите...
            </Button>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  );
}

const buttons = [
  { title: "Заказы", link: "/profile/orders", icon: ShoppingBag },
  { title: "Адреса", link: "/profile/addresses", icon: MapPin },
  { title: "Настройки", link: "/profile/settings", icon: Settings },
];
