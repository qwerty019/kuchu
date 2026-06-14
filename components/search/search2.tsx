"use client";

import { SearchIcon, X } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import NavSheet from "../nav/nav-sheet";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SearchOnboarding } from "../onboarding/search";
import { useMainStore } from "@/providers/main-store-provider";

export default function Search2({
  className,
  hideOnMobile,
  hideCatalogButton,
}: {
  className?: string;
  /** Hide sticky search + catalog sheet on small screens (use bottom nav instead) */
  hideOnMobile?: boolean;
  /** На /search каталог уже на странице — без бургера NavSheet */
  hideCatalogButton?: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const blurTimeoutRef = useRef<NodeJS.Timeout>();

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const { onboarding, setOnboarding } = useMainStore((state) => state);

  const [query, setQuery] = useState(
    searchParams.get("query")?.toString() || ""
  );
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isFocused, setIsFocused] = useState(false);

  const suggestionSearch = useDebouncedCallback(async (term) => {
    if (!term) return;

    try {
      const res = await fetch(`/api/suggestions?query=${term}`);

      if (!res.ok) {
        throw new Error("Ошибка при получении данных.");
      }

      const data: { title: string }[] = await res.json();

      setSuggestions(data.map((g) => g.title));
    } catch (err) {
      console.log(err);
    }
  }, 300);

  const handleSearch = (query: string) => {
    if (!query) return;

    if (pathname === "/search") {
      router.replace(`/search?query=${query}`);
    } else {
      router.push(`/search?query=${query}`);
    }
  };

  return (
    <div
      className={cn(
        "w-full bg-background py-4",
        hideCatalogButton
          ? "relative"
          : "sticky top-0 z-20 max-lg:top-0 lg:top-[80px]",
        "lg:-mx-4 lg:px-4",
        hideOnMobile && "hidden lg:block",
        className
      )}
    >
      <div className='relative z-20 flex items-center gap-3'>
        <div className='relative min-w-0 w-full flex-1'>
          <div className='z-30 absolute top-1/2 left-4 -translate-y-1/2 text-muted-foreground'>
            <SearchIcon className='w-4 h-4 text-primary' />
          </div>
          <Input
            ref={inputRef}
            className='w-full z-20 relative bg-[#F2F2F2] border-none rounded-full pl-10 text-xs focus-visible:ring-0 focus-visible:ring-transparent search-component'
            placeholder={
              isDesktop
                ? "Найти в аптеке по названию или симптомам"
                : "Найти по названию или симптомам"
            }
            onChange={(e) => {
              setQuery(e.target.value);
              suggestionSearch(e.target.value);
            }}
            value={query}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(query);
            }}
            onFocus={() => {
              setIsFocused(true);
              if (onboarding.search !== "true" && onboarding.mounted) {
                setOnboarding((prev) => ({ ...prev, search: "show" }));
              }
            }}
            onBlur={() => {
              if (blurTimeoutRef.current) {
                clearTimeout(blurTimeoutRef.current);
              }
              blurTimeoutRef.current = setTimeout(() => {
                setIsFocused(false);
              }, 200);
            }}
          />
          {query && suggestions.length > 0 && isFocused && (
            <div className='absolute z-10 top-0 left-0 bg-white rounded-[20px] overflow-hidden space-y-1 w-full border'>
              <div className='mt-10'>
                {suggestions.map((s, i) => (
                  <Button
                    key={i}
                    variant='ghost'
                    className='w-full h-auto justify-start font-normal text-xs p-2 hover:bg-accent flex items-center gap-2 cursor-pointer'
                    onClick={(e) => {
                      e.preventDefault();

                      setQuery(s);
                      setSuggestions([]);
                      setIsFocused(false);

                      if (pathname === "/search") {
                        router.replace(`/search?query=${s}`);
                      } else {
                        router.push(`/search?query=${s}`);
                      }
                    }}
                  >
                    <SearchIcon className='w-4 h-4 text-muted-foreground' />
                    <p>{s}</p>
                  </Button>
                ))}
              </div>
            </div>
          )}
          {query && (
            <div className='z-30 absolute top-1/2 right-0 p-1 -translate-y-1/2 flex gap-1 items-center'>
              <Button size='icon' variant='link' className='p-0 h-4 w-4'>
                <X
                  className='w-4 h-4'
                  onClick={() => {
                    setQuery("");
                    setSuggestions([]);
                  }}
                />
              </Button>
              <Button
                className='h-8 bg-white hover:bg-accent text-primary rounded-full border'
                onClick={() => handleSearch(query)}
              >
                Поиск
              </Button>
            </div>
          )}
        </div>
        {!hideCatalogButton && (
          <div className='shrink-0 lg:hidden'>
            <NavSheet />
          </div>
        )}
      </div>
      {!hideCatalogButton && (
        <>
          <div className='absolute top-4 -right-4 z-20 h-[56px] w-4 bg-background max-lg:block lg:hidden' />
          <div className='absolute top-4 -left-4 z-20 h-[56px] w-4 bg-background max-lg:block lg:hidden' />
        </>
      )}
      <SearchOnboarding />
    </div>
  );
}
