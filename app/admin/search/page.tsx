export const dynamic = "force-dynamic";

import ExportData from "@/components/admin/search/export-data";
import List from "@/components/admin/search/list";
import { getSearchs, getSearchsCount } from "@/lib/db/search/data";
import { isAdmin } from "@/lib/utils-server";

export default async function Page() {
  await isAdmin("/admin/search");

  const [searchs, count] = await Promise.all([
    getSearchs({ page: 1, limit: 50 }),
    getSearchsCount(),
  ]);

  return (
    <main className='admin-page space-y-6'>
      <section className='flex justify-between items-center'>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
          Поисковые запросы
        </h1>
        <ExportData />
      </section>
      <List searchs={searchs} count={count} />
    </main>
  );
}
