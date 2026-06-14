"use client";

import { Check, ChevronDown, ChevronRight, X } from "lucide-react";
import { Button } from "../ui/button";
import { CurrentOrder } from "@/lib/db/order/schema";
import { useMainStore } from "@/providers/main-store-provider";
import React, { useEffect, useMemo } from "react";
import { OrderIcon1, OrderIcon2, OrderIcon3 } from "../icons";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
//import pusher from "@/lib/pusher-client";
import { User } from "@/lib/auth";
import { Payload } from "@/stores/main-store";

export function Orders({
  initial,
  user,
  withListener,
}: {
  initial?: CurrentOrder[];
  user: User | null;
  withListener?: boolean;
}) {
  const {
    orders,
    setOrders,
    setShowOrders,
    showOrders,
    setOrderIndex,
    orderIndex,
    setShowDialog,
    updateOrder,
  } = useMainStore((state) => state);

  const pathname = usePathname();

  useEffect(() => {
    if (!initial) return;

    setOrders(initial);
    setOrderIndex(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  // useEffect(() => {
  //   if (!user || !withListener) return;

  //   const channel = pusher.subscribe(`user-${user.id}`);

  //   channel.bind("order-updated", (payload: Payload) => {
  //     updateOrder(payload);
  //   });

  //   return () => {
  //     channel.unbind_all();
  //     channel.unsubscribe();
  //     pusher.disconnect();
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [user, withListener]);

  const order = useMemo(() => {
    if (orders.length === 0) return null;
    if (orderIndex === -1) return null;
    if (orderIndex >= orders.length) return null;
    return orders[orderIndex];
  }, [orders, orderIndex]);

  if (pathname.includes("/admin")) return null;

  if (showOrders) return null;

  if (orders.length === 0 || !order) return null;

  return (
    <div
      className='p-4 w-full md:w-80 shrink-0 bg-[#A03968] text-white rounded-2xl h-[168px] space-y-3 cursor-pointer'
      onClick={() => setShowDialog(true)}
    >
      <div className='w-full'>
        <div className='flex justify-between items-center gap-2'>
          <p className='text-lg font-semibold'>
            {order.fbId ? `Заказ №${order.fbId}` : `Заказ №${order.id}`}
          </p>
          <div className='flex items-center gap-1'>
            {orders.length > 1 && (
              <Button
                variant='secondary'
                size='icon'
                className='w-6 h-6 rounded-full bg-secondary/50 hover:bg-secondary/70'
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();

                  if (orderIndex < orders.length - 1) {
                    setOrderIndex(orderIndex + 1);
                  } else {
                    setOrderIndex(0);
                  }
                }}
              >
                <ChevronRight className='w-3 h-3 text-white' />
              </Button>
            )}
            <Button
              variant='secondary'
              size='icon'
              className='hidden md:flex w-6 h-6 rounded-full bg-secondary/50 hover:bg-secondary/70'
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                setShowOrders(true);
              }}
            >
              <ChevronDown className='w-3 h-3 text-white' />
            </Button>
          </div>
        </div>
        <div className='flex items-center gap-1'>
          {["Доставили до вас", "Готово к выдаче"].includes(order.status) && (
            <Check className='w-5 h-5 text-white' />
          )}
          <p className='text-sm'>
            {order.status === "Доставили до вас"
              ? "Заказ доставлен"
              : order.status === "Готово к выдаче"
                ? "Готов к выдаче и ждет вас"
                : order.address && order.deliveryTime
                  ? `Привезем ${order.deliveryTime}`
                  : "Собираем за 10 минут"}
          </p>
        </div>
      </div>
      {order.status === "Отменен" ? (
        <Canceled />
      ) : order.address ? (
        <Delivery order={order} />
      ) : (
        <Pickup order={order} />
      )}
    </div>
  );
}

export function Canceled() {
  return (
    <div className='flex w-full gap-4 justify-center'>
      <div className='flex items-center justify-center flex-col gap-2'>
        <div className='w-12 h-12 bg-white rounded-full flex items-center justify-center'>
          <X className='w-6 h-6 text-[#A03968]' />
        </div>
        <p className='text-xs text-center leading-none whitespace-pre-line text-white'>
          Заказ <br />
          отменен
        </p>
      </div>
    </div>
  );
}

export function Delivery({ order }: { order: CurrentOrder }) {
  const isPending =
    order.payments.length > 0 &&
    !order.payments.every((payment) => payment.status === "paid");

  return (
    <div className='flex w-full justify-between'>
      <IconItem
        title={isPending ? `Ожидаем \nоплаты` : `Собираем \nзаказ`}
        isActive={[
          "Собираем заказ",
          "Передали курьеру",
          "Доставили до вас",
        ].includes(order.status)}
        icon={<OrderIcon1 />}
      />
      <ChevronRight
        className={cn(
          "w-4 h-4 my-4 text-white/50",
          ["Передали курьеру", "Доставили до вас"].includes(order.status) &&
            "text-white"
        )}
      />
      <IconItem
        title={`Передали \nкурьеру`}
        isActive={["Передали курьеру", "Доставили до вас"].includes(
          order.status
        )}
        icon={<OrderIcon2 />}
      />
      <ChevronRight
        className={cn(
          "w-4 h-4 my-4 text-white/50",
          ["Доставили до вас"].includes(order.status) && "text-white"
        )}
      />
      <IconItem
        title={`Доставили \nдо вас`}
        isActive={["Доставили до вас"].includes(order.status)}
        icon={<OrderIcon3 />}
      />
    </div>
  );
}

export function Pickup({ order }: { order: CurrentOrder }) {
  const isPending =
    order.payments.length > 0 &&
    !order.payments.every((payment) => payment.status === "paid");

  return (
    <div className='flex w-full gap-4 justify-center'>
      <IconItem
        title={isPending ? `Ожидаем \nоплаты` : `Собираем \nзаказ`}
        isActive={["Собираем заказ", "Готово к выдаче"].includes(order.status)}
        icon={<OrderIcon1 />}
      />
      <ChevronRight
        className={cn(
          "w-4 h-4 my-4 text-white/50",
          order.status === "Готово к выдаче" && "text-white"
        )}
      />
      <IconItem
        title={`Готово \nк выдаче`}
        isActive={order.status === "Готово к выдаче"}
        icon={<OrderIcon3 />}
      />
    </div>
  );
}

function IconItem({
  title,
  isActive,
  icon,
}: {
  title: string;
  isActive: boolean;
  icon: React.ReactNode;
}) {
  return (
    <div className='flex items-center justify-center flex-col gap-2'>
      {React.cloneElement(icon as React.ReactElement, {
        className: cn("w-12 h-12 text-white/50", isActive && "text-white"),
      })}
      <p
        className={cn(
          "text-xs text-center leading-none text-white/50 whitespace-pre-line",
          isActive && "text-white"
        )}
      >
        {title}
      </p>
    </div>
  );
}
