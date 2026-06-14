"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { getCards, updateCard } from "./actions";
import { toast } from "sonner";
import { CardsModal } from "./cards-modal";
import { DiscountCard } from "@/lib/farmbazis/definitions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInAdmin } from "@/lib/db/user/schema";
import { updateRole } from "@/lib/db/user/actions";

interface DataTableRowActionsProps {
  user: UserInAdmin;
  setUsers: React.Dispatch<React.SetStateAction<UserInAdmin[]>>;
}

export function DataTableRowActions({
  user,
  setUsers,
}: DataTableRowActionsProps) {
  const [clicked, setClicked] = useState(false);
  const [clicked2, setClicked2] = useState(false);
  const [cards, setCards] = useState<DiscountCard[]>([]);
  const [open, setOpen] = useState(false);

  const handleUpdate = async () => {
    if (clicked) return;
    if (!user.phone) return;

    setClicked(true);

    const action = await getCards(user.phone);
    if ("message" in action) {
      toast.error(action.message);
      setClicked(false);
      return;
    }

    if (action.length === 1) {
      const confirm = window.confirm("Найдена 1 карта. Соединить?");
      if (!confirm) {
        setClicked(false);
        return;
      }

      const action2 = await updateCard(action[0], user.id);
      if ("message" in action2) {
        toast.error(action2.message);
        setClicked(false);
        return;
      }

      setUsers((prev: any) => {
        const index = prev.findIndex((u: any) => u.id === user.id);
        prev[index].discountCards = [action2];
        return [...prev];
      });

      setClicked(false);
      return;
    }

    setClicked(false);
    setCards(action);
    setOpen(true);
  };

  const handleRole = async () => {
    if (clicked2) return;

    setClicked2(true);

    const confirm = window.confirm(
      user.roles && user.roles.length > 0 ? "Удалить роль?" : "Добавить роль?"
    );
    if (!confirm) return;

    const action = await updateRole(user.id);
    if ("message" in action) {
      toast.error(action.message);
      setClicked2(false);
      return;
    }

    setUsers((prev) => {
      const index = prev.findIndex((u) => u.id === user.id);
      prev[index].roles = action.roles;
      return [...prev];
    });

    setClicked2(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <MoreHorizontal className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-fit'>
          <DropdownMenuItem onClick={() => handleUpdate()} disabled={clicked}>
            Обновить карту
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleRole()} disabled={clicked2}>
            {user.roles && user.roles.length > 0
              ? "Удалить роль"
              : "Добавить роль"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {open && (
        <CardsModal
          open={open}
          setOpen={setOpen}
          cards={cards}
          setCards={setCards}
          setUsers={setUsers}
          id={user.id}
        />
      )}
    </>
  );
}
