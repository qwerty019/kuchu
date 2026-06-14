import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import { getBalance } from "@/lib/data";

export default async function Balance() {
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <Info />
      </Suspense>
    </div>
  );
}

async function Info() {
  const data = await getBalance();

  if ("message" in data) {
    return (
      <div className='border rounded-lg w-fit px-2 h-8 text-xs flex items-center justify-center'>
        Ошибка
      </div>
    );
  }

  return (
    <div className='border rounded-lg w-fit px-2 h-8 text-xs flex items-center justify-center'>
      Баланс: {parseFloat(Number(data.balance).toFixed(2))}₽
    </div>
  );
}

function Loading() {
  return <Skeleton className='h-8 w-[86px]' />;
}
