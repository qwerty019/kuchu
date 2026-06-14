"use client";

import { MainModal } from "@/components/modal/main-modal";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { User } from "@/lib/auth";
import Profile from "./profile";

type ProfilePageViewProps = {
  user: User;
  desktopBackdrop: React.ReactNode;
};

/**
 * Мобилка: одна страница как Home — только main-page + Profile.
 * Десктоп: фон + MainModal (как было).
 */
export default function ProfilePageView({
  user,
  desktopBackdrop,
}: ProfilePageViewProps) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <>
        {desktopBackdrop}
        <MainModal
          title='Личный кабинет'
          className='h-full sm:h-[700px]'
          path='/profile'
        >
          <Profile user={user} />
        </MainModal>
      </>
    );
  }

  return (
    <main className='relative main-page flex min-h-0 flex-col max-lg:!pt-8'>
      <Profile user={user} />
    </main>
  );
}
