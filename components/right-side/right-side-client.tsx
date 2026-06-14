"use client";

import Cart from "../cart";
import CityList from "./city-list";
import { User } from "@/lib/auth";
import { usePathname } from "next/navigation";
import { useMainStore } from "@/providers/main-store-provider";
import FilterList from "./filter-list";
import FavoritesList from "./favorites-list";
import { Address } from "@/lib/db/address/schema";
import { BranchWithCity } from "@/lib/db/branch/schema";
import { DeliveryZone } from "@/lib/db/deliveryzone/schema";
import OrderGoods from "../orders/order-goods";
import { cn } from "@/lib/utils";

export default function RightSideClient({
  user,
  method,
  branch,
  branches,
  addresses,
  zones,
}: {
  user: User | null;
  method: string | null;
  branch: string | null;
  branches: BranchWithCity[];
  addresses: Address[];
  zones: DeliveryZone[];
}) {
  const { showFilters, showFavorites, showOrders, orders } = useMainStore(
    (state) => state
  );
  const pathname = usePathname();

  if (pathname.includes("/admin")) return null;

  if (showFilters) {
    return (
      <section className='p-4 w-80 shrink-0 bg-background rounded-2xl'>
        <FilterList />
      </section>
    );
  }

  if (showFavorites) return <FavoritesList />;

  if (showOrders) return <OrderGoods onRightSide />;

  return (
    <section
      className={cn(
        "p-4 w-80 shrink-0 bg-background rounded-2xl cart-component space-y-4",
        orders.length > 0 ? "h-[calc(100%-16px-168px)]" : "h-full"
      )}
    >
      <CityList
        user={user}
        method={method}
        branch={branch}
        branches={branches}
        addresses={addresses}
        zones={zones}
      />
      <Cart />
    </section>
  );
}
