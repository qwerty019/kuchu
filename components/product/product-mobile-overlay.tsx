"use client";

import { useIsDesktop } from "@/hooks/use-is-desktop";
import { Good, GoodDetails } from "@/lib/db/good/definitions";
import GoodProductMobile from "./good-product-mobile";

/**
 * Intercept (@modal) на мобилке: URL уже /product/…, но {children} — предыдущая страница.
 * Рендерим карточку товара поверх, z-30 (нижняя nav z-40 остаётся видимой).
 */
export default function ProductMobileOverlay({
  good,
  similar,
  recs,
}: {
  good: GoodDetails;
  similar: Good[];
  recs: Good[];
}) {
  const isDesktop = useIsDesktop();

  if (isDesktop) return null;

  return (
    <div className='fixed inset-0 z-30 overflow-y-auto bg-background lg:hidden'>
      <main className='relative main-page min-h-full'>
        <GoodProductMobile good={good} similar={similar} recs={recs} />
      </main>
    </div>
  );
}
