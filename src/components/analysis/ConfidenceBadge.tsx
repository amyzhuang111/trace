import { Badge } from "@/components/ui/badge";

export function HilbertConfidenceBadge({ pct }: { pct: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] text-muted" title="Hilbert confidence reflects model and evidence consistency.">
      <span className="h-1.5 w-1.5 rounded-full bg-accent" />
      Hilbert: <span className="font-medium text-foreground">{pct}%</span>
    </span>
  );
}

export function OperatorConfidenceBadge({ level }: { level: "Low" | "Medium" | "High" }) {
  const tone = level === "High" ? "success" : level === "Medium" ? "warning" : "neutral";
  return (
    <span className="inline-flex items-center gap-1.5 text-[11.5px] text-muted" title="Operator confidence reflects validation status and remaining unknowns.">
      Operator: <Badge tone={tone}>{level}</Badge>
    </span>
  );
}
