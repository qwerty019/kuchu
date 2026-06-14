"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useMediaQuery } from "../../../hooks/use-media-query";
import { useMainStore } from "@/providers/main-store-provider";
import MethodDrawer from "./method-drawer";
import MethodDialog from "./method-dialog";
import { User } from "@/lib/auth";
import { setCookie } from "@/lib/actions";
import { useState } from "react";
import { Info } from "@/lib/definitions";

export const initialInfo: Info = {
  add: false,
  clicked: false,
  loading: false,
  search: "",
  lat: null,
  long: null,
  result: null,
  found: null,
  error: null,
};

export function Choose({
  open,
  setOpen,
  user,
  initialType = null,
}: {
  open: boolean;
  setOpen: (bool: boolean) => void;
  user: User | null;
  initialType?: string | null;
}) {
  const { method, setBranch, setMethod } = useMainStore((state) => state);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleOpen = async (open: boolean) => {
    if (!open) {
      setInfo(initialInfo);
    }

    if (method === null && !open) {
      await setCookie("method", "pickup");
      await setCookie("branch", "1");

      setMethod("pickup");
      setBranch("1");

      setOpen(false);
    } else {
      setOpen(open);
    }
  };

  const [type, setType] = useState<string | null>(initialType);
  const [info, setInfo] = useState<Info>(initialInfo);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={handleOpen}>
        <DialogContent
          className={`flex gap-6 [&_.close-dialog]:hidden rounded-2xl sm:rounded-2xl max-h-[700px] relative ${info.add ? "max-w-4xl" : "max-w-[425px]"}`}
        >
          <MethodDialog
            setOpen={setOpen}
            user={user}
            info={info}
            setInfo={setInfo}
            type={type}
            setType={setType}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={handleOpen}>
      <DrawerContent className='max-h-[90vh] [&_.close-drawer]:hidden overflow-hidden'>
        <MethodDrawer
          setOpen={setOpen}
          user={user}
          info={info}
          setInfo={setInfo}
          type={type}
          setType={setType}
        />
      </DrawerContent>
    </Drawer>
  );
}
