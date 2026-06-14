import { useMainStore } from "@/providers/main-store-provider";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";

export default function Chosen({
  setOpen,
}: {
  setOpen: (open: boolean) => void;
}) {
  const { method, branches, branch, addresses } = useMainStore(
    (state) => state
  );

  if (method === null) {
    const branch = branches.find((b) => b.main);

    return (
      <ChosenButton title={branch?.title} method='pickup' setOpen={setOpen} />
    );
  }

  if (method === "pickup" && branch) {
    const chosenBranch = branches.find((b) => b.id === Number(branch));

    if (chosenBranch) {
      return (
        <ChosenButton
          title={chosenBranch.title}
          method={method}
          setOpen={setOpen}
        />
      );
    }
  }

  if (method === "delivery" && addresses.length > 0) {
    const address = addresses.find((a) => a.selected);

    if (address) {
      return (
        <ChosenButton
          title={address.address}
          method={method}
          setOpen={setOpen}
        />
      );
    }
  }

  const mainBranch = branches.find((b) => b.main);

  return (
    <ChosenButton title={mainBranch?.title} method='pickup' setOpen={setOpen} />
  );
}

const ChosenButton = ({
  title,
  method,
  setOpen,
}: {
  title: string | undefined;
  method: string;
  setOpen: (open: boolean) => void;
}) => {
  return (
    <Button
      variant='link'
      className='flex flex-col items-start h-full w-full p-0 truncate'
      onClick={() => setOpen(true)}
    >
      <div className='flex items-center gap-2'>
        <p className='font-semibold text-lg'>{title || "Филиал"}</p>
        <ChevronDown className='text-muted-foreground w-4 h-4' />
      </div>
      <p className='text-muted-foreground text-xs'>
        {method === "delivery" ? "Доставка" : "Самовывоз"}
      </p>
    </Button>
  );
};
