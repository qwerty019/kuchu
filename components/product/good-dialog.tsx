"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { Heart, ImageOff, X } from "lucide-react";
import { useCartStore } from "@/providers/cart-store-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useRouter } from "next/navigation";
import { DialogDescription, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { Good as GoodType, GoodDetails } from "@/lib/db/good/definitions";
import GoodButtons from "./good-buttons";
import Good from "../category/good";
import { titles1, titles2 } from "./components";
import { useMainStore } from "@/providers/main-store-provider";
import { addUserGood } from "@/lib/db/userGood/actions";
import { toast } from "sonner";
import NoUser from "../category/no-user";
import { Separator } from "../ui/separator";
import HorizontalScroll from "../new-search/horizontal-scroll";

export default function GoodDialog({
  good,
  similar,
  recs,
}: {
  good: GoodDetails;
  similar: GoodType[];
  recs: GoodType[];
}) {
  const [clicked, setClicked] = useState(false);
  const [open, setOpen] = useState(false);

  const { favorites, setFavorites } = useMainStore((state) => state);
  const { items } = useCartStore((state) => state);
  const router = useRouter();

  const cartItem = items?.find((i) => i.id === good.id);

  function closeDialog() {
    router.back();
  }

  const handleAdd = async (goodId: number) => {
    if (clicked) return;

    setClicked(true);

    const action = await addUserGood(goodId);

    setClicked(false);

    if (!action) {
      const newFavorites = favorites.filter((g) => g.id !== goodId);
      setFavorites(newFavorites);
      toast.success("Товар удален из избранного.");
      return;
    }

    if ("message" in action) {
      if (action.message === "Пользователь не найден.") {
        setOpen(true);
      } else {
        toast.error(action.message);
      }
      return;
    }

    const newFavorites = [...favorites.filter((g) => g.id !== goodId), good];
    setFavorites(newFavorites);
    toast.success("Товар добавлен в избранное.");
  };

  const isFavorite = favorites.find((g) => g.id === good.id);

  return (
    <section className='flex gap-4 w-full h-full'>
      <div className='w-1/2 h-full min-h-[652px] space-y-4 overflow-y-auto'>
        <div className='w-full relative'>
          <Avatar className='w-full h-auto aspect-square rounded-2xl border'>
            <AvatarImage
              src={good.img || undefined}
              alt={good.drug}
              className='aspect-square object-contain p-[15%]'
            />
            <AvatarFallback className='bg-[#F2F2F2] rounded-2xl text-muted-foreground'>
              <ImageOff className='w-12 h-12' />
            </AvatarFallback>
          </Avatar>
          {cartItem && (
            <div className='z-10 w-full aspect-square absolute top-0 left-0 bg-[#865BBD]/40 rounded-lg flex items-center justify-center'>
              <p className='text-white font-semibold text-4xl'>
                {cartItem?.qnt}
              </p>
            </div>
          )}
          <Button
            onClick={() => handleAdd(good.id)}
            size='icon'
            className='absolute top-2 right-2 p-0 h-6 w-6 bg-transparent hover:bg-transparent'
            disabled={clicked}
          >
            <Heart
              className={`h-6 w-6 z-10 hover:text-[#A03968]/50 ${
                clicked
                  ? "text-[#A03968]/50 animate-pulse"
                  : isFavorite
                    ? "text-[#A03968]"
                    : "text-gray-400"
              }`}
            />
          </Button>
        </div>
        {similar.length > 0 && (
          <div className='w-full space-y-2'>
            <p className='text-lg font-semibold'>
              Другие формы выпуска и аналоги
            </p>
            <HorizontalScroll>
              {similar?.map((good) => (
                <Good
                  key={good.id}
                  good={good}
                  className='text-xs w-[120px]'
                  imgClassName='!w-[120px] h-[120px]'
                  similar
                />
              ))}
            </HorizontalScroll>
          </div>
        )}
        {recs.length > 0 && (
          <div className='w-full space-y-2'>
            <p className='text-lg font-semibold'>Рекомендации</p>
            <HorizontalScroll>
              {recs?.map((good) => (
                <Good
                  key={good.id}
                  good={good}
                  className='text-xs w-[120px]'
                  imgClassName='!w-[120px] h-[120px]'
                  similar
                />
              ))}
            </HorizontalScroll>
          </div>
        )}
      </div>
      <div className='w-1/2 flex flex-col h-full min-h-[652px] relative'>
        <div className='font-semibold flex justify-between gap-2'>
          <div>
            <DialogTitle className='text-lg'>
              {good.title || good.drug}
            </DialogTitle>
            <DialogDescription className='text-sm text-muted-foreground'>
              {good.subtitle || good.form}
            </DialogDescription>
          </div>
          <Button
            type='button'
            variant='secondary'
            className='p-0 w-8 h-8 flex items-center justify-center bg-[#F2F2F2] rounded-full shrink-0'
            onClick={closeDialog}
          >
            <X className='w-4 h-4' />
          </Button>
        </div>
        <Separator className='my-4' />
        <div className='flex-1 flex flex-col min-h-0'>
          <div className='overflow-y-auto'>
            <Content good={good} titles={[...titles1, ...titles2]} />
          </div>
        </div>
        <div className='mt-auto sticky bottom-0 w-full'>
          <GoodButtons good={good} />
        </div>
      </div>
      <NoUser open={open} setOpen={setOpen} />
    </section>
  );
}

const Content = ({ good, titles }: { good: GoodDetails; titles: string[] }) => {
  return (
    <div className='space-y-6'>
      {good.fabr && (
        <div className='text-sm font-medium space-y-1'>
          <h3 className='text-muted-foreground'>Производитель</h3>
          <p>{good.fabr}</p>
        </div>
      )}
      {good.mnn && (
        <div className='text-sm font-medium space-y-1'>
          <h3 className='text-muted-foreground'>МНН</h3>
          <p>{good.mnn}</p>
        </div>
      )}
      {good.contents
        .filter((c) => titles.includes(c.title))
        .sort((a, b) => {
          const aIndex = titles.indexOf(a.title);
          const bIndex = titles.indexOf(b.title);

          if (aIndex === -1 && bIndex === -1) return 0;
          if (aIndex === -1) return 1;
          if (bIndex === -1) return -1;

          return aIndex - bIndex;
        })
        .map((content) => (
          <HtmlBlock
            key={content.id}
            title={content.title}
            content={content.content}
          />
        ))}
    </div>
  );
};

const HtmlBlock = ({ title, content }: { title: string; content: string }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className='text-sm font-medium space-y-1'>
      <h3 className='text-muted-foreground'>{title}</h3>
      {content.length > 200 ? (
        <div className='space-y-1'>
          <div
            dangerouslySetInnerHTML={{
              __html: !open ? content.slice(0, 200) + "..." : content,
            }}
          />
          <span
            onClick={() => setOpen(!open)}
            className='text-muted-foreground cursor-pointer'
          >
            {!open ? "Показать еще" : "Свернуть"}
          </span>
        </div>
      ) : (
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className='space-y-1'
        />
      )}
    </div>
  );
};
