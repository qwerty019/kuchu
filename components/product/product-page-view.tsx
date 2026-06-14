"use client";

import OverlayDesktopBackdrop from "@/components/layout/overlay-desktop-backdrop";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import { Good, GoodDetails } from "@/lib/db/good/definitions";
import GoodProductMobile from "./good-product-mobile";
import { ProductModal } from "./product-modal";

export default function ProductPageView({
  good,
  similar,
  recs,
}: {
  good: GoodDetails;
  similar: Good[];
  recs: Good[];
}) {
  const isDesktop = useIsDesktop();

  if (isDesktop) {
    return (
      <>
        <OverlayDesktopBackdrop />
        <ProductModal good={good} similar={similar} recs={recs} />
      </>
    );
  }

  return (
    <main className='relative main-page'>
      <GoodProductMobile good={good} similar={similar} recs={recs} />
    </main>
  );
}
