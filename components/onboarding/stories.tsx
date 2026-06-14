"use client";

import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "../ui/carousel";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { Onboarding } from "@/stores/main-store";
import { useMainStore } from "@/providers/main-store-provider";
import { DeliveryZone } from "@/lib/db/deliveryzone/schema";
import Image from "next/image";

export default function Stories({
  open,
  setOnboarding,
}: {
  open: boolean;
  setOnboarding: (
    onboarding: Onboarding | ((prev: Onboarding) => Onboarding),
  ) => void;
}) {
  const { zones } = useMainStore((state) => state);
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

  const zonesText = getZonesText(zones);
  const defaultText = "Доставим любые безрецептурные лекарства";
  const text = zonesText ? `${defaultText}\n\n${zonesText}` : defaultText;

  return (
    <Dialog
      open={open}
      onOpenChange={(bool) => {
        if (!bool) {
          if (current !== slides.length) return;
          setOnboarding((prev) => {
            const newInfo: Onboarding = { ...prev, stories: "true" };
            localStorage.setItem("onboarding", JSON.stringify(newInfo));
            return newInfo;
          });
        } else {
          setOnboarding((prev) => ({ ...prev, stories: "show" }));
        }
      }}
    >
      <DialogContent className='sm:max-w-[425px] p-0 [&_.close-dialog]:hidden bg-transparent relative'>
        <div className='z-10 w-full absolute px-4 top-4 left-1/2 -translate-x-1/2 flex items-center gap-4'>
          <div className='w-full flex gap-2'>
            {slides.map((_, i) => (
              <div
                key={i}
                className={`${i + 1 === current ? "active-bullet" : ""
                  } w-full bg-white/50 h-1 rounded-full overflow-hidden`}
              >
                <div className='h-1' />
              </div>
            ))}
          </div>
          {current === slides.length && (
            <DialogClose asChild>
              <Button
                type='button'
                variant='secondary'
                className='z-10 p-2 flex items-center justify-center bg-accent rounded-full h-auto'
              >
                <X className='w-4 h-4' />
              </Button>
            </DialogClose>
          )}
        </div>
        <Carousel
          setApi={setApi}
          className='w-full overflow-hidden rounded-xl relative'
        >
          <CarouselContent className='h-full ml-0'>
            {slides.map((slide) => {
              if (slide.version === 2) {
                return (
                  <SlideVersion2
                    key={slide.id}
                    slide={slide}
                    current={current}
                    api={api}
                    setOnboarding={setOnboarding}
                    zones={zones}
                  />
                );
              }

              return (
                <SlideVersion1
                  key={slide.id}
                  slide={slide}
                  current={current}
                  api={api}
                  setOnboarding={setOnboarding}
                />
              );
            })}
          </CarouselContent>
          {current !== 1 && (
            <Button
              className='p-0 flex items-center justify-center absolute h-8 w-8 rounded-full left-3 top-1/2 -translate-y-1/2 bg-white/50'
              variant='secondary'
              onClick={() => api?.scrollPrev()}
            >
              <ChevronLeft className='w-4 h-4 text-white' />
            </Button>
          )}
          {current !== count && (
            <Button
              className='p-0 flex items-center justify-center absolute h-8 w-8 rounded-full right-3 top-1/2 -translate-y-1/2 bg-white/50 text-white'
              variant='secondary'
              onClick={() => api?.scrollNext()}
            >
              <ChevronRight className='w-4 h-4 text-white' />
            </Button>
          )}
        </Carousel>
      </DialogContent>
    </Dialog>
  );
}

