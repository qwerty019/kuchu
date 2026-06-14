import { ClockIcon, Loader2 } from "lucide-react";
import { Button } from "../../ui/button";
import { useEffect, useState } from "react";
import { Form } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, SetInfo } from "@/lib/definitions";
import { useMainStore } from "@/providers/main-store-provider";
import { User } from "@/lib/auth";
import { CustomInput } from "../../form/input";
import { DeleteAddress } from "./delete-address";
import { initialInfo } from "../modal/choose";
import { AddressInput2 } from "./address-input2";
import { AddAddressSchema, Address } from "@/lib/db/address/schema";
import { editAddress } from "@/lib/db/address/actions";

export default function EditAddress({
  data,
  info,
  setOpen,
  setInfo,
  user,
}: {
  data: Address;
  info: Info;
  setOpen: React.Dispatch<React.SetStateAction<number | null>>;
  setInfo: SetInfo;
  user: User | null;
}) {
  const [clicked, setClicked] = useState<boolean>(false);
  const { setAddresses, branches, zones } = useMainStore((state) => state);

  const form = useForm<z.infer<typeof AddAddressSchema>>({
    resolver: zodResolver(AddAddressSchema),
  });

  const isDirty = form.formState.isDirty;

  async function onSubmit(values: z.infer<typeof AddAddressSchema>) {
    const main = branches.find((b) => b.main);

    if (!main) return;

    setClicked(true);

    if (user) {
      const action = await editAddress(data.id, values);

      if (action?.errors) {
        Object.entries(action.errors).forEach(([key, value]) => {
          form.setError(key as keyof z.infer<typeof AddAddressSchema>, {
            message: value[0],
          });
        });
        setClicked(false);
        return;
      }

      if (action?.message) {
        form.setError("comment", { message: action.message });
        setClicked(false);
        return;
      }
    }

    setAddresses((prev) => {
      const found = prev.find((a) => a.id === data.id);

      if (!found) return prev;

      const newAddress = {
        id: data.id,
        address: values.address,
        entrance: values?.entrance || null,
        floor: values?.floor || null,
        apartment: values?.apartment || null,
        comment: values?.comment || null,
        zoneId: values?.zoneId || null,
        lat: values.lat,
        long: values.long,
        selected: found.selected,
      };

      const filtered = prev.map((a) => {
        if (a.id === data.id) return newAddress;
        return a;
      });

      localStorage.setItem("address", JSON.stringify(filtered));

      return filtered;
    });

    setClicked(false);
    setInfo(initialInfo);
    setOpen(null);
  }

  useEffect(() => {
    if (data) {
      form.reset({
        ...data,
        search: data.address,
      });
    }
  }, [form, data]);

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
      form.setValue("search", "", { shouldDirty: true });
      form.setValue("address", "", { shouldDirty: true });
      form.setError("search", { message: info.error });
    }
  }, [info.error, form]);

  return (
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
            <div className='flex items-center gap-2'>
              <DeleteAddress id={data.id} setOpen={setOpen} user={user} />
              <Button
                className='mt-auto w-full text-xs rounded-full bg-[#A03968] hover:bg-[#A03968] text-white'
                disabled={!isDirty || clicked}
              >
                {clicked ? (
                  <>
                    <Loader2 className='w-4 h-4 animate-spin mr-2' />
                    Подождите...
                  </>
                ) : (
                  "Редактировать адрес"
                )}
              </Button>
            </div>
            <Button
              variant='secondary'
              className='w-full text-xs rounded-full bg-[#F2F2F2]'
              disabled={clicked}
              onClick={() => {
                setOpen(null);
                setInfo(initialInfo);
              }}
            >
              Назад
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
