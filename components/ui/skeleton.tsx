import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        "bg-[#F2F2F2]",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
