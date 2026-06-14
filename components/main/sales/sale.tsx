"use client";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Sale as SaleType } from "@/lib/db/sale/definitions";
import SaleDialog from "./sale-dialog";
import SaleDrawer from "./sale-drawer";
import { useState } from "react";

export default function Sale({ sale }: { sale: SaleType }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return <SaleDialog sale={sale} open={open} setOpen={setOpen} />;
  }

  return <SaleDrawer sale={sale} open={open} setOpen={setOpen} />;
}
