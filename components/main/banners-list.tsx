"use client";

import { PageBanner } from "@/lib/db/banner/schema";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";

const delay = 6000;

/** Высота слайда: мобилка — 2/3 экрана над нижней навигацией; десктоп — фикс. */
const bannerSlideHeight =
  "max-lg:home-banner-mobile-height lg:h-[220px]";

export default function BannersList({ banners }: { banners: PageBanner[] }) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className='flex w-full shrink-0 max-lg:home-banner-mobile-height lg:-mx-4'>
      <Carousel
        setApi={setApi}
        plugins={[Autoplay({ delay })]}
        className={`w-full overflow-hidden relative max-lg:rounded-none lg:rounded-2xl ${bannerSlideHeight}`}
      >
        <CarouselContent className={`w-full ml-0 ${bannerSlideHeight}`}>
          {banners.map((b) => (
            <CarouselItem
              key={b.id}
              className={`relative w-full pl-0 ${bannerSlideHeight}`}
            >
              <Avatar className={`w-full rounded-none ${bannerSlideHeight}`}>
                <AvatarImage
                  src={b.img}
                  alt={b.title}
                  className='w-full h-full object-cover'
                />
                <AvatarFallback className='w-full h-full rounded-none flex items-center justify-center' />
              </Avatar>
              <div className='absolute bottom-4 left-4 z-10 flex max-w-[calc(100%-7rem)] flex-col items-start gap-3'>
                <p className='text-base sm:text-3xl lg:text-3xl leading-tight text-white font-medium whitespace-pre-line text-left'>
                  {b.title}
                </p>
                {b.subtitle && (
                  <Button
                    size='sm'
                    className='bg-white hover:bg-accent text-[#A03968] rounded-full w-fit max-lg:h-7 max-lg:px-3 max-lg:text-xs lg:h-8 lg:px-4 lg:text-sm'
                    asChild
                  >
                    <a
                      href={b.subtitle || "#"}
                      className='flex items-center gap-1'
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      <p>Подробнее</p>
                      <ChevronRight className='max-lg:w-3.5 max-lg:h-3.5 lg:w-4 lg:h-4' />
                    </a>
                  </Button>
                )}
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <Button
          className='p-0 flex items-center justify-center absolute h-8 w-8 rounded-full right-[52px] bottom-4 bg-white/50'
          variant='secondary'
          onClick={() => api?.scrollPrev()}
          disabled={current === 1}
        >
          <ChevronLeft className='w-4 h-4 text-white' />
        </Button>
        <Button
          className='p-0 flex items-center justify-center absolute h-8 w-8 rounded-full right-4 bottom-4 bg-white/50'
          variant='secondary'
          onClick={() => api?.scrollNext()}
          disabled={current === count}
        >
          <ChevronRight className='w-4 h-4 text-white' />
        </Button>
      </Carousel>
    </section>
  );
}
