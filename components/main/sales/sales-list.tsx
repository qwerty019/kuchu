"use client";

import { Sale as SaleType } from "@/lib/db/sale/definitions";
import Sale from "./sale";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef, useState, useEffect } from "react";

export default function SalesList({ sales }: { sales: SaleType[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScrollPosition();
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScrollPosition);
      return () =>
        scrollContainer.removeEventListener("scroll", checkScrollPosition);
    }
  }, []);

  const scrollLeft = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    if (!scrollContainerRef.current) return;
    scrollContainerRef.current.scrollBy({ left: 250, behavior: "smooth" });
  };

  if (sales.length === 0) {
    return null;
  }

  return (
    <section className='space-y-3'>
      <div className='flex items-center justify-between mr-4'>
        <h2 className='text-xl md:text-3xl font-semibold'>Акции и подборки</h2>
        <div className='hidden lg:flex items-center gap-1'>
          <Button
            variant='secondary'
            size='icon'
            className='rounded-full w-8 h-8 bg-[#D6D6D6] text-white'
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className='w-4 h-4' />
          </Button>
          <Button
            variant='secondary'
            size='icon'
            className='rounded-full w-8 h-8 bg-[#D6D6D6] text-white'
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <ChevronRight className='w-4 h-4' />
          </Button>
        </div>
      </div>
      <section
        ref={scrollContainerRef}
        className='flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4'
      >
        {sales.map((sale) => (
          <Sale key={sale.id} sale={sale} />
        ))}
      </section>
    </section>
  );
}
