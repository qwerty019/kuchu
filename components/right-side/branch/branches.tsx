import { useState } from "react";
import { Button } from "../../ui/button";
import { useMainStore } from "@/providers/main-store-provider";
import { setCookie } from "@/lib/actions";
import { User } from "@/lib/auth";
import { changeBranch } from "@/lib/db/branch/actions";
import { CartItemState } from "@/stores/cart-store";
import { useCartStore } from "@/providers/cart-store-provider";
import CheckItemsDialog from "@/components/product/check-items-dialog";

export default function Branches({
  setOpen,
  setType,
  user,
}: {
  setOpen: (open: boolean) => void;
  setType: (type: string | null) => void;
  user: User | null;
}) {
  const [list, setList] = useState<CartItemState[]>([]);
  const [branchId, setBranchId] = useState<number | null>(null);
  const [clicked, setClicked] = useState<number | null>(null);

  const { method, branch, setMethod, setBranch, branches } = useMainStore(
    (state) => state
  );
  const { items, setLastShown } = useCartStore((state) => state);

  const checkItems = async (branchId: number) => {
    try {
      const res = await fetch("/api/cart/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, branch: branchId, method: "pickup" }),
      });

      if (!res.ok) {
        throw new Error("Ошибка при проверке доступности товаров.");
      }

      const data: CartItemState[] = await res.json();

      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const changeBranchId = async (id: number) => {
    if (clicked) return;
    if (id === Number(branch) && method === "pickup") return;

    setClicked(id);

    const data = await checkItems(id);

    if (data?.some((x) => x.comment)) {
      setList(data);
      setBranchId(id);
      setClicked(null);
      return;
    }

    if (user) {
      await changeBranch(id);
    }

    await setCookie("method", "pickup");
    await setCookie("branch", `${id}`);

    setMethod("pickup");
    setBranch(`${id}`);

    setClicked(null);
    setOpen(false);
  };

  return (
    <div className='flex flex-col gap-6 h-full'>
      <ul className='flex flex-col gap-3 h-full text-sm font-medium'>
        {branches?.map((br) => (
          <li key={br.id} className=''>
            <Button
              variant='secondary'
              className={`h-auto p-3 w-full flex-col items-start rounded-2xl ${
                method === "pickup" && branch === `${br.id}`
                  ? "bg-[#A03968] hover:bg-[#A03968] text-white"
                  : "bg-[#F2F2F2]"
              }`}
              onClick={() => changeBranchId(br.id)}
            >
              <p className='text-lg font-semibold'>{br.title}</p>
              <div
                className={`flex items-center gap-1 font-normal text-muted-foreground text-xs ${
                  method === "pickup" && branch === `${br.id}`
                    ? "text-white"
                    : ""
                }`}
              >
                {clicked === br.id ? (
                  <p>Подождите...</p>
                ) : (
                  <p>
                    {br.city.title}
                    {method === "pickup" &&
                      branch === `${br.id}` &&
                      " · Выбрано"}
                  </p>
                )}
              </div>
            </Button>
          </li>
        ))}
      </ul>
      <Button
        variant='secondary'
        className='w-full text-xs rounded-full bg-[#F2F2F2]'
        onClick={() => setType(null)}
      >
        Назад
      </Button>
      {branchId && (
        <CheckItemsDialog
          open={branchId ? true : false}
          setOpen={() => setBranchId(null)}
          list={list}
          setList={setList}
          branch={branchId}
          method='pickup'
          onSuccess={() => {
            setLastShown(Date.now());
            setOpen(false);
            setBranchId(null);
          }}
        />
      )}
    </div>
  );
}
