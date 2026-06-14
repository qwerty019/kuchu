"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import ModalAlert from "@/components/modal/modal-alert";
import { deleteGoodFilter } from "@/lib/db/goodFilter/actions";

export function DeleteGoodFilter({
  id,
  setOpen,
  mutate,
}: {
  id: number;
  setOpen: (open: boolean) => void;
  mutate: () => void;
}) {
  const [clicked, setClicked] = useState(false);
  const [message, setMessage] = useState("");

  const handleDelete = async () => {
    setClicked(true);

    const action = await deleteGoodFilter(id);

    if (action?.message) {
      setMessage(action.message);
      setClicked(false);
      return;
    }

    mutate();

    setOpen(false);
    setClicked(false);
  };

  return (
    <ModalAlert
      title='Удалить опцию фильтра из товара?'
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
