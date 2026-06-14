import { getMethodAndBranch } from "@/lib/data";
import { fetchUserAddresses } from "@/lib/db/address/data";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import RightSideClient from "./right-side-client";
import { Button } from "../ui/button";
import { fetchZones } from "@/lib/db/deliveryzone/data";
import { User } from "@/lib/auth";
import { Orders } from "../orders/orders";
import { fetchCurrentOrders } from "@/lib/db/order/data";
import OrderDialog from "../orders/order-dialog";

export default async function RightSide({ user }: { user: User | null }) {
  return (
    <Suspense fallback={<Loading />}>
      <Methods user={user} />
    </Suspense>
  );
}

async function Methods({ user }: { user: User | null }) {
  const [data, addresses, zones, orders] = await Promise.all([
    getMethodAndBranch(),
    user?.id ? fetchUserAddresses(user.id) : [],
    fetchZones(),
    user?.id ? fetchCurrentOrders(user.id) : [],
  ]);

  const { method, branch, branches } = data;

  return (
    <div className='fixed hidden lg:flex flex-col gap-4 h-[calc(100vh-64px-16px-16px)] right-0 w-80 shrink-0 mr-4'>
      <Orders initial={orders} user={user} withListener />
      <OrderDialog />
      <RightSideClient
        user={user}
        method={method}
        branch={branch}
        branches={branches}
        addresses={addresses}
        zones={zones}
      />
    </div>
  );
}

function Loading() {
  return (
    <section className='p-4 hidden lg:block fixed right-0 w-80 shrink-0 bg-background h-[calc(100vh-64px-16px-16px)] rounded-2xl mr-4'>
      <Skeleton className='h-11' />
      <div className='mt-4 flex flex-col gap-4 h-[calc(100%-60px)]'>
        <div className='space-y-4 h-full flex flex-col overflow-y-auto scrollbar-hide'>
          <div className='h-full flex flex-col gap-6 items-center justify-center'></div>
          <Button
            className='w-full rounded-full bg-[#A03968] hover:bg-[#A03968]'
            disabled
          >
            Продолжить
          </Button>
        </div>
      </div>
    </section>
  );
}
