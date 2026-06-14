export const dynamic = "force-dynamic";

import Collection from "@/components/admin/collection/collection";
import { AddCollection } from "@/components/admin/collection/collection-actions";
import Empty from "@/components/ui/custom/empty";
import { fetchCollections } from "@/lib/db/collection/data";
import { isAdmin } from "@/lib/utils-server";

export default async function Page() {
  await isAdmin("/admin/collection");

  const collections = await fetchCollections();

  return (
    <main className='admin-page space-y-6'>
      <section className='flex items-center justify-between gap-2'>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
          Подборки
        </h1>
        <AddCollection />
      </section>
      <section className='space-y-1'>
        {collections.map((collection) => (
          <Collection key={collection.id} collection={collection} />
        ))}
        {collections.length === 0 && <Empty message='Нет подборок' />}
      </section>
    </main>
  );
}
