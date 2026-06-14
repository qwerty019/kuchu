import OverlayDesktopBackdrop from "@/components/layout/overlay-desktop-backdrop";
import Orders from "@/components/profile/orders";
import ProfileSubpageView from "@/components/profile/profile-subpage-view";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();

  if (!user) redirect("/login?callbackUrl=/profile/orders");

  return (
    <ProfileSubpageView
      title='Заказы'
      path='/profile/orders'
      isBackButton
      desktopBackdrop={<OverlayDesktopBackdrop />}
    >
      <Orders />
    </ProfileSubpageView>
  );
}
