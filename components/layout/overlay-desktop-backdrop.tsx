import Sales from "@/components/main/sales";
import Stories from "@/components/main/stories";
import Loading from "@/components/search/loading";
import Search2 from "@/components/search/search2";
import { Suspense } from "react";

/** Фон под модалкой — только десктоп (lg+), без изменений. */
export default function OverlayDesktopBackdrop() {
  return (
    <main className='relative main-page'>
      <Suspense fallback={<Loading />}>
        <Search2 hideOnMobile />
      </Suspense>
      <section className='flex flex-col gap-6'>
        <Stories />
        <Sales />
      </section>
    </main>
  );
}
