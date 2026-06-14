export const dynamic = "force-dynamic";

import GoBack from "@/components/admin/filters/go-back";
import Option from "@/components/admin/filters/option";
import { AddOption } from "@/components/admin/filters/option-actions";
import { getFilterWithOptions } from "@/lib/db/filter/data";
import { isAdmin } from "@/lib/utils-server";
import { redirect } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  await isAdmin(`/admin/filters/${id}`);

  const filter = await getFilterWithOptions({ id: Number(id) });

  if (!filter) redirect("/admin/filters");

  return (
    <main className='admin-page space-y-6'>
      <section className='flex items-center justify-between gap-2'>
        <div className='flex items-center gap-2'>
          <GoBack />
          <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
            {filter.title}
          </h1>
        </div>
        <AddOption filterId={filter.id} />
      </section>
      <section className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
        {filter.options.map((o) => (
          <Option key={o.id} option={o} />
        ))}
      </section>
    </main>
  );
}
