"use client";

import { CartStoreProvider } from "./cart-store-provider";
import { MainStoreProvider } from "./main-store-provider";
import { CookieConsentProvider } from "./cookie-consent-provider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CookieConsentProvider>
      <MainStoreProvider>
        <CartStoreProvider>{children}</CartStoreProvider>
      </MainStoreProvider>
    </CookieConsentProvider>
  );
}
