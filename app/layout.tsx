import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "@/providers/providers";
import CartButton from "@/components/cart/cart-button";
import RightSide from "@/components/right-side/right-side";
import Nav from "@/components/nav/nav";
import ConditionalNav from "@/components/nav/conditional-nav";
import Footer from "@/components/footer";
import Script from "next/script";
import LeftSide from "@/components/left-side/left-side";
import LayoutLine from "@/components/layout-line";
import MobileContentShell from "@/components/layout/mobile-content-shell";
import { CookieConsent } from "@/components/ui/cookie-consent";
import { validateRequest } from "@/lib/auth";
import Onboarding from "@/components/onboarding";
import MobileBottomNav from "@/components/nav/mobile-bottom-nav";
import FavoritesDrawer from "@/components/profile/favorites-drawer";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#A03968",
};

export const metadata: Metadata = {
  applicationName: "KUCHU",
  title: "KUCHU - Родная Аптека",
  description:
    "Сеть аптек «Kuchu» с доставкой г. Нюрба, г. Якутск, г.Мирный. Родная Аптека Республики Саха",
  keywords:
    "Аптека, интернет аптека, онлайн аптека, заказ лекарств, лекарства, кучу, доставка лекарств, доставка лекарств Якутск",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "KUCHU",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export default async function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const { user } = await validateRequest();

  return (
    <html lang='ru'>
      <head>
        <link rel='icon' href='/icon.ico' sizes='any' />
      </head>
      <body
        className={`${inter.className} flex min-h-dvh flex-col bg-[#F3F2F2] max-lg:bg-background lg:gap-4`}
      >
        <NextTopLoader color='#A03968' showSpinner={false} />
        <Providers>
          <ConditionalNav>
            <Nav user={user} />
          </ConditionalNav>
          <Suspense
            fallback={
              <div className='relative flex w-full min-h-0 flex-1 flex-col max-lg:mb-0 max-lg:bg-background lg:mb-4 max-lg:pb-[calc(0.5rem+4.25rem+env(safe-area-inset-bottom,0px))]'>
                <LayoutLine />
                <LeftSide />
                {children}
                <RightSide user={user} />
                <CartButton user={user} />
                <MobileBottomNav isAuthenticated={!!user} />
                <FavoritesDrawer />
              </div>
            }
          >
            <MobileContentShell>
              <LayoutLine />
              <LeftSide />
              {children}
              <RightSide user={user} />
              <CartButton user={user} />
              <MobileBottomNav isAuthenticated={!!user} />
              <FavoritesDrawer />
            </MobileContentShell>
          </Suspense>
          <Footer />
          {modal}
          <CookieConsent />
          <Onboarding />
        </Providers>
        <Toaster closeButton />
        {process.env.NODE_ENV === "production" && (
          <Script id='yandex-metrika'>
            {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
              m[i].l=1*new Date();
              for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
              k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
              (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
              
              ym(99516556, "init", {
               clickmap:true,
               trackLinks:true,
               accurateTrackBounce:true,
               webvisor:true
              })`}
          </Script>
        )}
      </body>
    </html>
  );
}
