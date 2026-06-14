"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useIsDesktop } from "@/hooks/use-is-desktop";
import GoodDialog from "./good-dialog";
import { Good, GoodDetails } from "@/lib/db/good/definitions";

export function ProductModal({
  good,
  similar,
  className,
  recs,
}: {
  good: GoodDetails;
  similar: Good[];
  className?: string;
  recs: Good[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useIsDesktop();

  function onDismiss() {
    if (window.history.length <= 2) {
      router.push("/");
    } else {
      router.back();
    }
  }

  if (pathname !== `/product/${good.regId}`) {
    return null;
  }

  if (!isDesktop) {
    return null;
  }

  return (
    <Dialog
      open={true}
      onOpenChange={(open) => {
        if (!open) onDismiss();
      }}
    >
      <DialogContent
        className={cn(
          "sm:max-w-3xl w-full [&_.close-dialog]:hidden rounded-2xl sm:rounded-2xl sm:min-h-[700px] sm:h-fit",
          className,
        )}
      >
        <GoodDialog good={good} similar={similar} recs={recs} />
      </DialogContent>
    </Dialog>
  );
}
