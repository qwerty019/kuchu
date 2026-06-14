export const dynamic = "force-dynamic";

import Orders from "@/components/admin/orders/orders";
import { fetchOrders, fetchOrdersCount } from "@/lib/db/order/data";
import { isAdmin } from "@/lib/utils-server";

export default async function Page() {
  await isAdmin("/admin/orders");

  const [orders, count] = await Promise.all([
    fetchOrders({ page: 1, limit: 10 }),
    fetchOrdersCount(),
  ]);

  return (
    <main className='admin-page space-y-6'>
      <section className='flex items-center justify-between gap-2'>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
          Заказы
        </h1>
      </section>
      <Orders orders={orders} total={count} />
    </main>
  );
}
