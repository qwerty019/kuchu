import OverlayDesktopBackdrop from "@/components/layout/overlay-desktop-backdrop";
import Addresses from "@/components/profile/adresses";
import ProfileSubpageView from "@/components/profile/profile-subpage-view";
import { validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();

  if (!user) redirect("/login?callbackUrl=/profile/addresses");

  return (
    <ProfileSubpageView
      title='Адреса'
      path='/profile/addresses'
      isBackButton
      modalClassName='h-full sm:h-[700px]'
      desktopBackdrop={<OverlayDesktopBackdrop />}
    >
      <Addresses user={user} />
    </ProfileSubpageView>
  );
}
