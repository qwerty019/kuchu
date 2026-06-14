"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Loader2 } from "lucide-react";
import Good from "../category/good";
import { GoodWithOsts } from "@/lib/db/new-search/definitions";
import { getGoodsOnClient } from "@/lib/db/new-search/search";
import { toast } from "sonner";

export default function GoodResults({
  initial,
  total,
  allMatchingIds,
  matchingGoodIds,
  branchId,
  query,
}: {
  initial: GoodWithOsts[];
  total: number;
  allMatchingIds: { goodId: number }[];
  matchingGoodIds: { goodId: number }[];
  branchId: number;
  query: string;
}) {
  const [array, setArray] = useState(initial);
  const [clicked, setClicked] = useState(false);
  const [page, setPage] = useState(1);

  const handleLoad = async () => {
    if (clicked) return;
    if (array.length === total) return;

    setClicked(true);

    try {
      const searchResults = await getGoodsOnClient(
        allMatchingIds,
        matchingGoodIds,
        branchId,
        query,
        page + 1
      );

      setArray((prev) => [...prev, ...searchResults]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.log(err);
      toast.error("Что-то пошло не так. Попробуйте еще.");
    } finally {
      setClicked(false);
    }
  };

  if (array.length === 0) {
    return (
      <section className='flex flex-col items-center justify-center gap-4'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className='w-48'
          src='/images/empty-search.png'
          alt='По вашему запросу ничего не найдено'
        />
        <p className='text-muted-foreground text-center text-xs w-48'>
          Ничего не найдено с выбранными фильтрами
        </p>
      </section>
    );
  }

  return (
    <section className='flex flex-col gap-4'>
      <section className='grid grid-cols-2 md:grid-cols-3 min-[1025px]:grid-cols-2 min-[1170px]:grid-cols-3 xl:grid-cols-4 gap-3'>
        {array.map(({ osts, ...rest }) => (
          <Good key={rest.id} good={{ ...rest, ost: osts }} />
        ))}
      </section>
      {array.length > 0 ? (
        <p className='text-muted-foreground text-xs mx-auto'>
          Загружено {array.length} из {total}
        </p>
      ) : null}
      {array.length !== total && (
        <Button
          variant='outline'
          className='rounded-full w-fit mx-auto'
          size='sm'
          onClick={() => handleLoad()}
          disabled={clicked}
        >
          {clicked ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            "Загрузить еще"
          )}
        </Button>
      )}
    </section>
  );
}
