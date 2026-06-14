"use client";

import CartModal from "@/components/cart/cartmodal";
import { User } from "@/lib/auth";

/** Клиентская обёртка: только CartModal, без серверных импортов. */
export default function CartPageView({ user }: { user: User }) {
  return <CartModal user={user} />;
}
