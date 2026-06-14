import Goods from "@/components/category/goods";
import Loading from "@/components/search/loading";
import Search2 from "@/components/search/search2";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCategoryForPage } from "@/lib/db/category/data";
import { ArrowLeft } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
  params,
  searchParams,
}: {
  params: { cat: string };
  searchParams: { stock?: string };
}) {
  const key = `${params.cat}-${searchParams.stock}`;

  return (
    <main className='relative main-page'>
      <Suspense fallback={<Loading />}>
        <Search2 hideOnMobile />
      </Suspense>
      <Suspense key={key} fallback={<LoadingCat />}>
        <CategorySuspense cat={params.cat} stock={searchParams.stock} />
      </Suspense>
    </main>
  );
}

async function CategorySuspense({
  cat,
  stock,
}: {
  cat: string;
  stock?: string;
}) {
  const category = await getCategoryForPage({ route: cat, stock });

  if (!category) redirect("/");

  return <Goods category={category} />;
}

function LoadingCat() {
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
