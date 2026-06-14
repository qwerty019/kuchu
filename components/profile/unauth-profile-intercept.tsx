"use client";

import { useIsDesktop } from "@/hooks/use-is-desktop";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** Intercept @modal для гостя: только десктоп → login; мобилка — bypass на /profile. */
export default function UnauthProfileIntercept({
  desktopBackdrop,
}: {
  desktopBackdrop: React.ReactNode;
}) {
  const isDesktop = useIsDesktop();
  const router = useRouter();

  useEffect(() => {
    if (isDesktop) {
      router.replace("/login?callbackUrl=/profile");
    }
  }, [isDesktop, router]);

  if (!isDesktop) return null;

  return <>{desktopBackdrop}</>;
}
