"use client";

import { Suspense } from "react";
import Search2 from "./search2";
import SearchCatalogList from "./search-catalog-list";
import SearchMobileFooter from "./search-mobile-footer";

/** Мобильный /search без query: поиск + каталог + футер */
export default function SearchMobileHub() {
  return (
    <main className='relative main-page max-lg:min-h-0 max-lg:pb-0 lg:hidden'>
      <Suspense fallback={null}>
        <Search2 hideCatalogButton />
      </Suspense>
      <div className='flex flex-col'>
        <SearchCatalogList />
        <SearchMobileFooter />
      </div>
    </main>
  );
}
