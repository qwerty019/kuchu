"use client";

import { useParams, usePathname } from "next/navigation";
import { Accordion, AccordionContent, AccordionItem } from "../ui/accordion";
import { useEffect } from "react";
import { useMainStore } from "@/providers/main-store-provider";
import {
  AdminLink,
  adminLinks,
  CategoryTrigger,
  NestedCategory,
} from "./category-components";
import { Skeleton } from "../ui/skeleton";
import Cert from "../main/cert";
import { fetchCategoriesForLeftSide } from "@/lib/db/category/data";
import { fetchShowedCertOptions } from "@/lib/db/certoption/data";

export default function CategoryLinks({
  setOpen,
}: {
  setOpen?: (open: boolean) => void;
}) {
  const { cat } = useParams();

  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  const { setCategories, categories, setCertOptions, certOptions } =
    useMainStore((state) => state);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const list = await fetchCategoriesForLeftSide();
        setCategories(list);
      } catch (err) {
        console.log(err);
      }
    }

    fetchCategories();
  }, [setCategories]);

  useEffect(() => {
    async function fetchOptions() {
      try {
        const options = await fetchShowedCertOptions();
        setCertOptions(options);
      } catch (err) {
        console.log(err);
      }
    }

    fetchOptions();
  }, [setCertOptions]);

  if (isAdmin) {
    return (
      <section className='space-y-4 overflow-y-auto scrollbar-hide h-full'>
        {adminLinks.map((link, i) => (
          <AdminLink key={i} link={link} />
        ))}
      </section>
    );
  }

  if (!categories.length) {
    return (
      <div className='space-y-4'>
        {Array.from({ length: 8 }, (_, i) => (
          <Skeleton key={i} className='h-8' />
        ))}
      </div>
    );
  }

  return (
    <Accordion
      type='single'
      collapsible
      className='w-full space-y-4 shrink-0 overflow-y-auto scrollbar-hide h-full'
      defaultValue={
        typeof cat === "string"
          ? categories?.find((c) => c.children.find((x) => x.route === cat))
              ?.route
          : undefined
      }
    >
      {certOptions.length > 0 ? <Cert options={certOptions} /> : null}
      {categories?.map((category) => (
        <AccordionItem
          key={category.id}
          value={category.route}
          className='border-none'
        >
          <CategoryTrigger category={category} />
          {category.children?.length > 0 ? (
            <AccordionContent className='pt-4 pb-0 space-y-3'>
              {category.children.map((child) => (
                <NestedCategory
                  key={child.id}
                  child={child}
                  setOpen={setOpen}
                />
              ))}
            </AccordionContent>
          ) : null}
        </AccordionItem>
      ))}
    </Accordion>
  );
}
