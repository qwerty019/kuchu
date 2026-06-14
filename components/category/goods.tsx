"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight, CheckSquare, Square } from "lucide-react";
import { useState } from "react";
import Upper from "./upper";
import Nested from "./nested";
import Good from "./good";
import { CategoryForPage } from "@/lib/db/category/schema";
import { usePathname, useSearchParams } from "next/navigation";

export default function Goods({ category }: { category: CategoryForPage }) {
  const { children } = category;
  const [expand, setExpand] = useState(3);

  if (children.length === 0) {
    return (
      <section className='space-y-4'>
        <Upper title={category.title} />
        <OnlyInStock />
        <section className='grid grid-cols-2 md:grid-cols-3 min-[1025px]:grid-cols-2 min-[1170px]:grid-cols-3 xl:grid-cols-4 gap-3'>
          {category.goods.map((good) => (
            <Good key={good.id} good={good} />
          ))}
        </section>
        {category.goods.length === 0 && <Empty />}
      </section>
    );
  }

  return (
    <section className='space-y-4'>
      <Upper title={category.title} />
      <OnlyInStock />
      <Nested nested={children} />
      {category.goods.length > 0 && (
        <section className='grid grid-cols-2 md:grid-cols-3 min-[1025px]:grid-cols-2 min-[1170px]:grid-cols-3 xl:grid-cols-4 gap-3'>
          {category.goods.slice(0, expand).map((good) => (
            <Good key={good.id} good={good} />
          ))}
          {category.goods.length > 2 ? (
            <ExpandButton
              expand={expand}
              setExpand={setExpand}
              category={category}
            />
          ) : null}
        </section>
      )}
      {children.map((c) => (
        <section key={c.id} className='space-y-4'>
          <h2 className='leading-none w-full scroll-m-20 text-2xl font-bold tracking-tight'>
            {c.title}
          </h2>
          <section className='grid grid-cols-2 md:grid-cols-3 min-[1025px]:grid-cols-2 min-[1170px]:grid-cols-3 xl:grid-cols-4 gap-3'>
            {c.goods.slice(0, 3).map((good) => (
              <Good key={good.id} good={good} />
            ))}
            {c.goods.length > 3 ? <MoreButton route={c.route} /> : null}
          </section>
        </section>
      ))}
    </section>
  );
}

function ExpandButton({
  expand,
  setExpand,
  category,
}: {
  expand: number;
  setExpand: React.Dispatch<React.SetStateAction<number>>;
  category: CategoryForPage;
}) {
  return (
    <Button
      variant='secondary'
      className='flex items-center justify-center w-full h-auto aspect-square bg-[#F2F2F2] rounded-2xl'
      onClick={() =>
        setExpand((exp) => (exp === 3 ? category.goods.length : 3))
      }
    >
      <div className='py-3 px-4 rounded-full bg-background flex items-center justify-center gap-1'>
        <p className='font-medium text-sm'>
          {expand === 3 ? "Больше" : "Меньше"}
        </p>
        {expand === 3 ? (
          <ArrowRight className='w-4 h-4' />
        ) : (
          <ArrowLeft className='w-4 h-4' />
        )}
      </div>
    </Button>
  );
}

function MoreButton({ route }: { route: string }) {
  return (
    <Link href={`/category/${route}`} className='w-full block'>
      <div className='flex items-center justify-center w-full aspect-square bg-[#F2F2F2] rounded-2xl'>
        <div className='py-3 px-4 rounded-full bg-background flex items-center justify-center gap-1'>
          <p className='font-medium text-sm'>Больше</p>
          <ArrowRight className='w-4 h-4' />
        </div>
      </div>
    </Link>
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
        Нет товаров в данной категории
      </p>
    </section>
  );
}

function OnlyInStock() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const stock = searchParams.get("stock");

  const stockUrl = getStockUrl(stock, pathname, searchParams);

  return (
    <section className='flex items-center gap-1 flex-wrap'>
      <Button
        variant='secondary'
        size='sm'
        className='rounded-full gap-2 bg-[#A03968] hover:bg-[#A03968]/80 text-xs text-white'
        asChild
      >
        <Link href={stockUrl}>
          {!stock ? (
            <CheckSquare className='w-4 h-4' />
          ) : (
            <Square className='w-4 h-4' />
          )}
          Только доступные
        </Link>
      </Button>
    </section>
  );
}

function getStockUrl(
  stock: string | null,
  pathname: string,
  searchParams: URLSearchParams
) {
  const params = new URLSearchParams(searchParams);

  if (stock) {
    params.delete("stock");
  } else {
    params.set("stock", "false");
  }

  return `${pathname}?${params.toString()}`;
}
