import { fetchText } from "@/lib/db/navtext/data";
import { Suspense } from "react";
import NavTextParagraph from "./nax-text-paragraph";

export const initial = "Осознанная аптека";

export default async function NavText() {
  return (
    <Suspense
      fallback={<p className='text-sm text-[#A03968] font-medium'>{initial}</p>}
    >
      <Text />
    </Suspense>
  );
}

async function Text() {
  const texts = await fetchText();

  return <NavTextParagraph texts={texts} />;
}
