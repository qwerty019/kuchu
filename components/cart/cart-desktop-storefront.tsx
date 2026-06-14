import Collections from "@/components/main/collections";
import Sales from "@/components/main/sales";
import Stories from "@/components/main/stories";
import LoadingSearch from "@/components/search/loading";
import Search2 from "@/components/search/search2";
import { Suspense } from "react";

/** Витрина за модалкой корзины — только десктоп (серверный компонент). */
export default function CartDesktopStorefront() {
  return (
    <main className='relative main-page hidden lg:block'>
      <Suspense fallback={<LoadingSearch />}>
        <Search2 hideOnMobile />
      </Suspense>
      <section className='flex flex-col gap-6'>
        <Stories />
        <Sales />
        <Collections />
      </section>
    </main>
  );
}
