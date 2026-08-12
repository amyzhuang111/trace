import { ArrowDown } from "lucide-react";

const CHAIN = [
  {
    label: "Client Evidence",
    content: '"If the systems disagree, I want the brief to show the disagreement rather than silently choosing one." — Senior Strategic Account Manager interview',
  },
  { label: "Product Requirement", content: "Contradiction Detection" },
  {
    label: "Agent Behavior",
    content: "Retrieve both sources · identify the inconsistency · preserve source attribution · reduce confidence · escalate the contradiction · never invent a reconciliation",
  },
  { label: "Verifier", content: "Contradiction Handling (blocking, threshold 1.0)" },
  { label: "Eval Cases", content: "ec-15 CRM vs. executive note · ec-16 Sales vs. CS health score · ec-17 severity-taxonomy disagreement" },
];

export function EvidenceChain() {
  return (
    <div className="space-y-0">
      {CHAIN.map((step, i) => (
        <div key={step.label}>
          <div className="rounded-md border border-border bg-surface px-3.5 py-2.5">
            <div className="text-[10.5px] font-semibold uppercase tracking-wide text-muted-2">{step.label}</div>
            <div className="mt-0.5 text-[12.5px] text-foreground leading-relaxed">{step.content}</div>
          </div>
          {i < CHAIN.length - 1 && (
            <div className="flex justify-center py-1">
              <ArrowDown size={14} className="text-muted-2" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
