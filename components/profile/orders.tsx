import { fetchUserOrders } from "@/lib/db/order/data";
import Link from "next/link";
import { ImageOff } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { getOrderStatus } from "@/lib/utils";
import OrderDate from "./order-date";

export default async function Orders() {
  const orders = await fetchUserOrders();

  if (orders.length === 0) {
    return (
      <section className='w-full flex items-center justify-between flex-col gap-4 h-full'>
        <section className='w-full border-t'>
          <div className='py-2 border-b w-full min-h-[81px] flex flex-col items-center justify-center'>
            <p className='font-semibold text-sm'>Пусто</p>
            <p className='text-muted-foreground text-xs'>Пока заказов нет</p>
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className='w-full flex items-center justify-between flex-col gap-4 h-full'>
      <section className='w-full border-t'>
        {orders.map((order) => {
          const good = order.orderGoods[0].good;

          return (
            <Link
              href={`/profile/orders/${order.id}`}
              key={order.id}
              className='border-b py-2 flex items-center gap-3 w-full'
            >
              <Avatar className='w-16 h-16 aspect-square rounded-lg border'>
                <AvatarImage
                  src={good.img || undefined}
                  alt={`Заказ №${order.id}`}
                  className='aspect-square object-contain p-[15%]'
                />
                <AvatarFallback className='rounded-lg text-muted-foreground flex items-center justify-center bg-[#F2F2F2]'>
                  <ImageOff className='w-6 h-6' />
                </AvatarFallback>
              </Avatar>
              <div className='space-y-0'>
                <p className='font-semibold text-sm'>{getOrderStatus(order)}</p>
                <div className='flex gap-1'>
                  <p className='text-xs text-muted-foreground'>
                    {order.allSum} ₽
                  </p>
                  <p className='text-xs text-muted-foreground'>·</p>
                  <p className='text-xs text-muted-foreground'>
                    <OrderDate createdAt={order.createdAt} />
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </section>
    </section>
  );
}
