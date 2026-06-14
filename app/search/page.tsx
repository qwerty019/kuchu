import { Categories } from "@/components/new-search/categories";
import { Filters } from "@/components/new-search/filters";
import { Results } from "@/components/new-search/results";
import Loading from "@/components/search/loading";
import Search2 from "@/components/search/search2";
import SearchMobileHub from "@/components/search/search-mobile-hub";
import { Button } from "@/components/ui/button";
import { getSearchData } from "@/lib/db/new-search/search";
import { search } from "@/lib/db/search/actions";
import Link from "next/link";
import { Suspense } from "react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { query, category, filters, stock } = searchParams || {};

  if (!query) return <NoQuery />;

  search(query as string);

  const searchData = await getSearchData({
    query: query as string,
    categoryId: category as string,
    filters: filters as string,
    stock: stock as string,
  });

  const { categoriesProps, filtersProps, resultsProps } = searchData;

  if (categoriesProps.allMatchingIdsForOptions.length === 0) {
    return <NoResults query={query as string} />;
  }

  // Create a key that includes query, category, and filters
  // This ensures we reload goods when any of these change
  const resultsKey = `${query}-${category}-${filters}-${stock}`;

  return (
    <main className='relative main-page'>
      <Suspense fallback={<Loading />}>
        <Search2 />
      </Suspense>
      <section className='space-y-4'>
        <Categories {...categoriesProps} />
        <Filters {...filtersProps} />
        <Results {...resultsProps} suspenseKey={resultsKey} />
      </section>
    </main>
  );
}

function NoQuery() {
  return (
    <>
      <SearchMobileHub />
      <NoQueryDesktop />
    </>
  );
}

function NoQueryDesktop() {
  return (
    <main className='relative main-page max-lg:hidden'>
      <Suspense fallback={<Loading />}>
        <Search2 />
      </Suspense>
      <section className='flex flex-col items-center justify-center h-full gap-4'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className='w-48'
          src='/images/empty-search.png'
          alt='Введите запрос в строку поиска'
        />
        <p className='text-muted-foreground text-center text-xs w-48'>
          Введите запрос в строку поиска
        </p>
      </section>
    </main>
  );
}

function NoResults({ query }: { query: string }) {
  return (
    <main className='relative main-page'>
      <Suspense fallback={<Loading />}>
        <Search2 />
      </Suspense>
      <section className='flex flex-col items-center justify-center h-full gap-4'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className='w-48'
          src='/images/empty-search.png'
          alt='По вашему запросу ничего не найдено'
        />
        <p className='text-muted-foreground text-center text-xs w-48'>
          К сожалению, ничего такого не нашлось, но мы готовы вас выслушать, и,
          возможно, оно скоро появится
        </p>
        <Button
          type='button'
          className='rounded-full bg-[#A03968] hover:bg-[#A03968]/80 p-4 text-xs'
          asChild
        >
          <Link
            href={`https://wa.me/79245902200?text=Здравствуйте!%0aХочу%20купитьу%20${query},%20но%20его%20нет%20в%20наличии`}
            target='_blank'
          >
            Что бы вы хотели купить у нас?
          </Link>
        </Button>
      </section>
    </main>
  );
}