function SlideVersion2({
  zones,
  slide,
  current,
  api,
  setOnboarding,
}: {
  zones: DeliveryZone[];
  slide: Slide;
  current: number;
  api: CarouselApi;
  setOnboarding: React.Dispatch<React.SetStateAction<Onboarding>>;
}) {
  const freeDeliveries = zones.map((zone) => zone.freeDelivery);
  const uniqueFreeDeliveries = new Set(freeDeliveries);
  const isSameFreeDelivery = uniqueFreeDeliveries.size === 1;

  return (
    <CarouselItem className='pl-0 relative bg-[#A03968] max-h-[558px]'>
      <div className='p-8 pt-12 space-y-1'>
        <div>
          <DialogTitle className='text-white whitespace-pre-line text-2xl'>
            {slide.title}
          </DialogTitle>
          {/* {slide.subtitle && (
          <p className='text-white/50 text-base'>{slide.subtitle}</p>
        )} */}
        </div>
        <DialogDescription className='text-white/80 text-white whitespace-pre-line'>
          {slide.text}
        </DialogDescription>
      </div>
      <div className='relative'>
        <Image
          src={slide.img}
          alt={slide.title}
          width={485}
          height={604}
          quality={100}
          className='w-full h-full object-cover rounded-xl'
          priority
        />
        {zones.length > 0 && (
          <div className='absolute z-10 top-8 left-8 rounded-xl bg-white p-3'>
            {zones.map((zone) => (
              <div key={zone.id}>
                <div key={zone.id} className='flex items-center gap-1'>
                  <div
                    className='w-2 h-2 rounded-full'
                    style={{ backgroundColor: zone.color }}
                  />
                  <p className='text-xs'>
                    {zone.title} - от {zone.threshold}₽ заказ - {zone.price}₽
                    доставка
                  </p>
                </div>
                {!isSameFreeDelivery && zone.freeDelivery && (
                  <p className='text-xs ml-3 text-muted-foreground'>
                    Бесплатно от {zone.freeDelivery}₽
                  </p>
                )}
              </div>
            ))}
            {isSameFreeDelivery && (
              <p className='text-xs ml-3 mt-3'>
                Бесплатно от {zones[0].freeDelivery}₽
              </p>
            )}
          </div>
        )}
      </div>
      <Button
        className='absolute bottom-6 left-1/2 -translate-x-1/2 bg-white hover:bg-accent text-primary rounded-full w-4/5 focus-visible:ring-0 focus-visible:ring-offset-0'
        onClick={() => {
          if (current !== slides.length) {
            api?.scrollNext();
          } else {
            setOnboarding((prev) => {
              const newInfo: Onboarding = {
                ...prev,
                stories: "true",
              };
              localStorage.setItem("onboarding", JSON.stringify(newInfo));
              return newInfo;
            });
          }
        }}
      >
        {slide.btnText}
      </Button>
    </CarouselItem>
  );
}

function SlideVersion1({
  slide,
  current,
  api,
  setOnboarding,
}: {
  slide: Slide;
  current: number;
  api: CarouselApi;
  setOnboarding: React.Dispatch<React.SetStateAction<Onboarding>>;
}) {
  return (
    <CarouselItem className='pl-0 relative max-h-[558px]'>
      <div className='z-20 absolute top-20 left-0 px-8 space-y-1'>
        <div>
          <DialogTitle className='text-white whitespace-pre-line'>
            {slide.title}
          </DialogTitle>
          {/* {slide.subtitle && (
          <p className='text-white/50 text-base'>{slide.subtitle}</p>
        )} */}
        </div>
        <DialogDescription className='text-white/80 text-white whitespace-pre-line'>
          {slide.text}
        </DialogDescription>
      </div>
      <div className='z-10 absolute inset-0 h-1/2 bg-gradient-to-b from-black/50' />
      <Image
        src={slide.img}
        alt={slide.title}
        width={485}
        height={799}
        quality={100}
        className='w-full h-full object-cover aspect-[3/4] rounded-xl'
        priority
      />
      <Button
        className='absolute bottom-6 left-1/2 -translate-x-1/2 bg-white hover:bg-accent text-primary rounded-full w-4/5 focus-visible:ring-0 focus-visible:ring-offset-0'
        onClick={() => {
          if (current !== slides.length) {
            api?.scrollNext();
          } else {
            setOnboarding((prev) => {
              const newInfo: Onboarding = {
                ...prev,
                stories: "true",
              };
              localStorage.setItem("onboarding", JSON.stringify(newInfo));
              return newInfo;
            });
          }
        }}
      >
        {slide.btnText}
      </Button>
    </CarouselItem>
  );
}

const slides: Slide[] = [
  {
    id: 1,
    version: 2,
    title: "Доставка \nс 8:00 до 23:00",
    text: "Доставим любые безрецептурные лекарства",
    btnText: "Далее",
    img: "/images/onboarding/map-story-1.png",
  },
  {
    id: 2,
    version: 1,
    title: "Мы всегда рядом",
    text: "На пути могут возникать технические сложности — напишите нам, и мы обязательно исправим!",
    btnText: "За покупками",
    img: "/images/onboarding/story-2.png",
  },
];

function getZonesText(zones: DeliveryZone[]) {
  if (!zones || zones.length === 0) return null;

  const zonesText = zones
    .map((z) => `${z.title} - от ${z.threshold}₽ заказ - ${z.price}₽ доставка`)
    .join("\n");
  const freeDelivery = zones.reduce(
    (min, zone) =>
      zone.freeDelivery && (min === null || zone.freeDelivery < min)
        ? zone.freeDelivery
        : min,
    zones[0].freeDelivery,
  );
  const freeDeliveryText = `Бесплатно от ${freeDelivery}₽`;

  const text = `${zonesText}\n\n${freeDeliveryText}`;

  return text;
}

type Slide = {
  id: number;
  version: number;
  title: string;
  text: string;
  btnText: string;
  img: string;
};
