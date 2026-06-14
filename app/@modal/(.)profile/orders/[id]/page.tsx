import OverlayDesktopBackdrop from "@/components/layout/overlay-desktop-backdrop";
import MobileInterceptBypass from "@/components/layout/mobile-intercept-bypass";
import { MainModal } from "@/components/modal/main-modal";
import Order from "@/components/profile/order";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage({
  params: { id },
}: {
  params: { id: string };
}) {
  const { user } = await validateRequest();

  if (!user) redirect(`/login?callbackUrl=/profile/orders/${id}`);

  return (
    <MobileInterceptBypass>
      <OverlayDesktopBackdrop />
      <MainModal
        title='Заказ'
        path={`/profile/orders/${id}`}
        isBackButton
      >
        <Order id={id} />
      </MainModal>
    </MobileInterceptBypass>
  );
}
