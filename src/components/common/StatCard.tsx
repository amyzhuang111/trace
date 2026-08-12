import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function StatCard({
  label,
  value,
  sublabel,
  tone = "neutral",
  className,
}: {
  label: string;
  value: string;
  sublabel?: string;
  tone?: "neutral" | "success" | "warning" | "danger";
  className?: string;
}) {
  const toneClass =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : tone === "danger" ? "text-danger" : "text-foreground";
  return (
    <Card className={cn("px-4 py-3", className)}>
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className={cn("mt-1.5 text-2xl font-semibold tabular-nums", toneClass)}>{value}</div>
      {sublabel && <div className="mt-0.5 text-[12px] text-muted-2">{sublabel}</div>}
    </Card>
  );
}
