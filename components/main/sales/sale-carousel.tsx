import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import { CarouselApi } from "@/components/ui/carousel";
import { Sale } from "@/lib/db/sale/definitions";
import { DrawerClose } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const delay = 3000;

export default function SaleCarousel({
  isDrawer,
  sale,
}: {
  sale: Sale;
  isDrawer?: boolean;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!api) return;

    const onPointerDown = () => {
      if (api.scrollSnapList().length === api.selectedScrollSnap() + 1) {
        return;
      }
      api.plugins().autoplay.stop();
      setIsPlaying(false);
    };

    const onPointerUp = () => {
      api.plugins().autoplay.play();
      setIsPlaying(true);
    };

    const onSelect = () => {
      if (api.scrollSnapList().length === api.selectedScrollSnap() + 1) {
        setCurrent(api.selectedScrollSnap() + 1);
        api.plugins().autoplay.stop();
        return;
      } else {
        api.plugins().autoplay.play();
      }
      setCurrent(api.selectedScrollSnap() + 1);
      api.plugins().autoplay.reset();
    };

    api.on("pointerDown", onPointerDown);

    api.on("pointerUp", onPointerUp);

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", onSelect);

    return () => {
      api.off("pointerDown", onPointerDown);
      api.off("pointerUp", onPointerUp);
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <div className='w-full md:w-1/2 relative'>
      <div className='z-10 w-full absolute px-4 top-4 left-1/2 -translate-x-1/2 flex gap-4'>
        <div className='w-full flex gap-2'>
          {sale.images && sale.images.length > 1
            ? sale.images.map((_, i) => (
                <div
                  key={i}
                  className={`${
                    i + 1 === current ? "active-bullet" : ""
                  } w-full bg-white/50 h-1 rounded-full overflow-hidden`}
                >
                  <div
                    className='h-1'
                    style={{
                      animationPlayState: isPlaying ? "running" : "paused",
                    }}
                  />
                </div>
              ))
            : null}
        </div>
        {isDrawer && (
          <DrawerClose asChild>
            <Button
              type='button'
              variant='secondary'
              className='p-2 flex items-center justify-center bg-background rounded-full h-auto'
            >
              <X className='w-4 h-4' />
            </Button>
          </DrawerClose>
        )}
      </div>
      <Carousel
        setApi={setApi}
        plugins={[Autoplay({ delay })]}
        className='w-full overflow-hidden rounded-xl relative'
      >
        <CarouselContent className='h-full'>
          {sale.images &&
            sale.images.map((img, i) => (
              <CarouselItem key={i} className='pl-0'>
                <Avatar className='w-full h-full rounded-xl'>
                  <AvatarImage
                    src={img}
                    alt=''
                    className='w-full h-full aspect-square md:aspect-[3/4] object-cover'
                  />
                  <AvatarFallback className='w-full h-full aspect-square md:aspect-[3/4] object-cover rounded-xl' />
                </Avatar>
              </CarouselItem>
            ))}
        </CarouselContent>
        {!isDrawer && current !== 1 && (
          <Button
            className='p-0 flex items-center justify-center absolute h-8 w-8 rounded-full left-3 top-1/2 -translate-y-1/2 bg-white/50'
            variant='secondary'
            onClick={() => api?.scrollPrev()}
          >
            <ChevronLeft className='w-4 h-4 text-white' />
          </Button>
        )}
        {!isDrawer && current !== count && (
          <Button
            className='p-0 flex items-center justify-center absolute h-8 w-8 rounded-full right-3 top-1/2 -translate-y-1/2 bg-white/50 text-white'
            variant='secondary'
            onClick={() => api?.scrollNext()}
          >
            <ChevronRight className='w-4 h-4 text-white' />
          </Button>
        )}
      </Carousel>
    </div>
  );
}
