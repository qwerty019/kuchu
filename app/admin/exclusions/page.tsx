export const dynamic = "force-dynamic";

import { Exclution } from "@/components/admin/exclutions/exclution";
import { AddExclution } from "@/components/admin/exclutions/exclution-actions";
import { getExclusions } from "@/lib/db/searchExclusion/data";
import { isAdmin } from "@/lib/utils-server";

export default async function Page() {
  await isAdmin("/admin/exclusions");

  const exclusions = await getExclusions();

  return (
    <main className='admin-page space-y-6'>
      <section className='flex justify-between items-center'>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
          Исключения
        </h1>
        <AddExclution />
      </section>
      <ol className='space-y-1 max-w-md'>
        {exclusions.map((exclusion) => (
          <Exclution key={exclusion.id} exclution={exclusion} />
        ))}
      </ol>
    </main>
  );
}
