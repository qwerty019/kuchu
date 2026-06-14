export const dynamic = "force-dynamic";

import ExportUsers from "@/components/admin/users/export-users";
import { Pagination } from "@/components/admin/users/pagination";
import { Toolbar } from "@/components/admin/users/toolbar";
import UsersList from "@/components/admin/users/users-list";
import { getUsersCount } from "@/lib/db/user/data";
import { isAdmin } from "@/lib/utils-server";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams?: { query?: string; page?: string; limit?: string };
}) {
  await isAdmin("/admin/users");

  const { query, page, limit } = searchParams || {};

  if (!page || !limit) {
    redirect("/admin/users?page=1&limit=10");
  }

  const count = await getUsersCount(query);

  return (
    <main className='admin-page space-y-6 overflow-x-auto'>
      <section className='flex items-center justify-between'>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
          Пользователи
        </h1>
        <ExportUsers />
      </section>
      <section className='space-y-4'>
        <Toolbar />
        <Suspense
          key={query + page + limit}
          fallback={<Loading limit={parseInt(limit)} />}
        >
          <UsersList query={query} page={page} limit={limit} />
        </Suspense>
        <Pagination
          count={count}
          page={parseInt(page)}
          limit={parseInt(limit)}
        />
      </section>
    </main>
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
