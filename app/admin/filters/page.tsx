export const dynamic = "force-dynamic";

import { Filter } from "@/components/admin/filters/filter";
import { AddFilter } from "@/components/admin/filters/filter-actions";
import { getFilters } from "@/lib/db/filter/data";
import { isAdmin } from "@/lib/utils-server";

export default async function Page() {
  await isAdmin("/admin/filters");

  const filters = await getFilters();

  return (
    <main className='admin-page space-y-6'>
      <section className='flex items-center justify-between gap-2'>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
          Фильтры
        </h1>
        <AddFilter />
      </section>
      <section className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
        {filters.map((filter) => (
          <Filter key={filter.id} filter={filter} />
        ))}
      </section>
    </main>
  );
}
