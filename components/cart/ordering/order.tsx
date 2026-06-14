"use client";

import { ChevronRight, Clock4 } from "lucide-react";
import { Button } from "../../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { useMainStore } from "@/providers/main-store-provider";
import { User } from "@/lib/auth";
import { getPrevBranch } from "../actions";
import { setCookie } from "@/lib/actions";
import { InputMask } from "@react-input/mask";
import { useCartStore } from "@/providers/cart-store-provider";
import { Info } from "../definitions";
import { Choose } from "@/components/right-side/modal/choose";
import { showAddInfo } from "@/lib/utils";
import { CartItemState } from "@/stores/cart-store";
import { BranchWithCity } from "@/lib/db/branch/schema";
import CheckItemsDialog from "@/components/product/check-items-dialog";

const buttons = [
  { value: "pickup", text: "Самовывоз" },
  { value: "delivery", text: "Доставка" },
  { value: "someone", text: "Заказать другому" },
];

export default function Order({
  setInfo,
  info,
  user,
  slots,
}: {
  setInfo: React.Dispatch<React.SetStateAction<Info>>;
  info: Info;
  user: User | null;
  slots: { label: string; value: string; desc: string | undefined }[];
}) {
  const [clicked, setClicked] = useState<string | null>(null);
  const [list, setList] = useState<CartItemState[]>([]);
  const [checkInfo, setCheckInfo] = useState<{
    branchId: number;
    method: string;
    name: string | null;
    value: string;
  } | null>(null);
  const { method, setMethod, setBranch, addresses, branch, branches, zones } =
    useMainStore((state) => state);
  const { items, setLastShown } = useCartStore((state) => state);

  const sum = items
    .filter((x) => !x.disabled)
    .reduce((t, ci) => {
      const item = ci.qnts?.reduce((ip, qi) => ip + qi.price * qi.added, 0);
      return t + item;
    }, 0);
  const rightSum = parseFloat(sum.toFixed(2));

  const address = addresses.find((a) => a.selected);
  const zone = zones?.find((z) => z.id === address?.zoneId);
  const price =
    rightSum >= (zone?.freeDelivery || 0)
      ? "0 ₽"
      : zone?.price
        ? `${zone?.price} ₽`
        : "249 - 299 ₽";

  const changeMethod = async (val: string) => {
    // Find the main branch
    const main = branches.find((b) => b.main);
    if (!main) return;

    // Skip if already selected
    if (val === info.value) return;

    if (clicked) return;

    setClicked(val);

    let branchId = main.id;

    if (val === "pickup") {
      const prev = await getPrevBranch();
      if (prev) branchId = Number(prev);
    }

    const data = await checkItems(
      branchId,
      val === "pickup" ? "pickup" : "delivery"
    );

    if (data?.some((x) => x.comment)) {
      setList(data);
      setCheckInfo({
        branchId: branchId,
        method: val === "pickup" ? "pickup" : "delivery",
        name: val !== "pickup" ? address?.address || null : null,
        value: val,
      });
      setClicked(null);
      return;
    }

    // Handle each method type
    switch (val) {
      case "pickup":
        await handlePickupMethod(main);
        break;

      case "delivery":
        await handleDeliveryMethod(main);
        break;

      case "someone":
        await handleSomeoneMethod(main);
        break;
    }

    setClicked(null);
  };

  // Helper functions to handle each method type
  const handlePickupMethod = async (mainBranch: BranchWithCity) => {
    // Try to use previous branch or fallback to main branch
    const prev = await getPrevBranch();
    const branchToUse = prev || mainBranch.id.toString();

    // Update state and cookies
    setBranch(branchToUse);
    await setCookie("branch", branchToUse);
    await setCookie("method", "pickup");
    setMethod("pickup");
    setInfo((prev) => ({ ...prev, value: "pickup" }));
  };

  const handleDeliveryMethod = async (mainBranch: BranchWithCity) => {
    // Special case: switching from "someone" to "delivery"
    if (info.value === "someone") {
      setInfo((prev) => ({ ...prev, value: "delivery" }));
      return;
    }

    // Save current branch if not already in delivery mode
    if (branch && method !== "delivery") {
      await setCookie("prevBranch", branch);
    }

    // Update state and cookies
    await setCookie("method", "delivery");
    await setCookie("branch", mainBranch.id.toString());
    setBranch(mainBranch.id.toString());
    setMethod("delivery");
    setInfo((prev) => ({ ...prev, value: "delivery" }));
  };

  const handleSomeoneMethod = async (mainBranch: BranchWithCity) => {
    // First set up delivery infrastructure if not already in delivery mode
    if (method !== "delivery") {
      if (branch) {
        await setCookie("prevBranch", branch);
      }
      await setCookie("method", "delivery");
      await setCookie("branch", mainBranch.id.toString());
      setBranch(mainBranch.id.toString());
      setMethod("delivery");
    }

    // Then set the "someone" value
    setInfo((prev) => ({ ...prev, value: "someone" }));
  };

  const checkItems = async (branchId: number, method: string) => {
    try {
      const res = await fetch("/api/cart/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, branch: branchId, method }),
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

  return (
    <section className='flex flex-col gap-4 bg-background rounded-2xl p-4 w-full'>
      <div className='space-y-2'>
        <p className='font-semibold text-lg'>Условия получения</p>
        <div className='flex gap-2 overflow-x-auto scrollbar-hide -mr-4'>
          {buttons.map((b, i) => (
            <Button
              key={i}
              variant={info.value === b.value ? "default" : "secondary"}
              className={`flex-col gap-1 text-xs items-start font-normal h-auto rounded-2xl ${
                info.value === b.value ? "bg-[#404040]" : "bg-[#F2F2F2]"
              }`}
              onClick={() => changeMethod(b.value)}
            >
              <p className='font-semibold'>{b.text}</p>
              <p>
                {clicked === b.value
                  ? "Загрузка..."
                  : b.value !== "pickup"
                    ? price
                    : "0 ₽"}
              </p>
            </Button>
          ))}
        </div>
      </div>
      <DeliveryMethod user={user} />
      {method !== "pickup" && (
        <div className='space-y-2 md:max-w-[372px]'>
          <p className='font-semibold text-lg'>Время доставки</p>
          <div className='flex gap-2 overflow-x-auto scrollbar-hide -mx-4 px-4'>
            <Button
              variant={info.interval === "asap" ? "default" : "secondary"}
              className={`rounded-full text-xs ${
                info.interval === "asap" ? "bg-[#404040]" : "bg-[#F2F2F2]"
              }`}
              onClick={() =>
                setInfo({
                  ...info,
                  interval: "asap",
                  time: slots[0].value,
                  date: slots[0].desc === "Завтра" ? "tomorrow" : "today",
                })
              }
            >
              Побыстрее
            </Button>
            <Button
              variant={info.interval === "first" ? "default" : "secondary"}
              className={`rounded-full text-xs ${
                info.interval === "first" ? "bg-[#404040]" : "bg-[#F2F2F2]"
              }`}
              onClick={() =>
                setInfo({
                  ...info,
                  interval: "first",
                  time: slots[1].value,
                  date: slots[1].desc === "Завтра" ? "tomorrow" : "today",
                })
              }
            >
              {slots[1].label}
            </Button>
            <Button
              variant={info.interval === "second" ? "default" : "secondary"}
              className={`rounded-full text-xs ${
                info.interval === "second" ? "bg-[#404040]" : "bg-[#F2F2F2]"
              }`}
              onClick={() =>
                setInfo({
                  ...info,
                  interval: "second",
                  time: slots[2].value,
                  date: slots[2].desc === "Завтра" ? "tomorrow" : "today",
                })
              }
            >
              {slots[2].label}
            </Button>
            <Button
              variant={info.interval === "other" ? "default" : "secondary"}
              className={`rounded-full text-xs mr-4 ${
                info.interval === "other" ? "bg-[#404040]" : "bg-[#F2F2F2]"
              }`}
              onClick={() => setInfo({ ...info, interval: "other" })}
            >
              Другое
            </Button>
          </div>
          {info.interval === "other" && (
            <div className='relative w-full'>
              <Clock4 className='w-4 h-4 absolute top-1/2 left-4 transform -translate-y-1/2 text-muted-foreground' />
              <Select
                value={info.time}
                onValueChange={(v) =>
                  setInfo({
                    ...info,
                    time: v,
                    interval: "other",
                    date:
                      slots.find((s) => s.value === v)?.desc === "Завтра"
                        ? "tomorrow"
                        : "today",
                  })
                }
              >
                <SelectTrigger className='w-full rounded-full pl-10 h-10 bg-[#F2F2F2] border-none [&>span]:w-full text-left'>
                  <SelectValue placeholder='Выберите время доставки'>
                    {info.time}
                    {info.date === "tomorrow" ? (
                      <span className='text-muted-foreground'>
                        {" · Завтра"}
                      </span>
                    ) : null}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className='max-h-[200px] overflow-y-auto'>
                  {slots?.map((s) => (
                    <SelectItem
                      key={s.label}
                      value={s.value}
                      className='hover:bg-muted cursor-pointer'
                    >
                      <div className='flex flex-col w-full'>
                        <p className='w-full'>{s.label}</p>
                        {s.desc && (
                          <p className='select-desc text-xs text-muted-foreground'>
                            {s.desc}
                          </p>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
      {info.value === "someone" && (
        <div className='space-y-2'>
          <p className='font-semibold text-lg'>Контакты получателя</p>
          <InputMask
            mask='+7 (___) ___-__-__'
            replacement={{ _: /\d/ }}
            className='px-4 py-3 w-full border-none bg-[#F2F2F2] text-sm rounded-full h-auto focus-visible:ring-0 focus:outline-none'
            value={info.contact}
            onChange={(e) => {
              setInfo((prev) => ({ ...prev, contact: e.target.value }));
            }}
            placeholder='+7 (___) ___-__-__'
          />
        </div>
      )}
      {checkInfo && (
        <CheckItemsDialog
          open={checkInfo ? true : false}
          setOpen={() => setCheckInfo(null)}
          list={list}
          setList={setList}
          branch={checkInfo.branchId}
          method={checkInfo.method}
          name={checkInfo.name}
          onSuccess={() => {
            setLastShown(Date.now());
            setCheckInfo(null);
            setInfo((prev) => ({ ...prev, value: checkInfo.value }));
          }}
        />
      )}
    </section>
  );
}

function DeliveryMethod({ user }: { user: User | null }) {
  const [open, setOpen] = useState(false);
  const { method, branch, branches, addresses } = useMainStore(
    (state) => state
  );

  const address = useMemo(() => addresses.find((a) => a.selected), [addresses]);

  const br = useMemo(
    () => branches.find((b) => b.id === Number(branch)),
    [branches, branch]
  );

  if (method === "pickup") {
    return (
      <>
        <Button
          variant='secondary'
          className='w-full truncate rounded-2xl h-auto items-center justify-between bg-[#F2F2F2] gap-2 text-left p-3'
          onClick={() => setOpen(true)}
        >
          <div className='truncate'>
            <p className='truncate'>{br?.title || "Филиал"}</p>
            <p className='text-xs truncate text-muted-foreground'>
              {br?.city?.title || "Город"}
            </p>
          </div>
          <ChevronRight className='w-4 h-4 shrink-0' />
        </Button>
        {open && (
          <Choose
            open={open}
            setOpen={setOpen}
            user={user}
            initialType='branch'
          />
        )}
      </>
    );
  }

  return (
    <>
      <Button
        variant='secondary'
        className='w-full truncate rounded-2xl h-[60px] items-center bg-[#F2F2F2] justify-between gap-2 text-left p-3'
        onClick={() => setOpen(true)}
      >
        <div className='truncate'>
          <p className='truncate'>{address?.address || "Адрес"}</p>
          {address && (
            <p className='text-xs text-muted-foreground truncate'>
              {showAddInfo(address)}
            </p>
          )}
        </div>
        <ChevronRight className='w-4 h-4 shrink-0' />
      </Button>
      {open && (
        <Choose
          open={open}
          setOpen={setOpen}
          user={user}
          initialType='delivery'
        />
      )}
    </>
  );
}
