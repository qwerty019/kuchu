import Goods from "@/components/collection/goods";
import Loading from "@/components/search/loading";
import Search2 from "@/components/search/search2";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCollectionForPage } from "@/lib/db/collection/data";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page({ params }: { params: { cat: string } }) {
  return (
    <main className='relative main-page'>
      <Suspense fallback={<Loading />}>
        <Search2 hideOnMobile />
      </Suspense>
      <Suspense fallback={<LoadingCollection />}>
        <CollectionSuspense params={params} />
      </Suspense>
    </main>
  );
}

async function CollectionSuspense({ params }: { params: { cat: string } }) {
  const collection = await fetchCollectionForPage({ id: params.cat });

  if (!collection) redirect("/");

  return <Goods collection={collection} />;
}

function LoadingCollection() {
  return (
    <section className='space-y-4'>
      <div className='w-full flex gap-4 items-center justify-between lg:justify-start'>
        <Button
          variant='secondary'
          className='flex items-center justify-center rounded-xl bg-[#F2F2F2]'
        >
          <ArrowLeft className='w-4 h-4 text-secondary' />
        </Button>
        <Skeleton className='h-8 w-40 rounded-full' />
        <Button
          variant='secondary'
          className='lg:hidden flex items-center justify-center rounded-xl bg-[#F2F2F2] opacity-0'
        >
          <ArrowLeft className='w-4 h-4 text-secondary' />
        </Button>
      </div>
      <section className='grid grid-cols-2 md:grid-cols-3 min-[1025px]:grid-cols-2 min-[1170px]:grid-cols-3 xl:grid-cols-4 gap-3'>
        <Skeleton className='w-full aspect-square rounded-2xl' />
        <Skeleton className='w-full aspect-square rounded-2xl' />
        <Skeleton className='w-full aspect-square rounded-2xl' />
        <Skeleton className='w-full aspect-square rounded-2xl' />
      </section>
    </section>
  );
}
