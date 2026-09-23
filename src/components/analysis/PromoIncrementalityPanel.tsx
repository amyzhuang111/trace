import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PromoIncrementality } from "@/types";
import { formatSigned } from "@/lib/utils";

export function PromoIncrementalityPanel({ data }: { data: PromoIncrementality }) {
  const good = data.p180Contribution >= 0;
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.offer}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric label="Observed conversion lift" value={`+${data.observedConversionLift}%`} />
          <Metric label="Matched incremental conversion" value={`+${data.matchedIncrementalConversion}%`} tone="warning" />
          <Metric
            label="First-order margin"
            value={`${data.firstOrderMarginDelta < 0 ? "-" : "+"}$${Math.abs(data.firstOrderMarginDelta).toFixed(2)}`}
            tone="danger"
          />
          <Metric label="90-day repeat" value={`${formatSigned(data.repeat90dDelta)} pp`} tone={data.repeat90dDelta >= 0 ? "success" : "danger"} />
        </div>
        <div className="mt-4 flex items-center justify-between rounded-md border border-border/60 bg-black/[0.015] px-3 py-2.5">
          <span className="text-[12px] text-muted">Estimated p180 contribution / acquired customer</span>
          <span className={`text-[15px] font-semibold tabular-nums ${good ? "text-success" : "text-danger"}`}>
            {data.p180Contribution < 0 ? "-" : "+"}${Math.abs(data.p180Contribution).toFixed(2)} / customer
          </span>
        </div>
        <p className="mt-2.5 text-[12.5px] text-foreground">
          {good ? "Positive long-term economics." : "Good short-term conversion; negative long-term economics for broad targeting."}
        </p>
      </CardContent>
    </Card>
  );
}

function Metric({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "neutral" | "warning" | "danger" | "success";
}) {
  const toneClass =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : tone === "danger" ? "text-danger" : "text-foreground";
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-wide text-muted-2">{label}</div>
      <div className={`mt-1 text-[16px] font-semibold tabular-nums ${toneClass}`}>{value}</div>
    </div>
  );
}
