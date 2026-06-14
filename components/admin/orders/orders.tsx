"use client";

import { Button } from "@/components/ui/button";
import { fetchOrders } from "@/lib/db/order/data";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
//import pusher from "@/lib/pusher-client";
import { useRouter } from "next/navigation";
import { OrderAdmin } from "@/lib/db/order/schema";
import { OrderItem } from "./order-item";

export default function Orders({
  orders,
  total,
}: {
  orders: OrderAdmin[];
  total: number;
}) {
  const [arr, setArr] = useState<OrderAdmin[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setArr(orders);
  }, [orders]);

  // useEffect(() => {
  //   const channel = pusher.subscribe(`orders`);

  //   channel.bind("order-updated", () => {
  //     router.refresh();
  //   });

  //   return () => {
  //     channel.unbind_all();
  //     channel.unsubscribe();
  //     pusher.disconnect();
  //   };
  // }, [router]);

  async function loadMore() {
    if (loading) return;

    setLoading(true);

    try {
      const newOrders = await fetchOrders({ page: page + 1, limit: 10 });
      setArr((prev) => [...prev, ...newOrders]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      toast.error("Не удалось загрузить заказы");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='flex flex-col space-y-1'>
      {arr.map((order) => (
        <OrderItem key={order.id} order={order} setArr={setArr} />
      ))}
      {arr.length < total && (
        <div className='flex flex-col items-center justify-center gap-2 py-4'>
          <Button
            onClick={loadMore}
            size='sm'
            variant='outline'
            className='text-xs rounded-full h-8'
            disabled={loading}
          >
            {loading ? (
              <Loader2 className='w-4 h-4 animate-spin' />
            ) : (
              "Загрузить ещё"
            )}
          </Button>
          <p className='text-xs text-muted-foreground'>
            Загружено {arr.length} из {total} заказов
          </p>
        </div>
      )}
    </div>
  );
}
