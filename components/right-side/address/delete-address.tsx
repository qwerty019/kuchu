"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import ModalAlert from "@/components/modal/modal-alert";
import { useMainStore } from "@/providers/main-store-provider";
import { User } from "@/lib/auth";
import { setCookie } from "@/lib/actions";
import { deleteAddress, changeAddress } from "@/lib/db/address/actions";

export function DeleteAddress({
  id,
  user,
  setOpen,
}: {
  id: number;
  user: User | null;
  setOpen: React.Dispatch<React.SetStateAction<number | null>>;
}) {
  const [clicked, setClicked] = useState(false);
  const [message, setMessage] = useState("");
  const { setAddresses, addresses, branches, setMethod, method } = useMainStore(
    (state) => state
  );

  const handleDelete = async () => {
    const main = branches.find((b) => b.main);
    if (!main) return;

    setClicked(true);

    if (user) {
      const action = await deleteAddress(id);
      if (action?.message) {
        setMessage(action.message);
        setClicked(false);
        return;
      }
    }

    const filtered = addresses.filter((a) => a.id !== id);

    if (filtered.length === 0) {
      setAddresses([]);
      localStorage.removeItem("address");

      if (method !== "pickup") {
        await setCookie("method", "pickup");
        setMethod("pickup");
      }

      setClicked(false);
      setOpen(null);
      return;
    }

    const selected = filtered.find((a) => a.selected);

    if (!selected) {
      const last = filtered[filtered.length - 1];

      if (user) {
        await changeAddress(last.id);
      }

      setAddresses(() => {
        const updated = filtered.map((a) => ({
          ...a,
          selected: a.id === last.id,
        }));

        localStorage.setItem("address", JSON.stringify(updated));

        return updated;
      });
    } else {
      setAddresses(filtered);
      localStorage.setItem("address", JSON.stringify(filtered));
    }

    setClicked(false);
    setOpen(null);
  };

  return (
    <ModalAlert
      title='Удалить адрес?'
      onClick={() => handleDelete()}
      clicked={clicked}
      message={message}
    >
      <Button
        type='button'
        variant='destructive'
        className='p-4 rounded-full text-xs'
      >
        <Trash2 className='w-4 h-4' />
      </Button>
    </ModalAlert>
  );
}
