"use client";

import { useIsDesktop } from "@/hooks/use-is-desktop";
import { navigateMobileFullPage } from "@/lib/mobile-full-page-nav";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Intercept (@modal): на мобилке не показываем Dialog — полная страница в {children}.
 * Soft-nav оставляет старый children; делаем hard-nav на тот же URL.
 */
export default function MobileInterceptBypass({
  children,
}: {
  children: React.ReactNode;
}) {
  const isDesktop = useIsDesktop();
  const pathname = usePathname();
  const redirected = useRef(false);

  useEffect(() => {
    if (isDesktop || redirected.current) return;

    redirected.current = true;
    const href =
      pathname + window.location.search + window.location.hash;
    navigateMobileFullPage(href, { reloadIfSameUrl: true });
  }, [isDesktop, pathname]);

  if (!isDesktop) return null;

  return <>{children}</>;
}
