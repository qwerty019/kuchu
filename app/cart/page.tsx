import CartDesktopStorefront from "@/components/cart/cart-desktop-storefront";
import CartPageView from "@/components/cart/cart-page-view";
import Loading from "@/components/cart/loading";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Page() {
  const { user } = await validateRequest();

  if (!user) redirect("/login?callbackUrl=/cart");

  return (
    <>
      <CartDesktopStorefront />
      <Suspense fallback={<Loading />}>
        <CartPageView user={user} />
      </Suspense>
    </>
  );
}
