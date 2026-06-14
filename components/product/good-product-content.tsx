"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, ImageOff } from "lucide-react";
import { useCartStore } from "@/providers/cart-store-provider";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DrawerDescription, DrawerTitle } from "../ui/drawer";
import { useEffect, useState } from "react";
import { Good as GoodType, GoodDetails } from "@/lib/db/good/definitions";
import GoodButtons from "./good-buttons";
import Good from "../category/good";
import { titles1, titles2 } from "./components";
import { useMainStore } from "@/providers/main-store-provider";
import { toast } from "sonner";
import { addUserGood } from "@/lib/db/userGood/actions";
import { Button } from "../ui/button";
import NoUser from "../category/no-user";
import { cn } from "@/lib/utils";

const mobileNavOffset =
  // "calc(4.25rem + 0.5rem + env(safe-area-inset-bottom, 0px))";
  "calc(3.5rem + env(safe-area-inset-bottom, 0px))";

export default function GoodProductContent({
  good,
  similar,
  recs,
  layout = "page",
}: {
  good: GoodDetails;
  similar: GoodType[];
  recs: GoodType[];
  layout?: "page" | "drawer";
}) {
  const isPage = layout === "page";
  const [clicked, setClicked] = useState(false);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("main");

  useEffect(() => {
    if (similar.length === 0) {
      setTab("instructions");
    }
  }, [similar.length]);

  const { items } = useCartStore((state) => state);
  const { setFavorites, favorites } = useMainStore((state) => state);

  const cartItem = items?.find((i) => i.id === good.id);

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
    <section className='flex w-full flex-col gap-4'>
      <div className='relative w-full'>
        <Avatar
          className={cn(
            "h-auto w-full aspect-square",
            isPage
              ? "rounded-2xl border border-[#E5E5E5] bg-[#F2F2F2]"
              : "rounded-none",
          )}
        >
          <AvatarImage
            src={good.img || undefined}
            alt={good.drug}
            className={cn(
              "aspect-square object-contain",
              isPage ? "rounded-2xl p-[12%]" : "p-[15%]",
            )}
          />
          <AvatarFallback
            className={cn(
              "text-muted-foreground",
              isPage ? "rounded-2xl bg-[#F2F2F2]" : "rounded-none",
            )}
          >
            <ImageOff className='h-12 w-12' />
          </AvatarFallback>
        </Avatar>
        {cartItem && (
          <div
            className={cn(
              "absolute left-0 top-0 z-10 flex aspect-square w-full items-center justify-center bg-[#865BBD]/40",
              isPage ? "rounded-2xl" : "rounded-lg",
            )}
          >
            <p className='text-4xl font-semibold text-white'>{cartItem?.qnt}</p>
          </div>
        )}
        <Button
          onClick={() => handleAdd(good.id)}
          size='icon'
          className={cn(
            "absolute z-10 h-8 w-8 bg-transparent p-0 hover:bg-transparent",
            isPage ? "right-2 top-2" : "left-4 top-4",
          )}
          disabled={clicked}
        >
          <Heart
            className={`h-8 w-8 hover:text-[#A03968]/50 ${
              clicked
                ? "text-[#A03968]/50 animate-pulse"
                : isFavorite
                  ? "text-[#A03968]"
                  : "text-accent"
            }`}
          />
        </Button>
      </div>

      <div
        className={cn(
          "flex h-full flex-col gap-4",
          isPage
            // ? "px-0 pb-[calc(5.5rem+4.25rem+0.5rem+env(safe-area-inset-bottom,0px))]"
            ? "px-0 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px))]"
            : "px-4 pb-[265px]",
        )}
      >
        {!isPage && (
          <div>
            <DrawerTitle className='text-lg'>
              {good.title || good.drug}
            </DrawerTitle>
            <DrawerDescription className='text-sm text-muted-foreground'>
              {good.subtitle || good.form}
            </DrawerDescription>
          </div>
        )}
        {isPage && (good.subtitle || good.form) && (
          <p className='text-sm text-muted-foreground'>
            {good.subtitle || good.form}
          </p>
        )}

        {/* <Tabs defaultValue={tab}>
          <TabsList className='grid h-auto w-full grid-cols-2 rounded-full bg-[#F2F2F2] text-xs'>
            <TabsTrigger
              className='p-2 data-[state=active]:bg-transparent data-[state=active]:!text-[#A03968] data-[state=active]:shadow-none'
              value='main'
              onClick={() => setTab("main")}
            >
              Формы выпуска
            </TabsTrigger>
            <TabsTrigger
              className='p-2 data-[state=active]:bg-transparent data-[state=active]:!text-[#A03968] data-[state=active]:shadow-none'
              value='instructions'
              onClick={() => setTab("instructions")}
            >
              Инструкция
            </TabsTrigger>
          </TabsList>
          <TabsContent value='instructions' className='mt-5'>
            <InstructionContent good={good} titles={[...titles1, ...titles2]} />
          </TabsContent>
        </Tabs> */}
        <div className='mt-2'>
          <InstructionContent good={good} titles={[...titles1, ...titles2]} />
        </div>

        {similar.length > 0 && (
          <div className='w-full space-y-2'>
            <p className='text-lg font-semibold'>
              Другие формы выпуска и аналоги
            </p>
            <div className='flex gap-2 overflow-x-auto scrollbar-hide'>
              {similar.map((item) => (
                <Good
                  key={item.id}
                  good={item}
                  className='w-[120px] text-xs'
                  imgClassName='!h-[120px] !w-[120px]'
                  similar
                />
              ))}
            </div>
          </div>
        )}

        {recs.length > 0 && (
          <div className='w-full space-y-2'>
            <p className='text-lg font-semibold'>Рекомендации</p>
            <div className='flex gap-2 overflow-x-auto scrollbar-hide'>
              {recs.map((item) => (
                <Good
                  key={item.id}
                  good={item}
                  className='w-[120px] text-xs'
                  imgClassName='!h-[120px] !w-[120px]'
                  similar
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        className={cn(
          "border-t bg-background p-4",
          isPage
            ? "fixed inset-x-0 z-30 rounded-t-[10px] border-border/60"
            : "fixed inset-x-0 bottom-0 z-50 rounded-t-[10px]",
        )}
        style={isPage ? { bottom: mobileNavOffset } : undefined}
      >
        <GoodButtons good={good} isDrawer={!isPage} />
      </div>

      <NoUser open={open} setOpen={setOpen} />
    </section>
  );
}

function InstructionContent({
  good,
  titles,
}: {
  good: GoodDetails;
  titles: string[];
}) {
  return (
    <div className='space-y-6'>
      {good.fabr && (
        <div className='space-y-1 text-sm font-medium'>
          <h3 className='text-muted-foreground'>Производитель</h3>
          <p>{good.fabr}</p>
        </div>
      )}
      {good.mnn && (
        <div className='space-y-1 text-sm font-medium'>
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
}

function HtmlBlock({ title, content }: { title: string; content: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className='space-y-1 text-sm font-medium'>
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
            className='cursor-pointer text-muted-foreground'
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
}
