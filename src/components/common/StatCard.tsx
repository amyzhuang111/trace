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
    <Card className={cn("px-5 py-4", className)}>
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className={cn("mt-2 text-3xl font-semibold tabular-nums tracking-tight", toneClass)}>{value}</div>
      {sublabel && <div className="mt-1 text-[12px] text-muted-2">{sublabel}</div>}
    </Card>
  );
}
