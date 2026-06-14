import { Button } from "../../ui/button";
import { useState } from "react";
import AddAddress from "./add-address";
import { Info, SetInfo } from "@/lib/definitions";
import { useMainStore } from "@/providers/main-store-provider";
import { User } from "@/lib/auth";
import EditAddress from "./edit-address";
import Address from "./address";

export default function Addresses({
  setOpen,
  info,
  setInfo,
  setType,
  user,
}: {
  setOpen: (open: boolean) => void;
  info: Info;
  setInfo: SetInfo;
  setType: (type: string | null) => void;
  user: User | null;
}) {
  const { addresses } = useMainStore((state) => state);

  const [add, setAdd] = useState<boolean>(false);
  const [edit, setEdit] = useState<number | null>(null);

  if (add) {
    return (
      <AddAddress
        setOpen={setAdd}
        info={info}
        setInfo={setInfo}
        user={user}
        setMainOpen={setOpen}
      />
    );
  }

  if (edit) {
    const data = addresses.find((a) => a.id === edit);

    if (!data) return null;

    return (
      <EditAddress
        setOpen={setEdit}
        info={info}
        setInfo={setInfo}
        user={user}
        data={data}
      />
    );
  }

  return (
    <div className='flex flex-col gap-6 text-sm h-full'>
      <div className='flex flex-col gap-3 h-full'>
        {addresses?.map((address) => (
          <Address
            key={address.id}
            address={address}
            setOpen={setOpen}
            user={user}
            setEdit={setEdit}
            setInfo={setInfo}
          />
        ))}
        {addresses.length === 0 && (
          <div className='border rounded-lg flex items-center justify-center h-20 text-muted-foreground'>
            Нет адресов доставки
          </div>
        )}
      </div>
      <div className='space-y-2'>
        <Button
          className='w-full text-xs rounded-full bg-[#A03968] hover:bg-[#A03968] text-white'
          onClick={() => {
            setAdd(true);
            setInfo((prev) => ({ ...prev, add: true }));
          }}
        >
          Добавить адрес доставки
        </Button>
        <Button
          variant='secondary'
          className='w-full text-xs rounded-full bg-[#F2F2F2]'
          onClick={() => setType(null)}
        >
          Назад
        </Button>
      </div>
    </div>
  );
}
