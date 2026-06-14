import { fetchCollectionsForPage } from "@/lib/db/collection/data";
import { ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { CollectionInPage } from "@/lib/db/collection/definitions";
import Good from "../category/good";

export default async function Collections() {
  return (
    <Suspense fallback={<Loading />}>
      <CollectionsSuspense />
    </Suspense>
  );
}

async function CollectionsSuspense() {
  const data = await fetchCollectionsForPage();

  return <CollectionsData data={data} />;
}

const MOBILE_COLLECTION_GOODS_MAX = 7;

function CollectionMoreTile({ href }: { href: string }) {
  return (
    <div className='w-[42vw] max-w-[180px] min-w-[140px] shrink-0 snap-start space-y-1.5'>
      <Button
        variant='secondary'
        className='flex h-auto w-full aspect-square items-center justify-center rounded-2xl bg-[#F2F2F2]'
        asChild
      >
        <Link href={href}>
          <div className='flex items-center justify-center gap-1 rounded-full bg-background px-4 py-3'>
            <p className='text-sm font-medium'>Далее</p>
            <ArrowRight className='h-4 w-4' />
          </div>
        </Link>
      </Button>
      <div className='h-[60px]' aria-hidden />
      <div className='h-9' aria-hidden />
    </div>
  );
}

function CollectionRow({ collection }: { collection: CollectionInPage }) {
  const mobileGoods = collection.collgoods.slice(0, MOBILE_COLLECTION_GOODS_MAX);
  const collectionHref = `/collection/${collection.id}`;

  return (
    <section className='space-y-4'>
      <h2 className='w-full scroll-m-20 text-2xl font-bold leading-none tracking-tight'>
        {collection.title}
      </h2>

      {/* Мобилка: горизонтальный скролл, до 7 товаров + «Далее» */}
      {/* <div className='-mx-4 flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide snap-x snap-mandatory lg:hidden'>
        {mobileGoods.map((coll) => (
          <div
            key={coll.good.id}
            className='w-[42vw] max-w-[180px] min-w-[140px] shrink-0 snap-start'
          >
            <Good good={coll.good} />
          </div>
        ))}
        <CollectionMoreTile href={collectionHref} />
      </div> */}
      <div className='flex gap-2 overflow-x-auto pb-1 scrollbar-hide snap-x snap-mandatory lg:hidden'>
        {mobileGoods.map((coll, idx) => (
          <div
            key={coll.good.id}
            className={`w-[42vw] max-w-[180px] min-w-[140px] shrink-0 snap-start ${idx === 0 ? 'ml-4' : ''}`}
          >
            <Good good={coll.good} />
          </div>
        ))}
        <CollectionMoreTile href={collectionHref} />
        <div className='pr-4' aria-hidden /> {/* отступ справа для последнего элемента */}
      </div>

      {/* Десктоп: сетка как раньше */}
      <section className='hidden grid-cols-2 gap-3 md:grid-cols-3 min-[1025px]:grid-cols-2 min-[1170px]:grid-cols-3 xl:grid-cols-4 lg:grid'>
        {collection.collgoods.slice(0, 3).map((coll) => (
          <Good key={coll.good.id} good={coll.good} />
        ))}
        {(collection._count?.collgoods ?? 0) > 3 && (
          <Button
            variant='secondary'
            className='flex h-auto w-full aspect-square items-center justify-center rounded-2xl bg-[#F2F2F2]'
            asChild
          >
            <Link href={collectionHref}>
              <div className='flex items-center justify-center gap-1 rounded-full bg-background px-4 py-3'>
                <p className='text-sm font-medium'>Больше</p>
                <ArrowRight className='h-4 w-4' />
              </div>
            </Link>
          </Button>
        )}
      </section>
    </section>
  );
}

function CollectionsData({ data }: { data: CollectionInPage[] }) {
  return (
    <section className='space-y-6'>
      {data.map((collection) => (
        <CollectionRow key={collection.id} collection={collection} />
      ))}
    </section>
  );
}

function Loading() {
  return (
    <section className='space-y-6'>
      {Array.from({ length: 2 }, (_, i) => (
        <section key={i} className='space-y-4'>
          <Skeleton className='h-5 w-4/5' />
          <div className='-mx-4 flex gap-3 overflow-hidden px-4 lg:hidden'>
            {Array.from({ length: 4 }, (_, j) => (
              <div
                key={j}
                className='w-[42vw] max-w-[180px] min-w-[140px] shrink-0 space-y-1.5'
              >
                <Skeleton className='aspect-square w-full rounded-2xl' />
                <Skeleton className='h-8 w-3/5' />
                <Skeleton className='h-8 w-1/2 rounded-full' />
              </div>
            ))}
          </div>
          <section className='hidden grid-cols-2 gap-3 md:grid-cols-3 min-[1025px]:grid-cols-2 min-[1170px]:grid-cols-3 xl:grid-cols-4 lg:grid'>
            {Array.from({ length: 4 }, (_, j) => (
              <div key={j} className='space-y-1.5'>
                <Skeleton className='aspect-square w-full rounded-2xl' />
                <Skeleton className='h-8 w-3/5' />
                <Skeleton className='h-8 w-1/2 rounded-full' />
              </div>
            ))}
          </section>
        </section>
      ))}
    </section>
  );
}
