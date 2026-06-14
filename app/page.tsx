export const dynamic = "force-dynamic";

import Banners from "@/components/main/banners";
import Collections from "@/components/main/collections";
import Sales from "@/components/main/sales";
import Loading from "@/components/search/loading";
import Search2 from "@/components/search/search2";
import { Suspense } from "react";

export default async function Home() {
  return (
    <main className='relative main-page max-lg:rounded-none max-lg:px-0 max-lg:!pt-0 max-lg:pb-0'>
      <Suspense fallback={<Loading />}>
        <Search2 hideOnMobile />
      </Suspense>
      <Banners />
      <section className='flex flex-col gap-6 max-lg:px-4 max-lg:pb-4 lg:pt-0 mt-4'>
        <Sales />
        <Collections />
      </section>
    </main>
  );
}
