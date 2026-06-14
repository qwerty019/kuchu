import OverlayDesktopBackdrop from "@/components/layout/overlay-desktop-backdrop";
import AuthGuestPageView from "@/components/auth/auth-guest-page-view";
import FavoritesPageView from "@/components/favorites/favorites-page-view";
import { validateRequest } from "@/lib/auth";
import { getUserGoods } from "@/lib/db/userGood/data";

export default async function FavoritesPage() {
  const { user } = await validateRequest();

  if (!user) {
    return (
      <AuthGuestPageView
        callbackUrl='/favorites'
        desktopBackdrop={<OverlayDesktopBackdrop />}
      />
    );
  }

  const initialFavorites = await getUserGoods({ user });

  return (
    <FavoritesPageView user={user} initialFavorites={initialFavorites} />
  );
}
