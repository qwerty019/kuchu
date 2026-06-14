import { useCartStore } from "@/providers/cart-store-provider";
import { useMainStore } from "@/providers/main-store-provider";
import { Button } from "../../ui/button";
import { useState } from "react";
import { newOrder } from "../actions";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { parsePhoneNumber } from "libphonenumber-js/mobile";
import { Info } from "../definitions";
import { isWithinDateRange } from "@/lib/utils";

export function PriceInfo({ info }: { info: Info }) {
  const { items } = useCartStore((state) => state);
  const { method, addresses, zones } = useMainStore((state) => state);

  const sum = items
    .filter((x) => !x.disabled)
    .reduce((t, ci) => {
      const item = ci.qnts?.reduce((ip, qi) => ip + qi.price * qi.added, 0);
      return t + item;
    }, 0);
  const rightSum = parseFloat(sum.toFixed(2));

  const address = addresses?.find((a) => a.selected);
  const zone = zones?.find((z) => z.id === address?.zoneId);
  const delivery = zone?.price || 0;
  const freeDelivery = zone?.freeDelivery || 0;
  const threshold = zone?.threshold || 0;

  const percent = info.promoPercent ? sum * (info.promoPercent / 100) : 0;
  const distract = percent
    ? parseFloat(percent.toFixed(2))
    : info.promoAmount
      ? info.promoAmount
      : 0;

  const isFreeDelivery = rightSum >= freeDelivery;
  const untilThreshold = parseFloat((threshold - rightSum).toFixed(2));

  const deliverySum = method === "pickup" ? 0 : isFreeDelivery ? 0 : delivery;
  const allSum =
    distract > rightSum
      ? 0
      : parseFloat((sum + deliverySum - distract).toFixed(2));

  return (
    <div className='space-y-2 text-xs mt-auto'>
      {/* {method === "delivery" && (
        <div className='flex justify-between'>
          <p>Доставка</p>
          <p>{isFreeDelivery ? 0 : delivery} ₽</p>
        </div>
      )} */}
      {method === "delivery" && (
        <div className='flex justify-between'>
          <p>Стоимость товара</p>
          <p>{rightSum} ₽</p>
        </div>
      )}
      {distract > 0 && (
        <div className='flex justify-between'>
          <p>Скидка</p>
          <p>-{distract} ₽</p>
        </div>
      )}
      <div className='flex justify-between'>
        <p className='font-semibold text-lg'>Итого</p>
        <p className='font-semibold text-lg'>{allSum} ₽</p>
      </div>
    </div>
  );
}

