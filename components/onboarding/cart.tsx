"use client";

import { forwardRef, useCallback, useState } from "react";
import Joyride, {
  CallBackProps,
  Step,
  TooltipRenderProps,
} from "react-joyride";
import { Button } from "../ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMainStore } from "@/providers/main-store-provider";
import { Onboarding } from "@/stores/main-store";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const pathnames = ["/cart", "/product"];

export function CartOnboarding() {
  const { onboarding, setOnboarding } = useMainStore((state) => state);
  const { cart, mounted } = onboarding;
  const pathname = usePathname();

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const steps = isDesktop ? desktopSteps : getMobileSteps;

  const handleCallback = (data: CallBackProps) => {
    if (data.action === "close") {
      setOnboarding((prev) => {
        const newInfo: Onboarding = { ...prev, cart: "true" };
        localStorage.setItem("onboarding", JSON.stringify(newInfo));
        return newInfo;
      });
    }
  };

  if (!mounted) return null;

  if (cart !== "show") return null;

  if (pathnames.some((path) => pathname.startsWith(path))) return null;

  return (
    <Joyride
      callback={handleCallback}
      steps={steps}
      disableCloseOnEsc={true}
      disableOverlayClose={true}
    />
  );
}

const TooltipComponent2 = forwardRef<
  HTMLDivElement,
  TooltipRenderProps & {
    isMobile?: boolean;
  }
>((props, ref) => {
  const [tooltipStep, setTooltipStep] = useState(1);
  const { primaryProps, isMobile } = props;

  const handleStepChange = useCallback(() => {
    setTooltipStep((prev) => prev + 1);
  }, []);

  if (!isMobile) {
    return (
      <div ref={ref} className='space-y-2 w-full flex flex-col'>
        <div
          className={cn(
            "w-full bg-background p-3 rounded-2xl rounded-br-none text-sm space-y-1 max-w-[340px]",
            tooltipStep === 1 ? "block" : "opacity-0"
          )}
        >
          <p className='font-medium'>Это корзина</p>
          <p>
            Она всегда у вас на виду — просто находите нужное и добавляйте в
            корзину
          </p>
        </div>
        <div
          className={cn(
            "w-full bg-background p-3 rounded-2xl rounded-br-none text-sm space-y-1 max-w-[340px]",
            tooltipStep === 2
              ? "block"
              : tooltipStep > 2
                ? "opacity-0"
                : "hidden"
          )}
        >
          <p className='font-medium'>Доставка безрецептурных лекарств</p>
          <p>Рецептурные препараты не доставляются. Можно оформить самовывоз</p>
        </div>
        <div
          className={cn(
            "w-full bg-background p-3 rounded-2xl rounded-br-none text-sm space-y-1 max-w-[340px]",
            tooltipStep === 3
              ? "block"
              : tooltipStep > 3
                ? "opacity-0"
                : "hidden"
          )}
        >
          <p className='font-medium'>Доставим в течение 1 часа</p>
          <p>
            • Круглосуточная доставка <br />• От 1000 рублей
          </p>
        </div>
        <div className='flex justify-end'>
          {tooltipStep === 3 ? (
            <Button
              className='text-xs rounded-full h-8 w-24 bg-white text-black hover:bg-accent'
              {...primaryProps}
            >
              Ок
            </Button>
          ) : (
            <Button
              className='text-xs rounded-full h-8 w-24 bg-white text-black hover:bg-accent'
              onClick={handleStepChange}
            >
              Далее
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className='relative'>
      <div className='space-y-2 absolute bottom-0 right-0 z-[1]'>
        <div className='flex justify-end'>
          {tooltipStep === 3 ? (
            <Button
              className='text-xs rounded-full h-8 w-24 bg-white text-black hover:bg-accent'
              {...primaryProps}
            >
              Ок
            </Button>
          ) : (
            <Button
              className='text-xs rounded-full h-8 w-24 bg-white text-black hover:bg-accent'
              onClick={handleStepChange}
            >
              Далее
            </Button>
          )}
        </div>
        <div
          className={cn(
            "bg-background p-3 rounded-2xl rounded-br-none text-sm space-y-1 max-w-[340px]",
            tooltipStep === 3 ? "block" : tooltipStep > 3 ? "hidden" : "hidden"
          )}
        >
          <p className='font-medium'>Доставим в течение 1 часа</p>
          <p>
            • Круглосуточная доставка <br />• От 1000 рублей
          </p>
        </div>
        <div
          className={cn(
            "bg-background p-3 rounded-2xl rounded-br-none text-sm space-y-1 max-w-[340px]",
            tooltipStep === 2 ? "block" : tooltipStep > 2 ? "hidden" : "hidden"
          )}
        >
          <p className='font-medium'>Доставка безрецептурных лекарств</p>
          <p>Рецептурные препараты не доставляются. Можно оформить самовывоз</p>
        </div>
        <div
          className={cn(
            "bg-background p-3 rounded-2xl rounded-br-none text-sm space-y-1 max-w-[340px]",
            tooltipStep === 1 ? "block" : tooltipStep > 1 ? "hidden" : "hidden"
          )}
        >
          <p className='font-medium'>Это корзина</p>
          <p>
            Она всегда у вас на виду — просто находите нужное и добавляйте в
            корзину
          </p>
        </div>
      </div>
      <ComponentForHeight />
    </div>
  );
});

TooltipComponent2.displayName = "TooltipComponent2";

const desktopSteps: Step[] = [
  {
    event: "click",
    target: ".cart-component",
    content: "",
    tooltipComponent: (props) => <TooltipComponent2 {...props} />,
    hideFooter: true,
    placement: "left-start",
    disableBeacon: true,
    spotlightPadding: 0,
    styles: {
      spotlight: {
        borderRadius: 20,
      },
    },
    floaterProps: {
      hideArrow: true,
    },
  },
];

const getMobileSteps: Step[] = [
  {
    event: "click",
    target: ".cart-component-mobile",
    content: "",
    tooltipComponent: (props) => (
      <TooltipComponent2 {...props} isMobile={true} />
    ),
    hideFooter: true,
    placement: "top-end",
    disableBeacon: true,
    spotlightPadding: 0,
    styles: {
      spotlight: {
        borderRadius: 9999,
      },
    },
    floaterProps: {
      hideArrow: true,
    },
  },
];

function ComponentForHeight() {
  return (
    <div className='space-y-2 opacity-0'>
      <div className='flex justify-end'>
        <Button className='text-xs rounded-full h-8 w-24 bg-white text-black hover:bg-accent'>
          Ок
        </Button>
      </div>
      <div className='bg-background p-3 rounded-2xl rounded-br-none text-sm space-y-1 max-w-[340px]'>
        <p className='font-medium'>Доставим в течение 1 часа</p>
        <p>
          • Круглосуточная доставка <br />• От 1000 рублей
        </p>
      </div>
      <div className='bg-background p-3 rounded-2xl rounded-br-none text-sm space-y-1 max-w-[340px]'>
        <p className='font-medium'>Доставка безрецептурных лекарств</p>
        <p>Рецептурные препараты не доставляются. Можно оформить самовывоз</p>
      </div>
      <div className='bg-background p-3 rounded-2xl rounded-br-none text-sm space-y-1 max-w-[340px]'>
        <p className='font-medium'>Это корзина</p>
        <p>
          Она всегда у вас на виду — просто находите нужное и добавляйте в
          корзину
        </p>
      </div>
    </div>
  );
}
