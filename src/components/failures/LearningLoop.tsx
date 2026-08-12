import { ArrowRight } from "lucide-react";

const STEPS = ["Production / Eval Failure", "Expert Review", "Root Cause", "Context / Spec / Verifier Update", "New Regression Test", "Rerun"];

export function LearningLoop() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {STEPS.map((step, i) => (
        <span key={step} className="flex items-center gap-2">
          <span className="rounded-md border border-border-strong bg-black/[0.02] px-2.5 py-1.5 text-[12px] font-medium text-foreground">
            {step}
          </span>
          {i < STEPS.length - 1 && <ArrowRight size={13} className="text-muted-2 shrink-0" />}
        </span>
      ))}
    </div>
  );
}