export function MainButton({
  info,
  step,
  setStep,
}: {
  info: Info;
  step: number;
  setStep: (step: number) => void;
}) {
  const [clicked, setClicked] = useState(false);
  const [message, setMessage] = useState<string>("");

  const { items, loading, removeAllCartItems } = useCartStore((state) => state);
  const {
    method,
    addresses,
    zones,
    branch,
    setOrders,
    setOrderIndex,
    setShowDialog,
  } = useMainStore((state) => state);
  const router = useRouter();

  const sum = items
    .filter((x) => !x.disabled)
    .reduce((t, ci) => {
      const item = ci.qnts?.reduce((ip, qi) => ip + qi.price * qi.added, 0);
      return t + item;
    }, 0);
  const rightSum = parseFloat(sum.toFixed(2));

  const address = addresses?.find((a) => a.selected);
  const zone = zones?.find((z) => z.id === address?.zoneId);
  const delivery = zones?.find((z) => z.id === address?.zoneId)?.price || 0;
  const freeDelivery =
    zones?.find((z) => z.id === address?.zoneId)?.freeDelivery || 0;
  const threshold =
    zones?.find((z) => z.id === address?.zoneId)?.threshold || 0;

  const percent = info.promoPercent ? sum * (info.promoPercent / 100) : 0;
  const distract = percent
    ? parseFloat(percent.toFixed(2))
    : info.promoAmount
      ? info.promoAmount
      : 0;

  const isFreeDelivery = rightSum >= freeDelivery;
  const untilThreshold = parseFloat((threshold - rightSum).toFixed(2));

  const deliverySum = isFreeDelivery ? 0 : delivery;
  const allSum =
    distract > rightSum
      ? 0
      : parseFloat((sum + deliverySum - distract).toFixed(2));

  const handleOrder = async () => {
    setMessage("");

    if (method === "delivery" && (!address || !zone)) {
      setMessage("Необходимо выбрать адрес доставки.");
      return;
    }

    if (!items.filter((x) => !x.disabled).length) {
      setMessage("Добавьте товары в корзину.");
      return;
    }

    if (items.some((x) => x.disabled)) {
      setMessage("Удалите недоступные товары из корзины.");
      return;
    }

    if (info.value === "someone") {
      try {
        const parsed = parsePhoneNumber(info.contact, "RU");

        if (parsed.country !== "RU" || !parsed.isValid()) {
          setMessage("Некорректный номер телефона.");
          return;
        }
      } catch (err) {
        setMessage("Некорректный номер телефона.");
        return;
      }
    }

    if (method === "delivery") {
      if (info.payment === "cash" && !info.banknote) {
        setMessage("Необходимо указать с какой купюры подготовить сдачу.");
        return;
      }

      if (info.payment === "cash" && !isValidBanknote(info.banknote)) {
        setMessage(
          "Некорректная сумма купюры. Доступные суммы: 100, 200, 500, 1000, 2000, 5000."
        );
        return;
      }
    }

    setClicked(true);

    const action = await newOrder(items, info, method, branch);
    if (action?.message) {
      setMessage(action.message);
      setClicked(false);
      return;
    }

    if (action?.success) {
      setClicked(false);
      removeAllCartItems();

      setOrders(action.orders);
      setOrderIndex(action.orders.length - 1);
      setShowDialog(true);
      router.replace("/");
    }

    if (action?.token) {
      removeAllCartItems();
      if (typeof window !== "undefined") {
        // Use window.location for a full page navigation instead of router.push
        window.location.href = `/payment?token=${action.token}&orderId=${action.orderId}`;
        return; // Prevent further execution
      } else {
        router.push(`/payment?token=${action.token}&orderId=${action.orderId}`);
      }
    }
  };

  // Example usage: 6 Feb 2026 00:00:00 to 7 Feb 2026 23:59:59 in +09:00 timezone
  const isDisabledFeb = isWithinDateRange({
    start: new Date(Date.UTC(2026, 1, 6, 0, 0, 0)), // Months are 0-indexed, so 1 is February
    end: new Date(Date.UTC(2026, 1, 7, 23, 59, 59)),
    timezoneOffset: 9,
  });

  if (isDisabledFeb) {
    return (
      <div className='space-y-2'>
        <Button
          className='w-full rounded-full bg-white hover:bg-white/80 text-[#A03968] p-6 text-xs'
          disabled
        >
          Временно недоступно
        </Button>
      </div>
    );
  }

  if (loading || clicked) {
    return (
      <div className='space-y-2'>
        <Button
          className='w-full rounded-full bg-white hover:bg-white/80 text-[#A03968] p-6 text-xs'
          disabled
        >
          <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Подождите...
        </Button>
        {message && <p className='text-white text-xs text-center'>{message}</p>}
      </div>
    );
  }

  if (items.length === 0 || allSum <= 0) {
    return (
      <div className='space-y-2'>
        <Button
          className='w-full rounded-full bg-white hover:bg-white/80 text-[#A03968] p-6 text-xs'
          disabled
        >
          Добавьте товары в корзину
        </Button>
        {message && <p className='text-white text-xs text-center'>{message}</p>}
      </div>
    );
  }

  if (method === "delivery" && untilThreshold > 0) {
    return (
      <div className='space-y-2'>
        <Button
          className='w-full rounded-full bg-white hover:bg-white/80 text-[#A03968] p-6 text-xs'
          disabled
        >
          Доберите еще {untilThreshold}₽
        </Button>
        {message && <p className='text-white text-xs text-center'>{message}</p>}
        <p className='text-white text-xs text-center'>
          Минимальный заказ на доставку без учета стоимости доставки - от{" "}
          {threshold} ₽
        </p>
      </div>
    );
  }

  if (step !== 2) {
    return (
      <div className='space-y-2'>
        <Button
          className='w-full rounded-full bg-white hover:bg-white/80 text-[#A03968] p-6 text-xs'
          onClick={() => setStep(step + 1)}
        >
          {step === 0 ? "Продолжить" : "Перейти к оформлению"}
        </Button>
        {message && <p className='text-white text-xs text-center'>{message}</p>}
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      <Button
        className='w-full rounded-full bg-white hover:bg-white/80 text-[#A03968] p-6 text-xs'
        onClick={handleOrder}
      >
        {info.payment === "card" ? "Оплатить" : "Оформить"}
      </Button>
      {message && <p className='text-white text-xs text-center'>{message}</p>}
    </div>
  );
}

export function MainButtonMobile({
  info,
  step,
  setStep,
}: {
  info: Info;
  step: number;
  setStep: (step: number) => void;
}) {
  const [clicked, setClicked] = useState(false);
  const [message, setMessage] = useState<string>("");

  const { items, loading, removeAllCartItems } = useCartStore((state) => state);
  const {
    method,
    addresses,
    zones,
    branch,
    setOrders,
    setOrderIndex,
    setShowDialog,
  } = useMainStore((state) => state);
  const router = useRouter();

  const sum = items
    .filter((x) => !x.disabled)
    .reduce((t, ci) => {
      const item = ci.qnts?.reduce((ip, qi) => ip + qi.price * qi.added, 0);
      return t + item;
    }, 0);
  const rightSum = parseFloat(sum.toFixed(2));

  const address = addresses?.find((a) => a.selected);
  const zone = zones?.find((z) => z.id === address?.zoneId);
  const delivery = zones?.find((z) => z.id === address?.zoneId)?.price || 0;
  const freeDelivery =
    zones?.find((z) => z.id === address?.zoneId)?.freeDelivery || 0;
  const threshold =
    zones?.find((z) => z.id === address?.zoneId)?.threshold || 0;

  const percent = info.promoPercent ? sum * (info.promoPercent / 100) : 0;
  const distract = percent
    ? parseFloat(percent.toFixed(2))
    : info.promoAmount
      ? info.promoAmount
      : 0;

  const isFreeDelivery = rightSum >= freeDelivery;
  const untilThreshold = parseFloat((threshold - rightSum).toFixed(2));

  const deliverySum = isFreeDelivery ? 0 : delivery;
  const allSum =
    distract > rightSum
      ? 0
      : parseFloat((sum + deliverySum - distract).toFixed(2));

  const handleOrder = async () => {
    setMessage("");

    if (method === "delivery" && (!address || !zone)) {
      setMessage("Необходимо выбрать адрес доставки.");
      return;
    }

    if (!items.filter((x) => !x.disabled).length) {
      setMessage("Добавьте товары в корзину.");
      return;
    }

    if (items.some((x) => x.disabled)) {
      setMessage("Удалите недоступные товары из корзины.");
      return;
    }

    if (info.value === "someone") {
      try {
        const parsed = parsePhoneNumber(info.contact, "RU");

        if (parsed.country !== "RU" || !parsed.isValid()) {
          setMessage("Некорректный номер телефона.");
          return;
        }
      } catch (err) {
        setMessage("Некорректный номер телефона.");
        return;
      }
    }

    if (method === "delivery") {
      if (info.payment === "cash" && !info.banknote) {
        setMessage("Необходимо указать с какой купюры подготовить сдачу.");
        return;
      }

      if (
        info.payment === "cash" &&
        method === "delivery" &&
        !isValidBanknote(info.banknote)
      ) {
        setMessage(
          "Некорректная сумма купюры. Доступные суммы: 100, 200, 500, 1000, 2000, 5000."
        );
        return;
      }
    }

    setClicked(true);

    const action = await newOrder(items, info, method, branch);
    if (action?.message) {
      setMessage(action.message);
      setClicked(false);
      return;
    }

    if (action?.success) {
      setClicked(false);
      removeAllCartItems();

      setOrders(action.orders);
      setOrderIndex(action.orders.length - 1);
      setShowDialog(true);
      router.replace("/");
    }

    if (action?.token) {
      removeAllCartItems();
      if (typeof window !== "undefined") {
        // Use window.location for a full page navigation instead of router.push
        window.location.href = `/payment?token=${action.token}&orderId=${action.orderId}`;
        return; // Prevent further execution
      } else {
        router.push(`/payment?token=${action.token}&orderId=${action.orderId}`);
      }
    }
  };

  if (loading || clicked) {
    return (
      <div className='space-y-2'>
        <Button
          className='w-full rounded-full bg-[#A03968] hover:bg-[#A03968] p-6 text-xs'
          disabled
        >
          <Loader2 className='w-4 h-4 mr-2 animate-spin' /> Подождите...
        </Button>
        {message && <p className='text-white text-xs text-center'>{message}</p>}
      </div>
    );
  }

  if (items.length === 0 || allSum <= 0) {
    return (
      <div className='space-y-2'>
        <Button
          className='w-full rounded-full bg-[#A03968] hover:bg-[#A03968] p-6 text-xs'
          disabled
        >
          Добавьте товары в корзину
        </Button>
        {message && <p className='text-white text-xs text-center'>{message}</p>}
      </div>
    );
  }

  if (method === "delivery" && untilThreshold > 0) {
    return (
      <div className='space-y-2'>
        <Button
          className='w-full rounded-full bg-[#A03968] hover:bg-[#A03968] p-6 text-xs'
          disabled
        >
          Доберите еще {untilThreshold}₽
        </Button>
        {message && <p className='text-white text-xs text-center'>{message}</p>}
        <p className='text-white text-xs text-center'>
          Минимальный заказ на доставку без учета стоимости доставки - от{" "}
          {threshold} ₽
        </p>
      </div>
    );
  }

  if (step === 0) {
    return (
      <div className='space-y-2'>
        <Button
          className='w-full rounded-full bg-[#A03968] hover:bg-[#A03968] p-6 text-xs'
          onClick={() => setStep(2)}
        >
          Продолжить
        </Button>
        {message && <p className='text-white text-xs text-center'>{message}</p>}
      </div>
    );
  }

  if (step !== 2) {
    return (
      <div className='space-y-2'>
        <Button
          className='w-full rounded-full bg-[#A03968] hover:bg-[#A03968] p-6 text-xs'
          onClick={() => setStep(2)}
        >
          Перейти к оформлению
        </Button>
        {message && <p className='text-white text-xs text-center'>{message}</p>}
      </div>
    );
  }

  return (
    <div className='space-y-2'>
      <Button
        className='w-full rounded-full bg-[#A03968] hover:bg-[#A03968] p-6 text-xs'
        onClick={handleOrder}
      >
        {info.payment === "card" ? "Оплатить" : "Оформить"}
      </Button>
      {message && <p className='text-white text-xs text-center'>{message}</p>}
    </div>
  );
}

const isValidBanknote = (value: string) => {
  const num = Number(value);
  const validBanknotes = [100, 200, 500, 1000, 2000, 5000];
  return Number.isInteger(num) && validBanknotes.includes(num);
};
