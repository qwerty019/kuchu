"use client";

import { useCartStore } from "@/providers/cart-store-provider";
import { Button } from "./ui/button";
import { ImageOff, Minus, Plus, X } from "lucide-react";
import { CartItemState } from "@/stores/cart-store";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useMainStore } from "@/providers/main-store-provider";
import ModalAlert from "./modal/modal-alert";
import ItemsDialog from "./cart/items-dialog";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "./ui/skeleton";
import { isWithinDateRange } from "@/lib/utils";

export default function Cart() {
  const prevValuesRef = useRef<{
    branch: string | null;
    method: string | null;
  }>({ branch: null, method: null });

  const [show, setShow] = useState(false);
  const { method, branch, addresses, zones } = useMainStore((state) => state);
  const {
    items,
    setItems,
    hydrated,
    loading,
    setLoading,
    lastShown,
    setLastShown,
  } = useCartStore((state) => state);

  useEffect(() => {
    if (!branch || !method) return;
    if (!hydrated) return;

    // Check if branch or method actually changed
    if (
      prevValuesRef.current.branch === branch &&
      prevValuesRef.current.method === method
    ) {
      return;
    }

    // Update ref with current values
    prevValuesRef.current = { branch, method };

    async function checkAvailability() {
      setLoading(true);

      try {
        const res = await fetch("/api/cart/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items, branch, method }),
        });

        if (!res.ok) {
          throw new Error("Ошибка при проверке доступности товаров.");
        }

        const data: CartItemState[] = await res.json();

        setItems(data);

        const hasComments = data.some((item) => item.comment);
        const isRecentlyShown = lastShown && Date.now() - lastShown < 5000;

        if (hasComments && !isRecentlyShown) {
          setShow(true);
          setLastShown(Date.now());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    checkAvailability();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, branch, method]);

  const address = addresses?.find((a) => a.selected);
  const delivery = zones?.find((z) => z.id === address?.zoneId)?.price || 0;
  const freeDelivery =
    zones?.find((z) => z.id === address?.zoneId)?.freeDelivery || 0;
  const threshold =
    zones?.find((z) => z.id === address?.zoneId)?.threshold || 0;

  const sum =
    items
      .filter((x) => !x.disabled)
      .reduce((t, ci) => {
        const item = ci.qnts?.reduce((ip, qi) => ip + qi.price * qi.added, 0);
        return t + item;
      }, 0) || 0;
  const rightSum = parseFloat(sum?.toFixed(2));

  const isFreeDelivery = rightSum >= freeDelivery;
  const untilThreshold = parseFloat((threshold - rightSum).toFixed(2));
  const untilFreeDelivery = parseFloat((freeDelivery - rightSum).toFixed(2));

  // Example usage: 6 Feb 2026 00:00:00 to 7 Feb 2026 23:59:59 in +09:00 timezone
  const isDisabledFeb = isWithinDateRange({
    start: new Date(Date.UTC(2026, 1, 6, 0, 0, 0)), // Months are 0-indexed, so 1 is February
    end: new Date(Date.UTC(2026, 1, 7, 23, 59, 59)),
    timezoneOffset: 9,
  });

  const btnDisabled =
    isDisabledFeb ||
    items.some((x) => x.disabled) ||
    (method === "delivery" && untilThreshold > 0);

  if (loading && items.length > 0) {
    return <Loading items={items} />;
  }

  if (items.length === 0) {
    return <Empty items={items} />;
  }

  return (
    <>
      <div className='mt-4 flex flex-col gap-4 h-[calc(100%-60px)]'>
        <div className='space-y-4 h-full flex flex-col overflow-y-auto scrollbar-hide'>
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
          {method === "delivery" ? (
            <div className='text-xs border-t pt-3'>
              <div className='flex justify-between gap-2 items-center font-semibold'>
                <p>Доставка</p>
                <p>{isFreeDelivery ? 0 : delivery} ₽</p>
              </div>
              <p className='text-muted-foreground'>
                {isFreeDelivery
                  ? "Бесплатная доставка"
                  : `До бесплатной доставки ${untilFreeDelivery} ₽`}
              </p>
            </div>
          ) : null}
        </div>
        <div className='space-y-1'>
          <div className='text-center'>
            <p className='text-muted-foreground text-xs'>Итого</p>
            <p className='text-2xl font-semibold'>{rightSum} ₽</p>
          </div>
          {btnDisabled ? (
            <Button
              className='w-full rounded-full bg-[#A03968] hover:bg-[#A03968]/80'
              disabled
            >
              {isDisabledFeb
                ? "Временно недоступно"
                : items.some((x) => x.disabled)
                  ? "Удалите недоступные товары"
                  : method === "delivery" && untilThreshold > 0
                    ? `Доберите еще ${untilThreshold}₽`
                    : "Перейти к оплате"}
            </Button>
          ) : (
            <Button
              className='w-full rounded-full bg-[#A03968] hover:bg-[#A03968]/80'
              asChild
            >
              <Link href='/cart'>Продолжить</Link>
            </Button>
          )}
          <Button
            className='w-full rounded-full bg-[#F2F2F2] hover:bg-[#F2F2F2]/80 text-[#404040]'
            asChild
          >
            <Link href='/cart'>Рекомендации</Link>
          </Button>
        </div>
      </div>
      {show && (
        <ItemsDialog
          open={show}
          setOpen={setShow}
          list={items.filter((item) => item.comment)}
        />
      )}
    </>
  );
}

const CartItem = ({ item }: { item: CartItemState }) => {
  const { addFormCart, removeFromCart } = useCartStore((state) => state);

  const qnt = item.qnts?.reduce((acc, curr) => acc + curr.qnt, 0);
  const sum =
    item.qnts?.reduce((acc, curr) => acc + curr.price * curr.added, 0) || 0;
  const rightSum = parseFloat(sum.toFixed(2));
  const inStock = item.qnts?.reduce((acc, curr) => acc + curr.qnt, 0);

  return (
    <div className='flex gap-2'>
      <div className='relative'>
        <Link href={`/product/${item.regId}`}>
          <Avatar className='w-16 h-16 aspect-square rounded-lg border'>
            <AvatarImage
              src={item.img || undefined}
              alt={item.drug}
              className='aspect-square object-contain p-[15%]'
            />
            <AvatarFallback className='rounded-lg text-muted-foreground bg-[#F2F2F2] flex items-center justify-center'>
              <ImageOff className='w-6 h-6' />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
      <div className='space-y-1.5 w-full'>
        <div className='flex w-full gap-4 justify-between'>
          <div className='text-xs font-semibold'>
            <Link href={`/product/${item.regId}`} className='hover:underline'>
              <p
                style={{
                  textDecoration: item.disabled ? "line-through" : "none",
                }}
              >
                {item.title || item.drug}
              </p>
            </Link>
            <p className='text-muted-foreground'>
              <span>{item.subtitle || item.form}</span>
            </p>
            {item.comment && <p className='text-destructive'>{item.comment}</p>}
          </div>
          <AlertDialogRemove2 itemId={item.id} />
        </div>
        <div className='flex items-center gap-1 justify-between'>
          <div className='w-fit flex items-center gap-1 text-[#A03968] rounded-full bg-[#F2F2F2] py-0.5 px-1'>
            {item.qnt === 1 ? (
              <AlertDialogRemove itemId={item.id} />
            ) : (
              <Button
                className='h-full p-1 bg-transparent hover:bg-transparent text-[#A03968]'
                onClick={() => removeFromCart(item.id)}
              >
                <Minus className='w-4 h-4' />
              </Button>
            )}
            <p className='font-semibold text-sm'>{item.qnt}</p>
            <Button
              className='h-full p-1 bg-transparent hover:bg-transparent text-[#A03968]'
              onClick={() => addFormCart(item.id)}
              disabled={item.qnt >= qnt}
            >
              <Plus className='w-4 h-4' />
            </Button>
          </div>
          <div className='group'>
            <p className='group-hover:hidden text-sm font-semibold'>
              {rightSum} ₽
            </p>
            <div className='group-hover:flex hidden bg-[#A03968] text-white rounded-full px-2.5 h-7 items-center justify-center'>
              <p className='text-xs font-semibold'>В наличии: {inStock} шт.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function AlertDialogRemove({ itemId }: { itemId: number }) {
  const { removeCartItem } = useCartStore((state) => state);

  return (
    <ModalAlert
      title='Вы уверены, что хотите удалить товар из корзины?'
      onClick={() => removeCartItem(itemId)}
    >
      <Button className='h-full p-1 bg-transparent hover:bg-transparent text-[#A03968]'>
        <Minus className='w-4 h-4' />
      </Button>
    </ModalAlert>
  );
}

function AlertDialogRemove2({ itemId }: { itemId: number }) {
  const { removeCartItem } = useCartStore((state) => state);

  return (
    <ModalAlert
      title='Вы уверены, что хотите удалить товар из корзины?'
      onClick={() => removeCartItem(itemId)}
    >
      <Button className='h-full p-0 bg-transparent hover:bg-transparent hover:text-primary text-muted-foreground'>
        <X className='w-5 h-5' />
      </Button>
    </ModalAlert>
  );
}

function Loading({ items }: { items: CartItemState[] }) {
  return (
    <div className='mt-4 flex flex-col gap-4 h-[calc(100%-60px)]'>
      <div className='space-y-4 h-full flex flex-col overflow-y-auto scrollbar-hide'>
        {items.map((item) => (
          <Skeleton key={item.id} className='h-[66px] shrink-0' />
        ))}
      </div>
      <div className='space-y-3'>
        <div className='text-center'>
          <p className='text-muted-foreground text-xs'>Итого</p>
          <Skeleton className='w-16 h-8 mx-auto' />
        </div>
        <Button
          className='w-full rounded-full bg-[#A03968] hover:bg-[#A03968]'
          disabled
        >
          Продолжить
        </Button>
      </div>
    </div>
  );
}

function Empty({ items }: { items: CartItemState[] }) {
  return (
    <div className='mt-4 flex flex-col gap-4 h-[calc(100%-60px)]'>
      <div className='space-y-4 h-full flex flex-col overflow-y-auto scrollbar-hide'>
        {items.length === 0 && (
          <div className='h-full flex flex-col gap-6 items-center justify-center'>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src='/images/cart-empty.png'
              alt='Empty cart'
              className='w-48'
            />
            <p className='text-muted-foreground text-sm font-medium text-center leading-none'>
              Соберите корзину со всем необходимым, а мы бережно <br />
              соберем заказ, оформим <br />
              доставку или самовывоз
            </p>
          </div>
        )}
      </div>
      <Button
        className='w-full rounded-full bg-[#A03968] hover:bg-[#A03968]/80'
        disabled
      >
        Продолжить
      </Button>
    </div>
  );
}
