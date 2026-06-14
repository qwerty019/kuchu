"use client"; // Error components must be Client Components

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className='w-full bg-background rounded-lg p-4 space-y-6'>
      <div>
        <h1 className='scroll-m-20 text-3xl font-extrabold tracking-tight'>
          Что-то пошло не так!
        </h1>
        <p className='text-muted-foreground text-sm'>
          Нажмите, чтобы обновить страницу
        </p>
      </div>
      <Button onClick={() => reset()}>Попробовать снова</Button>
    </main>
  );
}
