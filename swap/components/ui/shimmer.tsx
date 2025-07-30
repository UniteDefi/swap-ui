import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className }: ShimmerProps) {
  return (
    <div
      className={cn(
        "animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%]",
        className
      )}
    />
  );
}

export function ShimmerLoader({ className }: ShimmerProps) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Shimmer className="absolute inset-0" />
    </div>
  );
}