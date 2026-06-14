"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface CookieConsentContextType {
  hasConsented: boolean | null;
  giveConsent: () => void;
  removeConsent: () => void;
}

const CookieConsentContext = createContext<
  CookieConsentContextType | undefined
>(undefined);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  const [hasConsented, setHasConsented] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Only run on client side
    const consent = localStorage.getItem("cookieConsent");
    setHasConsented(consent === "true");
  }, []);

  const giveConsent = () => {
    if (isClient) {
      localStorage.setItem("cookieConsent", "true");
      setHasConsented(true);
    }
  };

  const removeConsent = () => {
    if (isClient) {
      localStorage.removeItem("cookieConsent");
      setHasConsented(false);
    }
  };

  return (
    <CookieConsentContext.Provider
      value={{ hasConsented, giveConsent, removeConsent }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const context = useContext(CookieConsentContext);
  if (context === undefined) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }
  return context;
}
