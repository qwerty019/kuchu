"use client";

import { Good as GoodType, GoodDetails } from "@/lib/db/good/definitions";
import GoodProductContent from "./good-product-content";

/** @deprecated Mobile uses full page; kept for drawer layout if needed */
export default function GoodDrawer({
  good,
  similar,
  recs,
}: {
  good: GoodDetails;
  similar: GoodType[];
  recs: GoodType[];
}) {
  return (
    <GoodProductContent
      good={good}
      similar={similar}
      recs={recs}
      layout='drawer'
    />
  );
}
