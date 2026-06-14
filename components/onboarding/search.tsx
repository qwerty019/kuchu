"use client";

import { forwardRef } from "react";
import Joyride, {
  CallBackProps,
  Step,
  TooltipRenderProps,
} from "react-joyride";
import { Button } from "../ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useMainStore } from "@/providers/main-store-provider";
import { Onboarding } from "@/stores/main-store";

export function SearchOnboarding() {
  const { onboarding, setOnboarding } = useMainStore((state) => state);
  const { search, mounted } = onboarding;

  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const steps = isDesktop ? [desktopStep] : [mobileStep];

  const handleCallback = (data: CallBackProps) => {
    if (data.action === "close") {
      setOnboarding((prev) => {
        const newInfo: Onboarding = { ...prev, search: "true" };
        localStorage.setItem("onboarding", JSON.stringify(newInfo));
        return newInfo;
      });
    }
  };

  if (!mounted) return null;

  if (search !== "show") return null;

  return (
    <Joyride
      callback={handleCallback}
      steps={steps}
      disableCloseOnEsc={true}
      disableOverlayClose={true}
    />
  );
}

const TooltipComponent = forwardRef<HTMLDivElement, TooltipRenderProps>(
  (props, ref) => {
    const { primaryProps } = props;

    return (
      <div ref={ref} className='space-y-2'>
        <div className='bg-background p-3 rounded-2xl rounded-tl-none text-sm space-y-1 max-w-[340px]'>
          <p className='font-medium'>Это наш поиск</p>
          <p>
            Он работает: <br />• по наименованиям <br />• по симптомам
          </p>
        </div>
        <Button
          className='text-xs rounded-full h-8 w-24 bg-white text-black hover:bg-accent'
          {...primaryProps}
        >
          Ок
        </Button>
      </div>
    );
  }
);

TooltipComponent.displayName = "TooltipComponent";

const desktopStep: Step = {
  event: "click",
  target: ".search-component",
  content: "",
  tooltipComponent: TooltipComponent,
  hideFooter: true,
  placement: "bottom-start",
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
};

const mobileStep: Step = {
  event: "click",
  target: ".search-component",
  content: "",
  tooltipComponent: TooltipComponent,
  hideFooter: true,
  placement: "bottom-start",
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
};
