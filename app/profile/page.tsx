import OverlayDesktopBackdrop from "@/components/layout/overlay-desktop-backdrop";
import AuthGuestPageView from "@/components/auth/auth-guest-page-view";
import ProfilePageView from "@/components/profile/profile-page-view";
import { validateRequest } from "@/lib/auth";

export default async function Page() {
  const { user } = await validateRequest();

  if (!user) {
    return (
      <AuthGuestPageView
        callbackUrl='/profile'
        desktopBackdrop={<OverlayDesktopBackdrop />}
      />
    );
  }

  return (
    <ProfilePageView
      user={user}
      desktopBackdrop={<OverlayDesktopBackdrop />}
    />
  );
}
