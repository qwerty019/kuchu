"use client";

import { useEffect } from "react";
import { useParams } from "next/navigation";
import { ChevronRight, Pill } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import Cert from "@/components/main/cert";
import { fetchCategoriesForLeftSide } from "@/lib/db/category/data";
import { fetchShowedCertOptions } from "@/lib/db/certoption/data";
import { CategoryLeftSide } from "@/lib/db/category/schema";
import { searchListDividerClass } from "@/lib/footer-links";
import { useMainStore } from "@/providers/main-store-provider";
import { cn } from "@/lib/utils";
import { CatalogListRow, CatalogListSubRow } from "./catalog-list-row";

export default function SearchCatalogList() {
  const { cat } = useParams();
  const { categories, setCategories, certOptions, setCertOptions } =
    useMainStore((s) => s);

  useEffect(() => {
    async function load() {
      try {
        const [list, options] = await Promise.all([
          fetchCategoriesForLeftSide(),
          fetchShowedCertOptions(),
        ]);
        setCategories(list);
        setCertOptions(options);
      } catch (err) {
        console.log(err);
      }
    }
    load();
  }, [setCategories, setCertOptions]);

  if (!categories.length) {
    return (
      <section className='w-full'>
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className={searchListDividerClass}>
            <Skeleton className='my-4 h-10 w-full' />
          </div>
        ))}
      </section>
    );
  }

  return (
    <section className='w-full'>
      {certOptions.length > 0 && (
        <div className={cn(searchListDividerClass, "py-4")}>
          <Cert options={certOptions} />
        </div>
      )}

      <Accordion type='single' collapsible className='w-full'>
        {categories.map((category) => (
          <SearchCategoryBlock
            key={category.id}
            category={category}
            activeChildRoute={typeof cat === "string" ? cat : undefined}
          />
        ))}
      </Accordion>
    </section>
  );
}

function SearchCategoryBlock({
  category,
  activeChildRoute,
}: {
  category: CategoryLeftSide;
  activeChildRoute?: string;
}) {
  const hasChildren = category.children.length > 0;
  const isChildActive = category.children.some(
    (c) => c.route === activeChildRoute,
  );

  if (!hasChildren) {
    return (
      <CatalogListRow
        href={`/category/${category.route}`}
        showChevron
        active={activeChildRoute === category.route}
      >
        <CategoryLabel category={category} />
      </CatalogListRow>
    );
  }

  return (
    <AccordionItem value={category.route} className='border-none'>
      <AccordionTrigger
        className={cn(
          searchListDividerClass,
          "group py-4 hover:no-underline [&>svg]:hidden",
          isChildActive && "text-[#A03968]",
        )}
      >
        <div className='flex w-full items-center justify-between gap-3'>
          <CategoryLabel category={category} />
          <ChevronRight
            className='h-5 w-5 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-90'
            aria-hidden
          />
        </div>
      </AccordionTrigger>
      <AccordionContent className='pb-0 pt-0'>
        {category.children.map((child) => (
          <CatalogListSubRow
            key={child.id}
            href={`/category/${child.route}`}
            active={activeChildRoute === child.route}
          >
            {child.title}
          </CatalogListSubRow>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function CategoryLabel({ category }: { category: CategoryLeftSide }) {
  return (
    <div className='flex min-w-0 flex-1 items-center gap-3'>
      <Avatar className='h-8 w-8 shrink-0 rounded-md'>
        <AvatarImage
          src={category.url || undefined}
          alt={category.title}
          className='h-8 w-8 rounded-md object-cover'
        />
        <AvatarFallback className='flex h-8 w-8 items-center justify-center rounded-md bg-[#F2F2F2] text-muted-foreground'>
          <Pill className='h-4 w-4' />
        </AvatarFallback>
      </Avatar>
      <span className='text-base font-semibold leading-tight'>
        {category.title}
      </span>
    </div>
  );
}
