import { OpportunityCandidate, OpportunityScore } from "@/types";
import { Badge } from "@/components/ui/badge";

const DIMENSION_LABELS: Record<keyof OpportunityScore, string> = {
  businessValue: "Business Value",
  aiSuitability: "AI Suitability",
  dataReadiness: "Data Readiness",
  executionFeasibility: "Execution Feasibility",
  evaluationReadiness: "Evaluation Readiness",
  deploymentSafety: "Deployment Safety",
  timeToValue: "Time to Value",
};

function totalScore(scores: OpportunityScore): number {
  return Object.values(scores).reduce((sum, v) => sum + v, 0);
}

export function OpportunityCandidateList({ candidates }: { candidates: OpportunityCandidate[] }) {
  const ranked = [...candidates].sort((a, b) => totalScore(b.scores) - totalScore(a.scores));

  return (
    <div className="space-y-2">
      {ranked.map((c, i) => (
        <div
          key={c.id}
          className={
            "rounded-md border px-3.5 py-3 " +
            (c.selected ? "border-accent bg-accent-soft" : "border-border bg-surface")
          }
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-black/[0.05] text-[11px] font-semibold text-muted">
                {i + 1}
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-foreground">{c.workflowName}</span>
                  {c.selected && <Badge tone="accent">Selected</Badge>}
                </div>
                <p className="mt-0.5 text-[12.5px] text-muted">{c.oneLiner}</p>
              </div>
            </div>
            <span className="shrink-0 text-[13px] font-semibold tabular-nums text-foreground">
              {totalScore(c.scores)}<span className="text-muted-2 font-normal">/35</span>
            </span>
          </div>

          {c.whyScoreNotes && Object.keys(c.whyScoreNotes).length > 0 && (
            <details className="mt-2 ml-7.5">
              <summary className="cursor-pointer text-[11.5px] font-medium text-accent">Why this score?</summary>
              <ul className="mt-1.5 space-y-1">
                {Object.entries(c.whyScoreNotes).map(([key, note]) => (
                  <li key={key} className="text-[12px] text-foreground">
                    <span className="font-medium text-muted">{DIMENSION_LABELS[key as keyof OpportunityScore]}:</span> {note}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      ))}
    </div>
  );
}
