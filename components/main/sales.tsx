import { Suspense } from "react";
import { fetchPageSales } from "@/lib/db/sale/data";
import { Skeleton } from "../ui/skeleton";
import SalesList from "./sales/sales-list";

export default async function Sales() {
  return (
    <Suspense fallback={<Loading />}>
      <SalesSuspense />
    </Suspense>
  );
}

async function SalesSuspense() {
  const sales = await fetchPageSales();

  if ("message" in sales) {
    return <div>{sales.message}</div>;
  }

  return (
    <Suspense fallback={<Loading />}>
      <SalesList sales={sales} />
    </Suspense>
  );
}

function Loading() {
  return (
    <section className='space-y-3'>
      <h2 className='text-3xl font-semibold'>Акции и подборки</h2>
      <section className='flex gap-2 overflow-x-auto scrollbar-hide'>
        {Array.from({ length: 5 }, (_, i) => (
          <Skeleton
            key={i}
            className='shrink-0 w-[128px] h-[171px] rounded-xl'
          />
        ))}
      </section>
    </section>
  );
}
