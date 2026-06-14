import ProductMobileOverlay from "@/components/product/product-mobile-overlay";
import {
  getGoodById,
  getGoodsByDrugId,
  getSimilarGoods,
} from "@/lib/db/good/data";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Loading from "@/components/product/loading";
import { ProductModal } from "@/components/product/product-modal";

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

  const recs = await getGoodsByDrugId([good.drugId], good.id);

  return (
    <>
      <ProductMobileOverlay good={good} similar={similar} recs={recs} />
      <ProductModal
        className='flex h-full flex-col'
        good={good}
        similar={similar}
        recs={recs}
      />
    </>
  );
}
