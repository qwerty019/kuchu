export const dynamic = "force-dynamic";

import { columns } from "@/components/admin/goods/columns";
import { DataTable } from "@/components/admin/goods/data-table";
import ImportExcel from "@/components/admin/goods/import-excel";
import { Pagination } from "@/components/admin/goods/pagination";
import { Toolbar } from "@/components/admin/goods/toolbar";
import { fetchAllCategories } from "@/lib/db/category/data";
import { fetchGoods, getGoodsCount } from "@/lib/db/good/data";
import { Option } from "@/lib/definitions";
import { isAdmin } from "@/lib/utils-server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
    limit?: string;
    category?: string;
    hidden?: string;
  };
}) {
  await isAdmin("/admin/goods");

  const { query, page, limit, category, hidden } = searchParams || {};

  if (!page || !limit) {
    redirect("/admin/goods?page=1&limit=10");
  }

  const categories = await fetchAllCategories({ parentId: undefined });

  return (
    <main className='admin-page space-y-6'>
      <section className='flex items-center justify-between gap-2'>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
          Товары
        </h1>
        <div className='flex gap-1'>
          <ImportExcel />
        </div>
      </section>
      <section className='space-y-4'>
        <Toolbar categories={categories} />
        <Suspense
          key={query + page + limit + category + hidden}
          fallback={<Loading limit={Number(limit)} />}
        >
          <GoodsSuspense
            page={Number(page)}
            limit={Number(limit)}
            query={query}
            category={category}
            hidden={hidden}
            categories={categories}
          />
        </Suspense>
      </section>
    </main>
  );
}

async function GoodsSuspense({
  page,
  limit,
  query,
  category,
  hidden,
  categories,
}: {
  page: number;
  limit: number;
  query?: string;
  category?: string;
  hidden?: string;
  categories: Option[];
}) {
  const [count, goods] = await Promise.all([
    getGoodsCount({ query, category, hidden }),
    fetchGoods({ page, limit, query, category, hidden }),
  ]);

  return (
    <>
      <DataTable
        data={goods}
        limit={limit}
        columns={columns}
        categories={categories}
      />
      {count > 0 && <Pagination count={count} page={page} limit={limit} />}
    </>
  );
}

function Loading({ limit }: { limit: number }) {
  return (
    <section className='flex flex-col border rounded-lg'>
      <div className='border-b h-[48px] w-full' />
      {Array.from({ length: limit }).map((_, i) => (
        <div
          key={i}
          className='w-full h-[65px] border-b last:border-none'
        ></div>
      ))}
    </section>
  );
}
