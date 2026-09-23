import { Badge } from "@/components/ui/badge";
import { EvidenceType } from "@/types";

const LABELS: Record<EvidenceType, string> = {
  descriptive: "Observed",
  predictive: "Predicted",
  matched: "Matched comparison",
  experimental: "Experimental",
  causal: "Causal evidence",
};

const TONES: Record<EvidenceType, "neutral" | "accent" | "success"> = {
  descriptive: "neutral",
  predictive: "accent",
  matched: "accent",
  experimental: "success",
  causal: "success",
};

const TOOLTIPS: Record<EvidenceType, string> = {
  descriptive: "A raw pattern in the data. Does not control for confounders.",
  predictive: "A model estimate of future behavior, not an observed outcome.",
  matched: "Observational, but compared across groups matched on observable characteristics.",
  experimental: "Derived from a randomized or geo-holdout test design.",
  causal: "Supported by a designed test isolating the effect of one variable.",
};

export function CausalEvidenceBadge({ type }: { type: EvidenceType }) {
  return (
    <Badge tone={TONES[type]} className="cursor-default" title={TOOLTIPS[type]}>
      {LABELS[type]}
    </Badge>
  );
}
