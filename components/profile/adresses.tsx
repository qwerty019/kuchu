"use client";

import { useMainStore } from "@/providers/main-store-provider";
import { Button } from "../ui/button";
import { useState } from "react";
import { User } from "@/lib/auth";
import { showAddInfo } from "@/lib/utils";
import { Choose } from "../right-side/modal/choose";

export default function Addresses({ user }: { user: User | null }) {
  const [open, setOpen] = useState<boolean>(false);
  const { addresses, method } = useMainStore((state) => state);

  return (
    <>
      <div className='space-y-6 truncate'>
        <div className='space-y-2 truncate'>
          {addresses?.map((address) => (
            <div
              key={address.id}
              className={`${
                address.selected && method === "delivery"
                  ? "bg-[#A03968] hover:bg-[#A03968]"
                  : "bg-[#F2F2F2] hover:bg-[#F2F2F2]"
              } h-[62px] rounded-2xl p-3 w-full flex items-center gap-2 truncate`}
            >
              <Button className='cursor-auto p-0 w-full flex flex-col gap-1 text-left truncate bg-transparent hover:bg-transparent h-auto items-start'>
                <p
                  className={`text-lg font-semibold truncate leading-none w-full ${
                    address.selected && method === "delivery"
                      ? "text-white"
                      : "text-primary"
                  }`}
                >
                  {address.address}
                </p>
                {showAddInfo(address) && (
                  <p
                    className={`text-xs font-normal truncate w-full ${
                      address.selected && method === "delivery"
                        ? "text-white/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {showAddInfo(address)}
                  </p>
                )}
              </Button>
            </div>
          ))}
          {addresses?.length === 0 && (
            <div className='border rounded-lg text-sm flex items-center justify-center h-20 text-muted-foreground'>
              Нет адресов доставки
            </div>
          )}
        </div>
        <Button
          className='w-full text-xs rounded-full bg-[#A03968] hover:bg-[#A03968] text-white'
          onClick={() => setOpen(true)}
        >
          Добавить или изменить адрес доставки
        </Button>
      </div>
      {open && (
        <Choose
          open={open}
          setOpen={setOpen}
          user={user}
          initialType='delivery'
        />
      )}
    </>
  );
}
