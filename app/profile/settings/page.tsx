import OverlayDesktopBackdrop from "@/components/layout/overlay-desktop-backdrop";
import Settings from "@/components/profile/settings";
import ProfileSubpageView from "@/components/profile/profile-subpage-view";
import { validateRequest } from "@/lib/auth";
import { getUserPreferences } from "@/lib/db/user/data";
import { redirect } from "next/navigation";

export default async function Page() {
  const { user } = await validateRequest();

  if (!user) redirect("/login?callbackUrl=/profile/settings");

  const data = await getUserPreferences(user.id);

  if (!data) redirect("/");

  if ("message" in data) redirect("/profile");

  return (
    <ProfileSubpageView
      title='Настройки'
      path='/profile/settings'
      isBackButton
      desktopBackdrop={<OverlayDesktopBackdrop />}
    >
      <Settings user={user} data={data} />
    </ProfileSubpageView>
  );
}
