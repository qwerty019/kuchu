"use client";

import { Check, ChevronRight, ChevronUp, ImageOff } from "lucide-react";
import { Button } from "../ui/button";
import { useMainStore } from "@/providers/main-store-provider";
import Link from "next/link";
import { CurrentOrder } from "@/lib/db/order/schema";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { Canceled, Delivery, Pickup } from "./orders";
import { toast } from "sonner";
import { cancelOrder } from "@/lib/db/order/actions";
import ModalAlert from "../modal/modal-alert";

export default function OrderGoods({
  className,
  hideButtons,
  onRightSide,
}: {
  className?: string;
  hideButtons?: boolean;
  onRightSide?: boolean;
}) {
  const { orders, setOrders, setShowOrders, orderIndex, setOrderIndex } =
    useMainStore((state) => state);

  const order = useMemo(() => {
    if (orders.length === 0) return null;
    if (orderIndex === -1) return null;
    if (orderIndex >= orders.length) return null;
    return orders[orderIndex];
  }, [orders, orderIndex]);

  if (orders.length === 0 || !order) return null;

  return (
    <section
      className={cn(
        "p-4 w-80 shrink-0 rounded-2xl bg-[#A03968] space-y-4",
        onRightSide && "h-full",
        className,
      )}
    >
      <div className='flex justify-between items-center gap-2 text-white'>
        <p className='text-lg font-semibold'>
          {order.fbId ? `Заказ №${order.fbId}` : `Заказ №${order.id}`}
        </p>
        {!hideButtons && (
          <div className='flex items-center gap-1'>
            {orders.length > 1 && (
              <Button
                variant='secondary'
                size='icon'
                className='w-6 h-6 rounded-full bg-secondary/50 hover:bg-secondary/70'
                onClick={() => {
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
              className='w-6 h-6 rounded-full bg-secondary/50 hover:bg-secondary/70'
              onClick={() => setShowOrders(false)}
            >
              <ChevronUp className='w-3 h-3 text-white' />
            </Button>
          </div>
        )}
      </div>
      <div
        className={cn(
          "space-y-4 bg-background rounded-2xl p-4 flex flex-col flex-grow justify-between",
          onRightSide
            ? "h-[calc(100%-80px-40px-24px-32px)]"
            : "h-[calc(100%-170px)]",
        )}
      >
        <div className='overflow-y-auto scrollbar-hide space-y-4 h-full'>
          {order.orderGoods.map((og, i) => (
            <Item key={i} item={og} />
          ))}
          {order.deliveryFee && (
            <div className='text-xs border-t pt-3'>
              <div className='flex justify-between gap-2 items-center font-semibold'>
                <p>Доставка</p>
                <p>{order.deliveryFee} ₽</p>
              </div>
            </div>
          )}
        </div>
        <div className='flex flex-col items-center justify-center gap-3'>
          <AlertDialogCancel
            order={order}
            setOrders={setOrders}
            orders={orders}
          />
          <div className='text-center mt-auto bg-background'>
            <p className='text-muted-foreground text-xs'>Итого</p>
            <p className='text-2xl font-semibold'>{order.allSum} ₽</p>
          </div>
        </div>
      </div>
      <div className='flex items-center gap-1 w-fit mx-auto'>
        {["Доставили до вас", "Готово к выдаче"].includes(order.status) && (
          <Check className='w-5 h-5 text-white' />
        )}
        <p className='text-sm text-white text-center w-full'>
          {order.status === "Доставили до вас"
            ? "Заказ доставлен"
            : order.status === "Готово к выдаче"
              ? "Готов к выдаче и ждет вас"
              : order.address && order.deliveryTime
                ? `Привезем ${order.deliveryTime}`
                : "Собираем за 10 минут"}
        </p>
      </div>
      {order.status === "Отменен" ? (
        <Canceled />
      ) : order.address ? (
        <Delivery order={order} />
      ) : (
        <Pickup order={order} />
      )}
    </section>
  );
}

function AlertDialogCancel({
  order,
  setOrders,
  orders,
}: {
  order: CurrentOrder;
  setOrders: (orders: CurrentOrder[]) => void;
  orders: CurrentOrder[];
}) {
  const [clicked, setClicked] = useState(false);
  const [message, setMessage] = useState("");

  const handleCancel = async () => {
    if (clicked) return;

    if (order.status !== "Собираем заказ") {
      toast.error("Вы не можете сейчас отменить заказ.");
      return;
    }

    setClicked(true);

    const action = await cancelOrder(order.id);

    if ("message" in action) {
      setMessage(action.message);
    } else {
      setOrders(
        orders.map((o) =>
          o.id === order.id ? { ...o, status: "Отменен" } : o,
        ),
      );
      toast.success("Заказ отменен.");
    }

    setClicked(false);
  };

  if (order.status !== "Собираем заказ") return null;

  if (
    order.payments.length > 0 &&
    order.payments.every((payment) => payment.status === "paid")
  ) {
    return null;
  }

  return (
    <ModalAlert
      title='Вы уверены, что хотите отменить заказ?'
      onClick={() => handleCancel()}
      clicked={clicked}
      message={message}
    >
      <Button
        variant='secondary'
        size='sm'
        className='w-fit text-xs rounded-full h-7 gap-1'
      >
        Отменить
      </Button>
    </ModalAlert>
  );
}

const Item = ({ item }: { item: CurrentOrder["orderGoods"][number] }) => {
  return (
    <div className='flex gap-2'>
      <div className='relative'>
        <Link href={`/product/${item.good.regId}`}>
          <Avatar className='w-16 h-16 aspect-square rounded-lg border'>
            <AvatarImage
              src={item.good.img || undefined}
              alt={item.good.drug}
              className='aspect-square object-contain p-[15%]'
            />
            <AvatarFallback className='rounded-lg text-muted-foreground bg-[#F2F2F2] flex items-center justify-center'>
              <ImageOff className='w-6 h-6' />
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
      <div className='space-y-1.5 w-full'>
        <div className='text-xs font-semibold'>
          <Link
            href={`/product/${item.good.regId}`}
            className='hover:underline'
          >
            <p>{item.good.drug}</p>
          </Link>
          <p className='text-muted-foreground'>
            {item.good.form || "Неизвестно"}
          </p>
        </div>
        <div className='flex items-center gap-1 justify-between'>
          <div className='w-fit flex justify-center items-center gap-1 text-primary rounded-full bg-[#F2F2F2] py-1 px-3 min-w-[48px]'>
            <p className='font-semibold text-xs'>{item.qnt}</p>
          </div>
          <p className='text-sm font-semibold'>{item.price} ₽</p>
        </div>
      </div>
    </div>
  );
};
