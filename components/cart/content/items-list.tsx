"use client";

import { useCartStore } from "@/providers/cart-store-provider";
import { Button } from "@/components/ui/button";
import { ImageOff, Minus, Plus, X } from "lucide-react";
import { CartItemState } from "@/stores/cart-store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMainStore } from "@/providers/main-store-provider";
import ModalAlert from "../../modal/modal-alert";
import Link from "next/link";
import { Skeleton } from "../../ui/skeleton";
import { cn } from "@/lib/utils";

export default function ItemsList({ className }: { className?: string }) {
  const { method, addresses, zones } = useMainStore((state) => state);
  const { items, loading } = useCartStore((state) => state);

  const address = addresses?.find((a) => a.selected);
  const zone = zones?.find((z) => z.id === address?.zoneId);
  const delivery = zone?.price || 0;
  const freeDelivery = zone?.freeDelivery || 0;

  const sum = items
    .filter((x) => !x.disabled)
    .reduce((t, ci) => {
      const item = ci.qnts?.reduce((ip, qi) => ip + qi.price * qi.added, 0);
      return t + item;
    }, 0);
  const rightSum = parseFloat(sum.toFixed(2));

  const isFreeDelivery = rightSum >= freeDelivery;
  const untilFreeDelivery = parseFloat((freeDelivery - rightSum).toFixed(2));

  if (loading) {
    return <Loading className={className} items={items} />;
  }

  if (items.length === 0) {
    return <Empty className={className} />;
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-4 h-full overflow-y-auto scrollbar-hide",
        className,
      )}
    >
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
      {method === "delivery" && (
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
      )}
    </div>
  );
}

const CartItem = ({ item }: { item: CartItemState }) => {
  const { addFormCart, removeFromCart } = useCartStore((state) => state);

  const qnt = item.qnts?.reduce((acc, curr) => acc + curr.qnt, 0);
  const sum = item.qnts?.reduce(
    (acc, curr) => acc + curr.price * curr.added,
    0,
  );
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
              className='aspect-square object-contain p-[15%] rounded-lg'
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
            <div className='group-hover:flex hidden bg-[#A03968] text-white rounded-full px-2 h-7 items-center justify-center'>
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

function Loading({
  className,
  items,
}: {
  className?: string;
  items: CartItemState[];
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 h-full overflow-y-auto scrollbar-hide",
        className,
      )}
    >
      {items.map((item) => (
        <Skeleton key={item.id} className='h-[66px]' />
      ))}
    </div>
  );
}

function Empty({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 h-full overflow-y-auto scrollbar-hide",
        className,
      )}
    >
      <div className='h-full flex flex-col gap-6 items-center justify-center'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src='/images/cart-empty.png' alt='Empty cart' className='w-48' />
        <p className='text-muted-foreground text-sm font-medium text-center leading-none'>
          Соберите корзину со всем необходимым, а мы бережно <br />
          соберем заказ, оформим <br />
          доставку или самовывоз
        </p>
      </div>
    </div>
  );
}
