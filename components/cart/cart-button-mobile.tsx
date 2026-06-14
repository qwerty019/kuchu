"use client";

import { User } from "@/lib/auth";
import { useMainStore } from "@/providers/main-store-provider";
import CartMobilePreview from "./cart-mobile-preview";

export default function CartButtonMobile({ user }: { user: User | null }) {
  const mobileCartOpen = useMainStore((state) => state.mobileCartOpen);
  const setMobileCartOpen = useMainStore((state) => state.setMobileCartOpen);

  return (
    <div className='lg:contents'>
      <CartMobilePreview
        user={user}
        open={mobileCartOpen}
        onClose={() => setMobileCartOpen(false)}
      />
    </div>
  );
}
