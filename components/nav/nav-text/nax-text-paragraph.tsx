"use client";

import { useMainStore } from "@/providers/main-store-provider";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { initial } from "./nav-text";

export default function NavTextParagraph({
  texts,
}: {
  texts: { id: number; text: string }[];
}) {
  const pathname = usePathname();
  const { text, setText } = useMainStore((state) => state);

  useEffect(() => {
    if (!texts || !texts.length) return;

    const randomText = texts[Math.floor(Math.random() * texts.length)];
    if (!randomText) return;

    setText(randomText.text);
  }, [pathname, texts, setText]);

  return (
    <p className='text-sm text-[#A03968] font-medium text-center'>
      {text || initial}
    </p>
  );
}
