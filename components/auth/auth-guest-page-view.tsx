"use client";

import MobileGuestAccount from "@/components/profile/mobile-guest-account";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type AuthGuestPageViewProps = {
  callbackUrl: string;
  desktopBackdrop: React.ReactNode;
};

/** Гость: мобилка — полноэкранный вход; десктоп — модалка login (как было у profile). */
export default function AuthGuestPageView({
  callbackUrl,
  desktopBackdrop,
}: AuthGuestPageViewProps) {
  const isDesktop = useIsDesktop();
  const router = useRouter();

  useEffect(() => {
    if (isDesktop) {
      router.replace(
        `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
      );
    }
  }, [isDesktop, router, callbackUrl]);

  if (isDesktop) {
    return <>{desktopBackdrop}</>;
  }

  return <MobileGuestAccount callbackUrl={callbackUrl} />;
}
