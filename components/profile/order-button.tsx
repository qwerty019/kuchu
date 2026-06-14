"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import { useCartStore } from "@/providers/cart-store-provider";
import { useMainStore } from "@/providers/main-store-provider";
import { toast } from "sonner";
import { Order } from "@/lib/db/order/schema";
import { repeatOrder } from "@/lib/db/order/actions";

export function OrderButton({ order }: { order: Order }) {
  const { setItems } = useCartStore((state) => state);
  const { branch, method } = useMainStore((state) => state);

  const isPaid = order.payments.every((p) => p.status === "paid");

  if (!isPaid && order.payments.length > 0) {
    if (order.payments[0].token === null) {
      return (
        <Button
          variant='secondary'
          className='w-full rounded-full text-xs py-3 h-auto bg-[#F2F2F2] hover:bg-[#F2F2F2]'
          disabled
        >
          Оплата недоступна
        </Button>
      );
    }

    const link = `/payment?token=${order.payments[0].token}&orderId=${order.id}`;

    return (
      <Button
        className='w-full rounded-full text-xs py-3 h-auto bg-[#A03968] hover:bg-[#A03968] text-white'
        asChild
      >
        <Link href={link}>Оплатить</Link>
      </Button>
    );
  }

  const handleRepeat = async () => {
    if (!branch) {
      toast.error("Выберите филиал");
      return;
    }

    if (!method) {
      toast.error("Выберите метод доставки");
      return;
    }

    const items = await repeatOrder(order.id, branch, method);

    if ("message" in items) {
      toast.error(items.message);
      return;
    }

    setItems(items);
  };

  return (
    <Button
      variant='secondary'
      className='w-full rounded-full text-xs py-3 h-auto bg-[#F2F2F2]'
      onClick={() => handleRepeat()}
    >
      Повторить заказ
    </Button>
  );
}
