import { fetchOrderById } from "@/lib/db/order/data";
import Link from "next/link";
import { Button } from "../ui/button";
import { Check, Clock, ImageOff, XIcon } from "lucide-react";
import { notFound } from "next/navigation";
import { OrderButton } from "./order-button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getOrderStatus } from "@/lib/utils";
import OrderDate from "./order-date";

export default async function Order({ id }: { id: string }) {
  const order = await fetchOrderById(Number(id));

  if (!order) return notFound();

  const status = getOrderStatus(order);

  return (
    <section className='w-full flex items-center justify-between flex-col gap-4 h-full'>
      <section className='space-y-3 flex flex-col items-center w-full'>
        <div className='flex items-center justify-center w-8 h-8 rounded-full bg-gray-900'>
          {["Выдан", "Доставили до вас", "Готово к выдаче"].includes(
            status || "",
          ) ? (
            <Check className='w-6 h-6 text-white' />
          ) : ["Отменен", "Возврат"].includes(status || "") ? (
            <XIcon className='w-6 h-6 text-white' />
          ) : (
            <Clock className='w-6 h-6 text-white' />
          )}
        </div>
        <div className='text-center'>
          <h3 className='text-xl font-semibold'>{status}</h3>
          <p className='text-muted-foreground text-sm'>
            {order.address ? "Доставка" : "Самовывоз"}
          </p>
        </div>
        <div className='flex items-center gap-2 w-full'>
          <Button
            variant='secondary'
            asChild
            className='w-full rounded-full text-xs py-3 h-auto bg-[#F2F2F2] hover:bg-[#F2F2F2]'
          >
            <a
              href={`https://wa.me/79245902200?text=Здравствуйте!%0aЗаказ%20№${order.fbId || order.id}`}
              target='_blank'
            >
              Связаться с нами
            </a>
          </Button>
          <OrderButton order={order} />
        </div>
      </section>
      <section className='w-full border-t'>
        {order.orderGoods.map((og) => (
          <Link
            key={og.id}
            href={`/product/${og.good.regId}`}
            className='block'
          >
            <div className='border-b py-2 flex items-center gap-3 w-full'>
              <Avatar className='w-16 h-16 rounded-md border'>
                <AvatarImage
                  src={og.good.img || undefined}
                  alt={og.good.drug}
                  className='aspect-square object-contain p-[15%]'
                />
                <AvatarFallback className='rounded-lg text-muted-foreground flex items-center justify-center bg-[#F2F2F2]'>
                  <ImageOff className='w-6 h-6' />
                </AvatarFallback>
              </Avatar>
              <div className='space-y-0'>
                <p className='font-semibold text-sm'>
                  {og.good.title || og.good.drug}
                </p>
                <p className='text-xs text-muted-foreground'>
                  {og.price} ₽ · {og.qnt} шт
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>
      <div className='text-center'>
        <p className='text-muted-foreground text-sm'>Итого</p>
        <h3 className='text-xl font-semibold'>{order.allSum} ₽</h3>
        {order.deliveryFee && (
          <p className='text-muted-foreground text-xs'>
            Доставка {order.deliveryFee} ₽
          </p>
        )}
      </div>
      <div className='w-full text-xs'>
        <div className='border-t border-b py-2'>
          <p className='text-muted-foreground'>Номер заказа</p>
          <p className=''>{order.fbId || order.id}</p>
        </div>
        <div className='border-b py-2'>
          <p className='text-muted-foreground'>Время заказа</p>
          <p>
            <OrderDate createdAt={order.createdAt} />
          </p>
        </div>
      </div>
    </section>
  );
}
