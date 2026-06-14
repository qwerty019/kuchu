import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import {
  DialogClose,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogContent } from "@/components/ui/dialog";
import { PageStory } from "@/lib/db/story/definitions";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const delay = 3000;

export default function StoryCarousel({
  story,
  setOpen,
}: {
  story: PageStory;
  setOpen: (open: boolean) => void;
}) {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!api) return;

    const onPointerDown = () => {
      if (api.scrollSnapList().length === 1) {
        return;
      }
      api.plugins().autoplay.stop();
      setIsPlaying(false);
    };

    const onPointerUp = () => {
      if (api.scrollSnapList().length === 1) {
        return;
      }
      api.plugins()?.autoplay?.play();
      setIsPlaying(true);
    };

    const onSelect = () => {
      const newIndex = api.selectedScrollSnap() + 1;
      setCurrent(newIndex);

      api.plugins().autoplay.play();
      api.plugins().autoplay.reset();
    };

    const onSelect2 = () => {
      const newIndex = api.selectedScrollSnap() + 1;
      const length = api.scrollSnapList().length;

      if (newIndex === 1) setOpen(false);
    };

    api.on("pointerDown", onPointerDown);

    api.on("pointerUp", onPointerUp);

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", onSelect);

    api.on("autoplay:select", onSelect2);

    return () => {
      api.off("pointerDown", onPointerDown);
      api.off("pointerUp", onPointerUp);
      api.off("select", onSelect);
      api.off("autoplay:select", onSelect2);
    };
  }, [api, setOpen]);

  return (
    <DialogContent className='sm:max-w-[425px] p-0 [&_.close-dialog]:hidden bg-transparent relative'>
      <div className='z-10 w-full absolute px-4 top-4 left-1/2 -translate-x-1/2 flex items-center gap-4'>
        <div className='w-full flex gap-2'>
          {story.slides.map((_, i) => (
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
          ))}
        </div>
        <DialogClose asChild>
          <Button
            type='button'
            variant='secondary'
            className='z-10 p-2 flex items-center justify-center bg-accent rounded-full h-auto'
          >
            <X className='w-4 h-4' />
          </Button>
        </DialogClose>
      </div>
      <Carousel
        setApi={setApi}
        plugins={[Autoplay({ delay })]}
        className='w-full overflow-hidden rounded-xl relative'
      >
        <CarouselContent className='h-full'>
          {story.slides.map((s) => (
            <CarouselItem key={s.id} className='pl-0 relative'>
              <div className='z-20 absolute top-20 left-0 px-12 space-y-1'>
                <div>
                  <DialogTitle className='text-white whitespace-pre-line'>
                    {s.title}
                  </DialogTitle>
                  {s.subtitle && (
                    <p className='text-white/50 text-base'>{s.subtitle}</p>
                  )}
                </div>
                <DialogDescription className='text-white/80 text-white whitespace-pre-line'>
                  {s.text}
                </DialogDescription>
              </div>
              <div className='z-10 absolute inset-0 h-1/2 bg-gradient-to-b from-black/50' />
              <Avatar className='w-full h-full rounded-xl'>
                <AvatarImage
                  src={s.img}
                  alt={s.title}
                  className='w-full h-full aspect-[3/4] object-cover'
                />
                <AvatarFallback className='w-full h-full aspect-[3/4] rounded-xl flex items-center justify-center' />
              </Avatar>
              {s.category && (
                <Button
                  className='absolute bottom-6 left-1/2 -translate-x-1/2 bg-white hover:bg-accent text-primary rounded-full w-4/5'
                  asChild
                >
                  <Link href={`/category/${s.category.route}`}>
                    {s.button || "За покупками"}
                  </Link>
                </Button>
              )}
              {s.link && (
                <Button
                  className='absolute bottom-6 left-1/2 -translate-x-1/2 bg-white hover:bg-accent text-primary rounded-full w-4/5'
                  asChild
                >
                  <a href={s.link}>{s.button || "За покупками"}</a>
                </Button>
              )}
            </CarouselItem>
          ))}
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
  );
}
