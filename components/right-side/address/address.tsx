import { Button } from "@/components/ui/button";
import { setCookie } from "@/lib/actions";
import { showAddInfo } from "@/lib/utils";
import { useMainStore } from "@/providers/main-store-provider";
import { User } from "@/lib/auth";
import { Edit2 } from "lucide-react";
import { useState } from "react";
import { Info } from "@/lib/definitions";
import { Address as AddressType } from "@/lib/db/address/schema";
import { changeAddress } from "@/lib/db/address/actions";
import { CartItemState } from "@/stores/cart-store";
import { useCartStore } from "@/providers/cart-store-provider";
import CheckItemsDialog from "@/components/product/check-items-dialog";

export default function Address({
  address,
  setOpen,
  user,
  setEdit,
  setInfo,
}: {
  address: AddressType;
  setOpen: (open: boolean) => void;
  user: User | null;
  setEdit: React.Dispatch<React.SetStateAction<number | null>>;
  setInfo: React.Dispatch<React.SetStateAction<Info>>;
}) {
  const { method, setAddresses, setMethod, branch, setBranch, branches } =
    useMainStore((state) => state);
  const { items, setLastShown } = useCartStore((state) => state);

  const [clicked, setClicked] = useState<number | null>(null);
  const [list, setList] = useState<CartItemState[]>([]);
  const [checkInfo, setCheckInfo] = useState<{
    branchId: number | null;
    addressId: number | null;
    open: boolean;
    name: string | null;
  }>({ branchId: null, addressId: null, open: false, name: null });

  const checkItems = async (branchId: number) => {
    try {
      const res = await fetch("/api/cart/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, branch: branchId, method: "delivery" }),
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

  const handleAddressChange = async (id: number) => {
    if (clicked) return;
    if (address.selected && method === "delivery") return;

    const main = branches.find((b) => b.main);
    if (!main) return;

    setClicked(id);

    const data = await checkItems(main.id);

    if (data?.some((x) => x.comment)) {
      setList(data);
      setCheckInfo({
        branchId: main.id,
        addressId: id,
        name: address.address,
        open: true,
      });
      setClicked(null);
      return;
    }

    if (user) {
      await changeAddress(id);
    }

    setAddresses((prev: any) => {
      const updated = prev.map((a: any) => ({
        ...a,
        selected: a.id === id,
      }));

      localStorage.setItem("address", JSON.stringify(updated));

      return updated;
    });

    if (method !== "delivery") {
      await setCookie("method", "delivery");
      setMethod("delivery");
    }

    if (branch !== main.id.toString()) {
      await setCookie("branch", main.id.toString());
      setBranch(main.id.toString());
    }

    setClicked(null);
    setOpen(false);
  };

  return (
    <div
      className={`${
        address.selected && method === "delivery"
          ? "bg-[#A03968] hover:bg-[#A03968]"
          : "bg-[#F2F2F2] hover:bg-[#F2F2F2]"
      } h-[62px] w-full rounded-2xl p-3 flex items-center gap-2 truncate`}
    >
      <Button
        className='p-0 w-full flex flex-col gap-1 text-left truncate bg-transparent hover:bg-transparent h-auto items-start'
        onClick={() => {
          handleAddressChange(address.id);
        }}
      >
        <p
          className={`text-lg font-semibold truncate leading-none w-full ${
            address.selected && method === "delivery"
              ? "text-white"
              : "text-primary"
          }`}
        >
          {address.address}
        </p>
        {(clicked === address.id || showAddInfo(address)) && (
          <p
            className={`text-xs font-normal truncate w-full ${
              address.selected && method === "delivery"
                ? "text-white/80"
                : "text-muted-foreground"
            }`}
          >
            {clicked === address.id ? "Подождите..." : showAddInfo(address)}
          </p>
        )}
      </Button>
      <Button
        variant='secondary'
        className='h-8 w-8 bg-[#F2F2F2] shrink-0'
        size='icon'
        onClick={() => {
          setEdit(address.id);
          setInfo((prev) => ({ ...prev, add: true }));
        }}
      >
        <Edit2 className='w-4 h-4' />
      </Button>
      {checkInfo.branchId && (
        <CheckItemsDialog
          open={checkInfo.open}
          setOpen={() =>
            setCheckInfo({
              branchId: null,
              addressId: null,
              open: false,
              name: null,
            })
          }
          list={list}
          setList={setList}
          branch={checkInfo.branchId}
          method='delivery'
          name={checkInfo.name}
          onSuccess={async () => {
            if (!checkInfo.addressId || !checkInfo.branchId) return;

            setClicked(checkInfo.addressId);

            if (user) {
              await changeAddress(checkInfo.addressId);
            }

            setAddresses((prev: any) => {
              const updated = prev.map((a: any) => ({
                ...a,
                selected: a.id === checkInfo.addressId,
              }));

              localStorage.setItem("address", JSON.stringify(updated));

              return updated;
            });

            if (method !== "delivery") {
              await setCookie("method", "delivery");
              setMethod("delivery");
            }

            if (branch !== checkInfo.branchId.toString()) {
              await setCookie("branch", checkInfo.branchId.toString());
              setBranch(checkInfo.branchId.toString());
            }

            setLastShown(Date.now());
            setCheckInfo({
              branchId: null,
              addressId: null,
              open: false,
              name: null,
            });
            setClicked(null);
            setOpen(false);
          }}
        />
      )}
    </div>
  );
}
