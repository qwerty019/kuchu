"use client";

import Good from "@/components/category/good";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Good as GoodType } from "@/lib/db/good/definitions";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/providers/cart-store-provider";
import { useMainStore } from "@/providers/main-store-provider";
import { useEffect, useState } from "react";

export default function Recomendations() {
  const [isLoading, setIsLoading] = useState(false);
  const [recs, setRecs] = useState<GoodType[]>([]);

  const { items } = useCartStore((state) => state);
  const { branch } = useMainStore((state) => state);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    if (items.length === 0) return;

    setIsLoading(true);

    const fetchGoods = async () => {
      try {
        const params = new URLSearchParams();
        params.set("regIds", items.map((x) => x.regId).join(","));
        params.set("branchId", branch || "");
        const res = await fetch(`/api/dops?${params.toString()}`);
        const data = await res.json();
        //setRecs(data);
        setRecs(res.ok && Array.isArray(data) ? data : []);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGoods();
  }, [items, branch]);

  if (isLoading) return <Loading />;

  return (
    <section
      className={cn(
        "flex flex-col flex-1 bg-background rounded-2xl gap-4",
        isDesktop ? "p-4" : "py-4 mb-4"
      )}
    >
      <p className={cn("font-semibold text-lg", !isDesktop && "px-4")}>
        Добавить к заказу?
      </p>
      <div className={cn(isDesktop ? "overflow-y-auto max-h-[540px]" : "")}>
        <section
          className={cn(
            isDesktop
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
              : "flex gap-2 overflow-x-auto scrollbar-hide px-4"
          )}
        >
          {recs.map((good) => (
            <Good
              key={good.id}
              good={good}
              className={cn("text-xs", !isDesktop && "w-[120px]")}
              imgClassName={cn(!isDesktop && "!w-[120px] !h-[120px]")}
              similar
            />
          ))}
        </section>
      </div>
    </section>
  );
}

function Loading() {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <section
      className={cn(
        "flex flex-col flex-1 bg-background rounded-2xl gap-4",
        isDesktop ? "p-4" : "py-4 mb-4"
      )}
    >
      <p className={cn("font-semibold text-lg", !isDesktop && "px-4")}>
        Добавить к заказу?
      </p>
      <section
        className={cn(
          isDesktop
            ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2"
            : "flex gap-2 overflow-x-auto scrollbar-hide px-4"
        )}
      >
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className='space-y-1.5'>
            <Skeleton
              className={cn(
                "w-full h-auto aspect-square rounded-2xl",
                !isDesktop ? "w-[120px] h-[120px]" : "w-full h-auto"
              )}
            />
            <Skeleton className='w-4/5 h-3 rounded-full' />
            <Skeleton className='w-3/5 h-3 rounded-full' />
            <Skeleton className='w-2/3 h-8 rounded-full' />
          </div>
        ))}
      </section>
    </section>
  );
}
