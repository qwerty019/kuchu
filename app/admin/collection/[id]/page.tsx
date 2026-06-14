export const dynamic = "force-dynamic";

import { fetchCollection } from "@/lib/db/collection/data";
import { notFound } from "next/navigation";
import Upper from "@/components/admin/collection/upper";
import { isAdmin } from "@/lib/utils-server";
import CollGoods from "@/components/admin/collection/coll-goods";

export default async function Page({ params }: { params: { id: string } }) {
  await isAdmin(`/admin/collection/${params.id}`);

  const collection = await fetchCollection({ id: Number(params.id) });

  if (!collection) notFound();

  return (
    <main className='admin-page space-y-6'>
      <Upper collection={collection} />
      <CollGoods collection={collection} />
    </main>
  );
}
