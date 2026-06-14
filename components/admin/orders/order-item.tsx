"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CodeIcon, CreditCard, ImageOff, ShoppingCart } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderAdmin } from "@/lib/db/order/schema";
import { updateOrderStatus } from "@/lib/db/order/actions";
import { useState } from "react";
import { deliveryStatuses, getOrderStatus, pickupStatuses } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function OrderItem({
  order,
  setArr,
}: {
  order: OrderAdmin;
  setArr: React.Dispatch<React.SetStateAction<OrderAdmin[]>>;
}) {
  const [showPayments, setShowPayments] = useState(false);
  const [showGoods, setShowGoods] = useState(false);
  const [showBody, setShowBody] = useState(false);

  return (
    <div className='border p-2 rounded-md space-y-2'>
      <div className='flex items-center gap-3 w-full justify-between'>
        <div className='space-y-0'>
          <p className='font-semibold text-sm'>
            Заказ №{order.id}
            {order.fbId ? ` · В опоре №${order.fbId}` : ""}
            <span className='font-normal'> {order.user.phone}</span>
          </p>
          <p className='text-xs'>
            Сумма: {order.allSum} ₽ · Статус: {getOrderStatus(order)}
            {order.isDeleted ? (
              <span className='text-destructive'> · Заказ удалён</span>
            ) : null}
          </p>
          <p className='text-xs text-muted-foreground' suppressHydrationWarning>
            Создан:{" "}
            {new Date(order.createdAt).toLocaleString("ru-RU", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}{" "}
            · Изменен:{" "}
            {new Date(order.updatedAt).toLocaleString("ru-RU", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
          {order.error && (
            <p className='text-xs text-destructive'>
              Ошибка при создании заказа при оплате картой на сайте:{" "}
              {order.error}
            </p>
          )}
          <p className='text-xs text-muted-foreground'>
            Филиал: {order.branch?.title || "Не указан"}
            {order.address ? ` · Адрес: ${getFullAddress(order.address)}` : ""}
          </p>
        </div>
        <div className='flex flex-col items-end gap-1'>
          <div className='flex items-center gap-1'>
            {order.body && (
              <Button
                variant='outline'
                size='sm'
                onClick={() => setShowBody(!showBody)}
                className='text-xs rounded-full h-8 gap-2'
              >
                <CodeIcon className='w-4 h-4 text-muted-foreground' />
              </Button>
            )}
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowPayments(!showPayments)}
              className='text-xs rounded-full h-8 gap-2'
            >
              <CreditCard className='w-4 h-4 text-muted-foreground' />
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowGoods(!showGoods)}
              className='text-xs rounded-full h-8 gap-2'
            >
              <ShoppingCart className='w-4 h-4 text-muted-foreground' />
            </Button>
          </div>
          {order.version === 2 && <OrderStatus order={order} setArr={setArr} />}
        </div>
      </div>
      {showPayments && <OrderPayments payments={order.payments} />}
      {showGoods && <OrderGoods orderGoods={order.orderGoods} />}
      {showBody && <OrderBody body={order.body} />}
    </div>
  );
}

function OrderPayments({ payments }: { payments: OrderAdmin["payments"] }) {
  return (
    <section className='w-full space-y-1 border rounded-md'>
      {payments.map((payment) => (
        <div key={payment.id} className='p-2'>
          <p className='text-xs'>
            {payment.amount} ₽ · {getPaymentStatus(payment.status)}
          </p>
          <p className='text-xs text-muted-foreground'>
            Обновлено:{" "}
            {new Date(payment.updatedAt).toLocaleString("ru-RU", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
            {" · "}
            Создано:{" "}
            {new Date(payment.createdAt).toLocaleString("ru-RU", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
            })}
          </p>
        </div>
      ))}
      {payments.length === 0 && (
        <div className='p-2 text-xs text-center text-muted-foreground'>
          Нет оплат
        </div>
      )}
    </section>
  );
}

function OrderStatus({
  order,
  setArr,
}: {
  order: OrderAdmin;
  setArr: React.Dispatch<React.SetStateAction<OrderAdmin[]>>;
}) {
  const [clicked, setClicked] = useState(false);

  return (
    <Select
      onValueChange={async (value) => {
        if (clicked) return;

        const confirm = window.confirm("Изменить статус заказа?");
        if (!confirm) return;

        setClicked(true);

        const updated = await updateOrderStatus(order.id, value);

        if ("message" in updated) {
          toast.error(updated.message);
        } else {
          setArr((prev) => prev.map((o) => (o.id === order.id ? updated : o)));
        }

        setClicked(false);
      }}
      value={order.status}
      disabled={clicked}
    >
      <SelectTrigger className='w-fit h-8 text-xs rounded-full gap-1'>
        <SelectValue placeholder='Статус...' />
      </SelectTrigger>
      <SelectContent>
        {order.address
          ? deliveryStatuses.map((status) => (
              <SelectItem
                key={status.value}
                value={status.value}
                className='text-xs'
              >
                {status.label}
              </SelectItem>
            ))
          : pickupStatuses.map((status) => (
              <SelectItem
                key={status.value}
                value={status.value}
                className='text-xs'
              >
                {status.label}
              </SelectItem>
            ))}
      </SelectContent>
    </Select>
  );
}

function OrderBody({ body }: { body: OrderAdmin["body"] }) {
  return (
    <section className='w-full space-y-1 border rounded-md'>
      {body ? (
        <div className='p-3'>
          <h3 className='text-sm font-medium mb-2'>
            Данные заказа для Опоры (JSON)
          </h3>
          <pre className='text-xs bg-slate-50 p-2 rounded-md overflow-auto max-h-96'>
            {JSON.stringify(JSON.parse(body), null, 2)}
          </pre>
        </div>
      ) : (
        <div className='p-2 text-xs text-center text-muted-foreground'>
          Нет данных заказа
        </div>
      )}
    </section>
  );
}

function OrderGoods({ orderGoods }: { orderGoods: OrderAdmin["orderGoods"] }) {
  return (
    <section className='w-full space-y-1 border rounded-md'>
      {orderGoods.map((og, i) => (
        <Link
          key={i}
          href={`/product/${og.good.regId}`}
          className='block border-b last:border-b-0'
        >
          <div className='p-2 flex items-center gap-3 w-full'>
            <Avatar className='w-16 h-16 rounded-md'>
              <AvatarImage
                src={og.good.img || undefined}
                alt={og.good.drug}
                className='aspect-square object-cover'
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
  );
}

function getFullAddress(addr: OrderAdmin["address"] | undefined) {
  if (!addr) return "";

  const { address, entrance, floor, apartment, comment } = addr;

  let all = address;

  if (entrance) all += `, П: ${entrance}`;
  if (floor) all += `, Э: ${floor}`;
  if (apartment) all += `, К: ${apartment}`;
  if (comment) all += `, Км: ${comment}`;

  return all;
}

function getPaymentStatus(status: string | null) {
  if (!status) return "Не указано";

  if (status === "waiting") return "Ожидает оплаты";
  if (status === "canceled") return "Отменен";
  if (status === "refunded") return "Возврат";
  if (status === "paid") return "Оплачен";

  return status;
}
