import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CohortDiff } from "@/types";

export function CohortComparison({ diff, explanation }: { diff: CohortDiff; explanation?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{diff.label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 flex items-center gap-2 text-[12px] text-muted">
          <span className="font-medium text-foreground">{diff.cohortB}</span>
          vs
          <span className="font-medium text-foreground">{diff.cohortA}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
          {diff.deltas.map((d) => (
            <div key={d.metric}>
              <div className="text-[10.5px] uppercase tracking-wide text-muted-2">{d.metric}</div>
              <div className={`mt-0.5 text-[14px] font-semibold tabular-nums ${d.value >= 0 ? "text-foreground" : "text-danger"}`}>
                {d.value > 0 ? "+" : ""}
                {d.value}
                {d.unit === "pp" ? " pp" : "%"}
              </div>
            </div>
          ))}
        </div>
        {explanation && (
          <p className="mt-4 border-t border-border/60 pt-3 text-[12.5px] leading-relaxed text-foreground">{explanation}</p>
        )}
      </CardContent>
    </Card>
  );
}
