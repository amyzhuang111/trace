"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge, toneForStatus } from "@/components/ui/badge";
import { Hypothesis } from "@/types";
import { cn } from "@/lib/utils";

const STATUS_LABELS: Record<Hypothesis["status"], string> = {
  untested: "Untested",
  supported: "Supported",
  partially_supported: "Partially supported",
  ruled_out: "Ruled out",
  inconclusive: "Inconclusive",
};

export function HypothesisCard({ hypothesis }: { hypothesis: Hypothesis }) {
  const [open, setOpen] = useState(false);
  const hasEvidence = hypothesis.evidenceFor.length + hypothesis.evidenceAgainst.length > 0;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-[12.5px] font-semibold text-foreground">{hypothesis.label}</div>
          <p className="mt-1 text-[12px] leading-relaxed text-muted">{hypothesis.statement}</p>
        </div>
        <Badge tone={toneForStatus(hypothesis.status)} className="shrink-0">
          {STATUS_LABELS[hypothesis.status]}
        </Badge>
      </div>

      {hasEvidence && (
        <button
          onClick={() => setOpen((o) => !o)}
          className="mt-2.5 flex items-center gap-1 text-[11.5px] font-medium text-accent hover:underline"
        >
          {open ? "Hide evidence" : "View evidence"}
          <ChevronDown size={12} className={cn("transition-transform", open && "rotate-180")} />
        </button>
      )}

      {open && (
        <div className="mt-2.5 space-y-1.5 border-t border-border/60 pt-2.5">
          {hypothesis.evidenceFor.map((e, i) => (
            <div key={`for-${i}`} className="flex gap-1.5 text-[12px] text-foreground">
              <span className="mt-0.5 text-success">+</span>
              {e}
            </div>
          ))}
          {hypothesis.evidenceAgainst.map((e, i) => (
            <div key={`against-${i}`} className="flex gap-1.5 text-[12px] text-foreground">
              <span className="mt-0.5 text-danger">−</span>
              {e}
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center gap-1.5 border-t border-border/60 pt-2.5 text-[11px] text-muted-2">
        Confidence
        <span className="font-medium text-foreground">{hypothesis.confidence}%</span>
      </div>
    </Card>
  );
}
