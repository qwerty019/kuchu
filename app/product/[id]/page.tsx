import {
  getGoodById,
  getGoodsByDrugId,
  getSimilarGoods,
} from "@/lib/db/good/data";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/components/product/loading";
import ProductPageView from "@/components/product/product-page-view";
import { getDops } from "@/lib/farmbazis/data";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <Suspense fallback={<Loading />}>
      <ProductSuspense id={id} />
    </Suspense>
  );
}

async function ProductSuspense({ id }: { id: string }) {
  const good = await getGoodById(id);

  if (!good) return notFound();

  const similar = await getSimilarGoods(good.id);

  const dops = await getDops({ drugId: good.drugId });
  const recs = await getGoodsByDrugId(
    dops.map((x) => x.slaveDrugId),
    good.id,
  );

  return (
    <ProductPageView good={good} similar={similar} recs={recs} />
  );
}
