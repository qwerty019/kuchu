import { ClockIcon, Loader2 } from "lucide-react";
import { Button } from "../../ui/button";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { random5 } from "@/lib/utils";
import { Info, SetInfo } from "@/lib/definitions";
import { useMainStore } from "@/providers/main-store-provider";
import { setCookie } from "@/lib/actions";
import { User } from "@/lib/auth";
import { CustomInput } from "../../form/input";
import { initialInfo } from "../modal/choose";
import { AddressInput2 } from "./address-input2";
import { AddAddressSchema, Address } from "@/lib/db/address/schema";
import { addAddress, changeAddress } from "@/lib/db/address/actions";
import { CartItemState } from "@/stores/cart-store";
import { useCartStore } from "@/providers/cart-store-provider";
import CheckItemsDialog from "@/components/product/check-items-dialog";

export default function AddAddress({
  info,
  setOpen,
  setInfo,
  user,
  setMainOpen,
}: {
  info: Info;
  setOpen: (open: boolean) => void;
  setInfo: SetInfo;
  user: User | null;
  setMainOpen: (open: boolean) => void;
}) {
  const [clicked, setClicked] = useState<boolean>(false);
  const [list, setList] = useState<CartItemState[]>([]);
  const [checkInfo, setCheckInfo] = useState<{
    branchId: number | null;
    addressId: number | null;
    name: string | null;
    open: boolean;
  }>({
    branchId: null,
    addressId: null,
    name: null,
    open: false,
  });

  const {
    method,
    setMethod,
    branch,
    setBranch,
    setAddresses,
    branches,
    zones,
  } = useMainStore((state) => state);
  const { items, setLastShown } = useCartStore((state) => state);

  const form = useForm<z.infer<typeof AddAddressSchema>>({
    resolver: zodResolver(AddAddressSchema),
    defaultValues: {
      search: "",
      comment: null,
      entrance: null,
      floor: null,
      apartment: null,
    },
  });

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

  async function onSubmit(values: z.infer<typeof AddAddressSchema>) {
    const main = branches.find((b) => b.main);
    if (!main) return;

    setClicked(true);

    let id: number | null = null;

    if (user) {
      const action = await addAddress(values);

      if ("errors" in action && action.errors) {
        Object.entries(action.errors).forEach(([key, value]) => {
          form.setError(key as keyof z.infer<typeof AddAddressSchema>, {
            message: value[0],
          });
        });
        setClicked(false);
        return;
      }

      if ("message" in action) {
        form.setError("comment", { message: action.message });
        setClicked(false);
        return;
      }

      id = action.id;
    }

    setAddresses((prev) => {
      const updated = prev.map((a) => ({
        ...a,
        selected: false,
      }));

      id = id || getGeneratedId(updated);

      const newAddress = {
        id: id,
        address: values.address,
        entrance: values.entrance || null,
        floor: values.floor || null,
        apartment: values.apartment || null,
        comment: values.comment || null,
        zoneId: values.zoneId || null,
        lat: values.lat,
        long: values.long,
        selected: false,
      };

      const withNew = updated.concat([newAddress]);

      localStorage.setItem("address", JSON.stringify(withNew));

      return withNew;
    });

    const data = await checkItems(main.id);

    if (data?.some((x) => x.comment)) {
      setList(data);
      setCheckInfo({
        branchId: main.id,
        addressId: id,
        name: values.address,
        open: true,
      });
      setClicked(false);
      return;
    }

    if (user && id) {
      await changeAddress(id);
    }

    setAddresses((prev) => {
      const updated = prev.map((a) => ({
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

    setClicked(false);
    setOpen(false);
    setMainOpen(false);
  }

  const zoneId = form.watch("zoneId");
  const zone = zones?.find((z) => z.id === zoneId);

  useEffect(() => {
    if (info.found) {
      form.setValue("address", info.found.address, { shouldDirty: true });
      form.setValue("lat", info.found.lat, { shouldDirty: true });
      form.setValue("long", info.found.long, { shouldDirty: true });
      form.setValue("zoneId", info.found.zoneId, { shouldDirty: true });
      form.setValue("search", info.found.address, { shouldDirty: true });

      setInfo((prev) => ({
        ...prev,
        clicked: false,
        result: null,
        found: null,
        error: null,
      }));
    }
  }, [info.found, setInfo, form]);

  useEffect(() => {
    if (info.error) {
      form.setValue("search", "");
      form.setValue("address", "");
      form.setError("search", { message: info.error });
    }
  }, [info.error, form]);

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='flex flex-col gap-6 h-full'
        >
          <div className='flex flex-col gap-3 h-full'>
            <AddressInput2
              form={form}
              label='Улица и дом (полностью)'
              name='search'
              info={info}
              setInfo={setInfo}
            />
            <div className='flex gap-3'>
              <CustomInput form={form} label='Подъезд' name='entrance' />
              <CustomInput form={form} label='Этаж' name='floor' />
              <CustomInput form={form} label='Квартира' name='apartment' />
            </div>
            <CustomInput
              form={form}
              label='Комментарий к адресу'
              name='comment'
            />
          </div>
          <div className='space-y-2'>
            {zone?.price && (
              <div className='rounded-2xl p-3 space-y-3 bg-[#F2F2F2]'>
                <div>
                  <div className='flex items-center justify-between gap-2'>
                    <p className='font-semibold'>Стоимость доставки</p>
                    <p className='font-semibold'>{zone.price} ₽</p>
                  </div>
                  <p className='text-muted-foreground text-xs'>
                    Бесплатно от {zone.freeDelivery}₽
                  </p>
                </div>
                <div className='flex items-center gap-2'>
                  <ClockIcon className='w-5 h-5' />
                  <p className='text-muted-foreground text-xs'>30-90 минут</p>
                </div>
              </div>
            )}
            <div className='space-y-2'>
              <Button
                className='mt-auto w-full text-xs rounded-full bg-[#A03968] hover:bg-[#A03968] text-white'
                disabled={clicked}
              >
                {clicked ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                    Подождите...
                  </>
                ) : (
                  "Запомнить адрес"
                )}
              </Button>
              <Button
                variant='secondary'
                className='w-full text-xs rounded-full bg-[#F2F2F2]'
                disabled={clicked}
                onClick={() => {
                  setOpen(false);
                  setInfo(initialInfo);
                }}
              >
                Назад
              </Button>
            </div>
          </div>
        </form>
      </Form>
      {checkInfo.branchId && (
        <CheckItemsDialog
          open={checkInfo.open}
          setOpen={() =>
            setCheckInfo({
              branchId: null,
              addressId: null,
              name: null,
              open: false,
            })
          }
          list={list}
          setList={setList}
          branch={checkInfo.branchId}
          method='delivery'
          name={checkInfo.name}
          onSuccess={async () => {
            if (!checkInfo.addressId || !checkInfo.branchId) return;

            setClicked(true);

            if (user) {
              await changeAddress(checkInfo.addressId);
            }

            setAddresses((prev) => {
              const updated = prev.map((a) => ({
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

            if (!checkInfo.branchId) return;

            if (branch !== checkInfo.branchId.toString()) {
              await setCookie("branch", checkInfo.branchId.toString());
              setBranch(checkInfo.branchId.toString());
            }

            setLastShown(Date.now());
            setOpen(false);
            setClicked(false);
            setCheckInfo({
              branchId: null,
              addressId: null,
              name: null,
              open: false,
            });
            setMainOpen(false);
          }}
        />
      )}
    </>
  );
}

const getGeneratedId = (addresses: Address[]) => {
  let generated: number;

  do {
    generated = random5();
  } while (addresses.some((a) => a.id === generated));

  return generated;
};
