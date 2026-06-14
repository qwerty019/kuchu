"use client";

import { useState } from "react";
import ModalAlert from "../modal/modal-alert";
import { Button } from "../ui/button";
import { deleteAccount } from "./actions";
import { useRouter } from "next/navigation";

export default function DeleteAccount() {
  const [clicked, setClicked] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleDelete = async () => {
    setClicked(true);
    const action = await deleteAccount();
    if (action?.message) {
      setMessage(action.message);
      setClicked(false);
      return;
    }

    router.refresh();
  };

  return (
    <>
      <ModalAlert
        title='Это действие удалит ваш аккаунт и все ваши данные.'
        onClick={() => handleDelete()}
        clicked={clicked}
        message={message}
      >
        <Button
          variant='outline'
          className='group border-destructive text-destructive hover:text-white hover:bg-destructive items-start flex-col rounded-2xl w-full p-3 h-auto'
        >
          <p> Удалить аккаунт</p>
          <p className='text-destructive/70 group-hover:text-white/70'>
            Это действие нельзя будет отменить.
          </p>
        </Button>
      </ModalAlert>
    </>
  );
}
