import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatSigned } from "@/lib/utils";

interface Props {
  nominalGrowthPct: number;
  priceEffectPP: number;
  volumeFrequencyEffectPP: number;
  customerBaseEffectPP: number;
  conclusion: string;
}

export function BehaviorVsPriceDecomposition({
  nominalGrowthPct,
  priceEffectPP,
  volumeFrequencyEffectPP,
  customerBaseEffectPP,
  conclusion,
}: Props) {
  const rows = [
    { label: "Nominal growth", value: nominalGrowthPct, tone: "neutral" as const },
    { label: "Price effect", value: priceEffectPP, tone: "positive" as const },
    { label: "Volume / frequency effect", value: volumeFrequencyEffectPP, tone: volumeFrequencyEffectPP >= 0 ? ("positive" as const) : ("negative" as const) },
    { label: "Customer-base effect", value: customerBaseEffectPP, tone: "positive" as const },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Real cohort effect vs. pricing artifact</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {rows.map((r) => (
            <div key={r.label}>
              <div className="text-[10.5px] uppercase tracking-wide text-muted-2">{r.label}</div>
              <div
                className={`mt-1 text-xl font-semibold tabular-nums ${
                  r.tone === "positive" ? "text-success" : r.tone === "negative" ? "text-danger" : "text-foreground"
                }`}
              >
                {r.label === "Nominal growth" ? `${formatSigned(r.value)}%` : `${formatSigned(r.value)} pp`}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 border-t border-border/60 pt-3 text-[13px] leading-relaxed text-foreground">{conclusion}</p>
      </CardContent>
    </Card>
  );
}
