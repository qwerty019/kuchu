"use client";

import Upper from "@/components/category/upper";
import { Good, GoodDetails } from "@/lib/db/good/definitions";
import GoodProductContent from "./good-product-content";

export default function GoodProductMobile({
  good,
  similar,
  recs,
}: {
  good: GoodDetails;
  similar: Good[];
  recs: Good[];
}) {
  const title = good.title || good.drug;

  return (
    <div className='flex flex-col gap-4'>
      <Upper title={title} />
      <GoodProductContent
        good={good}
        similar={similar}
        recs={recs}
        layout='page'
      />
    </div>
  );
}
