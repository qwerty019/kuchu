"use client";

import { MainModal } from "@/components/modal/main-modal";
import { useIsDesktop } from "@/hooks/use-is-desktop";

type ProfileSubpageViewProps = {
  title: string;
  path: string;
  desktopBackdrop: React.ReactNode;
  isBackButton?: boolean;
  modalClassName?: string;
  children: React.ReactNode;
};

/** Подстраницы профиля: мобилка — main-page; десктоп — модалка. */
export default function ProfileSubpageView({
  title,
  path,
  desktopBackdrop,
  isBackButton,
  modalClassName,
  children,
}: ProfileSubpageViewProps) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <>
        {desktopBackdrop}
        <MainModal
          title={title}
          path={path}
          isBackButton={isBackButton}
          className={modalClassName}
        >
          {children}
        </MainModal>
      </>
    );
  }

  return <main className='relative main-page'>{children}</main>;
}
