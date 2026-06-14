import { Skeleton } from "../ui/skeleton";
import { Suspense } from "react";
import { getBannersForPage } from "@/lib/db/banner/data";
import BannersList from "./banners-list";

export default async function Banners() {
  return (
    <Suspense fallback={<Loading />}>
      <BannersSuspense />
    </Suspense>
  );
}

async function BannersSuspense() {
  const banners = await getBannersForPage();

  if (banners.length === 0) {
    return null;
  }

  return <BannersList banners={banners} />;
}

function Loading() {
  return (
    <section className='flex w-full shrink-0 max-lg:home-banner-mobile-height'>
      <Skeleton className='shrink-0 w-full max-lg:rounded-none lg:rounded-2xl max-lg:home-banner-mobile-height lg:h-[220px]' />
    </section>
  );
}
