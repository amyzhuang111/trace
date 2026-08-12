"use client";

import { Failure } from "@/types";
import { Badge, toneForStatus } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEngagementStore } from "@/store/useEngagementStore";

const ACTION_LABEL: Record<Failure["action"], string> = {
  "context-update": "Context Update",
  "agent-spec-update": "Agent Spec Update",
  "verifier-update": "Verifier Update",
};

export function FailureCard({ failure }: { failure: Failure }) {
  const markFailureRegression = useEngagementStore((s) => s.markFailureRegression);

  return (
    <div className="rounded-md border border-border bg-surface px-4 py-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[11px] font-mono text-muted-2">{failure.id}</div>
          <div className="text-[13.5px] font-semibold text-foreground">{failure.title}</div>
          <div className="text-[12px] text-muted mt-0.5">{failure.taskDescription}</div>
        </div>
        <Badge tone={toneForStatus(failure.status)}>{failure.status.replace("-", " ")}</Badge>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-2 text-[12px]">
        <Field label="Observed behavior" value={failure.observedBehavior} />
        <Field label="Expected behavior" value={failure.expectedBehavior} />
        <Field label="Problem" value={failure.problem} />
        <Field label="Root cause" value={failure.rootCause} />
        <Field label="Expert correction" value={failure.expertCorrection} full />
        <Field label="Remediation" value={failure.remediation} full />
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
        <div className="flex items-center gap-2">
          <Badge tone="neutral">{ACTION_LABEL[failure.action]}</Badge>
          {failure.regressionAdded && <Badge tone="success">Regression added</Badge>}
        </div>
        {!failure.regressionAdded && (
          <Button size="sm" variant="secondary" onClick={() => markFailureRegression(failure.id)}>
            Mark regression added
          </Button>
        )}
      </div>
    </div>
  );
}

function Field({ label, value, full }: { label: string; value: string; full?: boolean }) {
  return (
    <div className={full ? "col-span-2" : undefined}>
      <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-2">{label}</div>
      <div className="text-foreground leading-snug">{value}</div>
    </div>
  );
}
