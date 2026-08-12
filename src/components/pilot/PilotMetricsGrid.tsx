import { PilotMetric } from "@/types";
import { Badge } from "@/components/ui/badge";

const CATEGORY_LABEL: Record<PilotMetric["category"], string> = {
  business: "Business",
  quality: "Agent Quality",
  trust: "Human Trust",
  operational: "Operational",
  safety: "Safety",
};

const CATEGORIES: PilotMetric["category"][] = ["business", "quality", "trust", "operational", "safety"];

export function PilotMetricsGrid({ metrics }: { metrics: PilotMetric[] }) {
  return (
    <div className="grid grid-cols-5 gap-4">
      {CATEGORIES.map((cat) => (
        <div key={cat}>
          <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-muted">{CATEGORY_LABEL[cat]}</div>
          <ul className="space-y-1.5">
            {metrics
              .filter((m) => m.category === cat)
              .map((m) => (
                <li key={m.id} className="rounded-md border border-border bg-surface px-2.5 py-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[12px] font-medium text-foreground">{m.label}</span>
                    <Badge tone={m.status === "tracking" ? "accent" : "neutral"}>
                      {m.status === "tracking" ? "tracking" : "not started"}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-[11.5px] text-muted">Target: {m.target}</p>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
