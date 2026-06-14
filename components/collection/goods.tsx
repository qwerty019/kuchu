"use client";

import { CollectionInPage } from "@/lib/db/collection/definitions";
import Good from "../category/good";
import Upper from "../category/upper";

export default function Goods({
  collection,
}: {
  collection: CollectionInPage;
}) {
  return (
    <section className='space-y-4'>
      <Upper title={collection.title} />
      <section className='grid grid-cols-2 md:grid-cols-3 min-[1025px]:grid-cols-2 min-[1170px]:grid-cols-3 xl:grid-cols-4 gap-3'>
        {collection.collgoods.map((coll) => (
          <Good key={coll.good.id} good={coll.good} />
        ))}
      </section>
      {collection.collgoods.length === 0 && <Empty />}
    </section>
  );
}

function Empty() {
  return (
    <section className='flex flex-col items-center justify-center h-full gap-4'>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className='w-48'
        src='/images/empty-search.png'
        alt='По вашему запросу ничего не найдено'
      />
      <p className='text-muted-foreground text-center text-xs w-48'>
        Нет товаров в данной подборке
      </p>
    </section>
  );
}
