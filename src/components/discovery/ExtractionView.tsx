import { WorkflowExtraction } from "@/types";
import { Badge, toneForConfidence } from "@/components/ui/badge";
import { GitBranch, Lightbulb } from "lucide-react";

const CATEGORY_LABEL: Record<string, string> = {
  "risk-judgment": "Risk Judgment",
  prioritization: "Prioritization",
  "data-handling": "Data Handling",
  escalation: "Escalation",
  "output-quality": "Output Quality",
};

export function ExtractionView({ extraction }: { extraction: WorkflowExtraction }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-muted uppercase tracking-wide">
          <GitBranch size={13} /> Workflow Steps ({extraction.steps.length})
        </div>
        <ol className="space-y-1.5">
          {extraction.steps
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((step) => (
              <li key={step.id} className="flex gap-2.5 rounded-md border border-border bg-surface px-3 py-2">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-soft text-[10px] font-semibold text-accent">
                  {step.order}
                </span>
                <div className="min-w-0">
                  <div className="text-[12.5px] font-medium text-foreground">{step.label}</div>
                  <div className="mt-0.5 flex flex-wrap gap-1">
                    {step.systems.map((s) => (
                      <Badge key={s} tone="neutral">{s}</Badge>
                    ))}
                    {step.judgmentRequired && <Badge tone="accent">judgment required</Badge>}
                  </div>
                </div>
              </li>
            ))}
        </ol>
      </div>

      <div>
        <div className="mb-2 flex items-center gap-1.5 text-[12px] font-semibold text-muted uppercase tracking-wide">
          <Lightbulb size={13} /> Tacit Judgment ({extraction.tacitRules.length})
        </div>
        <ul className="space-y-1.5">
          {extraction.tacitRules.map((rule) => (
            <li key={rule.id} className="rounded-md border border-border bg-surface px-3 py-2">
              <div className="flex items-start justify-between gap-2">
                <div className="text-[12.5px] font-medium text-foreground">{rule.rule}</div>
                <div className="flex shrink-0 gap-1">
                  <Badge tone={toneForConfidence(rule.confidence)}>{rule.confidence}</Badge>
                </div>
              </div>
              <p className="mt-1 text-[12px] text-muted">{rule.rationale}</p>
              <div className="mt-1.5">
                <Badge tone="neutral">{CATEGORY_LABEL[rule.category] ?? rule.category}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
