"use client";

import { useRef, useState, useEffect, ReactNode } from "react";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HorizontalScrollProps {
  children: ReactNode;
}

export default function HorizontalScroll({ children }: HorizontalScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const [hasOverflow, setHasOverflow] = useState(false);

  // Scroll function
  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  // Check if content overflows container
  const checkOverflow = () => {
    if (scrollRef.current) {
      const hasHorizontalOverflow =
        scrollRef.current.scrollWidth > scrollRef.current.clientWidth;
      setHasOverflow(hasHorizontalOverflow);
      setShowRight(hasHorizontalOverflow);
    }
  };

  // Handle scroll event to update button visibility
  const handleScroll = () => {
    if (scrollRef.current) {
      setShowLeft(scrollRef.current.scrollLeft > 0);
      setShowRight(
        scrollRef.current.scrollLeft + scrollRef.current.clientWidth <
          scrollRef.current.scrollWidth
      );
    }
  };

  // Check overflow on mount and when children change
  useEffect(() => {
    checkOverflow();
    const element = scrollRef.current;
    const resizeObserver = new ResizeObserver(() => {
      checkOverflow();
      handleScroll();
    });

    if (element) {
      resizeObserver.observe(element);
    }

    return () => {
      if (element) {
        resizeObserver.unobserve(element);
      }
      resizeObserver.disconnect();
    };
  }, [children]);

  // Attach scroll event listener
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", handleScroll);
      return () => el.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Handle mouse wheel scrolling
  useEffect(() => {
    const el = scrollRef.current;
    const handleWheelScroll = (e: WheelEvent) => {
      if (el) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY, behavior: "smooth" });
      }
    };
    if (el) {
      el.addEventListener("wheel", handleWheelScroll);
      return () => el.removeEventListener("wheel", handleWheelScroll);
    }
  }, []);

  return (
    <div className='relative w-full mx-auto'>
      {hasOverflow && showLeft && (
        <Button
          type='button'
          variant='outline'
          className='absolute left-0 top-1/2 -translate-y-1/2 rounded-full p-0 h-8 w-8 z-10'
          onClick={() => scroll(-150)}
        >
          <ChevronLeft className='w-4 h-4' />
        </Button>
      )}
      <div
        ref={scrollRef}
        className={`flex overflow-x-auto scrollbar-hide scroll-smooth space-x-2 transition-all`}
      >
        {children}
      </div>
      {hasOverflow && showRight && (
        <Button
          type='button'
          variant='outline'
          className='absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-0 h-8 w-8 z-10'
          onClick={() => scroll(150)}
        >
          <ChevronRight className='w-4 h-4' />
        </Button>
      )}
    </div>
  );
}
