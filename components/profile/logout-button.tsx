"use client";

import { Button } from "../ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { logout } from "./actions";

export default function LogoutButton() {
  const [clicked, setClicked] = useState(false);

  const signOut = async () => {
    setClicked(true);
    await logout();
    window.location.reload();
  };

  return (
    <Button
      className='w-[137px] rounded-full text-xs py-3 h-auto'
      variant='secondary'
      disabled={clicked}
      onClick={() => signOut()}
    >
      {clicked ? (
        <>
          <Loader2 className='w-4 h-4 animate-spin mr-2' /> Подождите...
        </>
      ) : (
        "Выйти"
      )}
    </Button>
  );
}
