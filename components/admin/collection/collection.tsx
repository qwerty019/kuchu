"use client";

import type { Collection } from "@/lib/db/collection/schema";
import Link from "next/link";
import { EditCollection } from "./collection-actions";

export default function Collection({ collection }: { collection: Collection }) {
  return (
    <div className='w-full rounded-xl px-3 py-2 border flex items-center justify-between gap-2'>
      <div className='w-full'>
        <Link
          href={`/admin/collection/${collection.id}`}
          className='font-medium hover:underline w-full block'
        >
          {collection.title}
        </Link>
        <p className='text-xs text-muted-foreground'>
          {`${collection.count} товаров`}
          {!collection.show && " · Скрыто"}
        </p>
      </div>
      <EditCollection collection={collection} />
    </div>
  );
}
