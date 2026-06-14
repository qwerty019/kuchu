import OverlayDesktopBackdrop from "@/components/layout/overlay-desktop-backdrop";
import MobileInterceptBypass from "@/components/layout/mobile-intercept-bypass";
import CartModal from "@/components/cart/cartmodal";
import Loading from "@/components/cart/loading";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function CartInterceptPage() {
  return (
    <Suspense fallback={<Loading />}>
      <CartIntercept />
    </Suspense>
  );
}

async function CartIntercept() {
  const { user } = await validateRequest();

  if (!user) redirect("/login?callbackUrl=/cart");

  return (
    <MobileInterceptBypass>
      <OverlayDesktopBackdrop />
      <CartModal user={user} />
    </MobileInterceptBypass>
  );
}
