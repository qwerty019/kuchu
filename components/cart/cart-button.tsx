import { Suspense } from "react";
import CartButtonMobile from "./cart-button-mobile";
import { User } from "@/lib/auth";

export default function CartButton({ user }: { user: User | null }) {
  return (
    <Suspense fallback={<Loading />}>
      <CartButtonSuspense user={user} />
    </Suspense>
  );
}

async function CartButtonSuspense({ user }: { user: User | null }) {
  return <CartButtonMobile user={user} />;
}

function Loading() {
  return null;
}
