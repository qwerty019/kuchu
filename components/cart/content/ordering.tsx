"use client";

import Order from "../ordering/order";
import Payment from "../ordering/payment";
import Discount from "../ordering/discount";
import { User } from "@/lib/auth";
import { Info } from "../definitions";
import Recomendations from "./recomendations";

export default function Ordering({
  step,
  info,
  setInfo,
  user,
  slots,
  isMobile = false,
}: {
  step: number;
  info: Info;
  setInfo: React.Dispatch<React.SetStateAction<Info>>;
  user: User | null;
  slots: { label: string; value: string; desc: string | undefined }[];
  isMobile?: boolean;
}) {
  if (step === 0) {
    return <Recomendations />;
  }

  if (step === 1 && !isMobile) {
    return <Discount setInfo={setInfo} info={info} />;
  }

  return (
    <section className='flex flex-col flex-1 gap-4'>
      <Order setInfo={setInfo} info={info} user={user} slots={slots} />
      <Payment setInfo={setInfo} info={info} />
      {isMobile && <Discount setInfo={setInfo} info={info} />}
    </section>
  );
}
