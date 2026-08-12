import { cn } from "@/lib/utils";

export function Progress({
  value,
  max = 1,
  className,
  barClassName,
  markers,
}: {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  markers?: { at: number; label?: string }[];
}) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className={cn("relative h-1.5 w-full rounded-full bg-black/[0.06]", className)}>
      <div
        className={cn("h-full rounded-full bg-accent transition-all", barClassName)}
        style={{ width: `${pct}%` }}
      />
      {markers?.map((m, i) => (
        <div
          key={i}
          className="absolute top-0 h-full w-px bg-foreground/30"
          style={{ left: `${(m.at / max) * 100}%` }}
          title={m.label}
        />
      ))}
    </div>
  );
}
