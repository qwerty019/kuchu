"use client";

import { useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Loader2 } from "lucide-react";
import { changeName } from "./actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { User } from "@/lib/auth";

export default function NameBlock({ user }: { user: User }) {
  const [edit, setEdit] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [name, setName] = useState(user.name || "");
  const buttonRef = useRef(false);
  const router = useRouter();

  async function handleSave() {
    if (clicked) return;
    if (!user) return;

    setClicked(true);

    const action = await changeName(name);
    if (action?.message) {
      toast.error(action.message);
      setClicked(false);
      return;
    }

    router.refresh();

    setClicked(false);
    setEdit(false);
  }

  const handleBlur = () => {
    if (buttonRef.current) {
      buttonRef.current = false; // Reset the flag
      return;
    }
    setEdit(false);
  };

  const handleMouseDown = () => {
    buttonRef.current = true;
  };

  if (edit) {
    return (
      <div className='flex items-center gap-2'>
        <Input
          autoFocus
          type='text'
          placeholder='Ваше имя'
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleBlur}
        />
        <Button
          size='icon'
          className='w-10'
          onMouseDown={handleMouseDown}
          onClick={handleSave}
          disabled={user.name === (name || null) || clicked}
        >
          {clicked ? (
            <Loader2 className='w-4 h-4 animate-spin' />
          ) : (
            <Check className='w-4 h-4' />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className='flex items-center gap-1 cursor-pointer'>
      <p
        className='text-2xl font-semibold hover:underline'
        onClick={() => setEdit(true)}
      >
        {user?.name || "Как вас зовут?"}
      </p>
    </div>
  );
}
