import OverlayDesktopBackdrop from "@/components/layout/overlay-desktop-backdrop";
import Order from "@/components/profile/order";
import ProfileSubpageView from "@/components/profile/profile-subpage-view";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  const { user } = await validateRequest();

  if (!user) redirect(`/login?callbackUrl=/profile/orders/${id}`);

  return (
    <ProfileSubpageView
      title='Заказ'
      path={`/profile/orders/${id}`}
      isBackButton
      modalClassName='h-full sm:h-[700px]'
      desktopBackdrop={<OverlayDesktopBackdrop />}
    >
      <Order id={id} />
    </ProfileSubpageView>
  );
}
