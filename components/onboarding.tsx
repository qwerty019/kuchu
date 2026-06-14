"use client";

import { useEffect } from "react";
import Stories from "./onboarding/stories";
import { useMainStore } from "@/providers/main-store-provider";
import type { Onboarding } from "@/stores/main-store";
import { CartOnboarding } from "./onboarding/cart";

const initial: Onboarding = {
  search: "false",
  cart: "false",
  stories: "show",
  mounted: true,
};

export default function Onboarding() {
  const { onboarding, setOnboarding, zones } = useMainStore((state) => state);
  const { stories, mounted } = onboarding;

  useEffect(() => {
    const item = localStorage.getItem("onboarding");
    if (item) {
      const parsed = JSON.parse(item);
      setOnboarding({
        search: parsed.search,
        cart: parsed.cart,
        stories: parsed.stories,
        mounted: true,
      });
    } else {
      localStorage.setItem("onboarding", JSON.stringify(initial));
      setOnboarding(initial);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted) return null;

  return (
    <>
      {stories === "show" && zones.length > 0 && (
        <Stories open={stories === "show"} setOnboarding={setOnboarding} />
      )}
      <CartOnboarding />
    </>
  );
}
