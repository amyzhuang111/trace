import { PilotMetric } from "@/types";

export const pilotMetrics: PilotMetric[] = [
  // Business — only measurable once the pilot cohort is live
  { id: "pm-prep-time", category: "business", label: "Prep time per brief", target: "≥60% reduction vs. 2.5-hour baseline", status: "not-started" },
  { id: "pm-throughput", category: "business", label: "Briefs produced per account manager / week", target: "No decrease vs. current throughput", status: "not-started" },
  { id: "pm-review-time", category: "business", label: "Human review time per brief", target: "≤15 minutes", status: "not-started" },

  // Agent Quality — already tracked every experiment run via the eval suite
  { id: "pm-overall-score", category: "quality", label: "Overall eval score", target: "≥85% on the full committed suite", status: "tracking" },
  { id: "pm-grounding", category: "quality", label: "Source grounding", target: "100% (blocking)", status: "tracking" },
  { id: "pm-prioritization", category: "quality", label: "Strategic prioritization", target: "≥80%", status: "tracking" },
  { id: "pm-contradiction", category: "quality", label: "Contradiction handling", target: "100% (blocking)", status: "tracking" },
  { id: "pm-critical-omission", category: "quality", label: "Critical support issue omission rate", target: "0% (blocking)", status: "tracking" },

  // Human Trust — requires a live pilot cohort to measure
  { id: "pm-acceptance", category: "trust", label: "Brief acceptance rate (used as-is)", target: "Baseline TBD at pilot start", status: "not-started" },
  { id: "pm-edit-rate", category: "trust", label: "Human edit rate before send", target: "Baseline TBD at pilot start", status: "not-started" },
  { id: "pm-override-rate", category: "trust", label: "Full override / discard rate", target: "<10%", status: "not-started" },
  { id: "pm-manager-correction", category: "trust", label: "Manager correction rate on approved briefs", target: "Baseline TBD at pilot start", status: "not-started" },

  // Operational — already tracked per experiment
  { id: "pm-latency", category: "operational", label: "Latency per brief", target: "<90 seconds", status: "tracking" },
  { id: "pm-cost", category: "operational", label: "Inference cost per task", target: "Lowest cost config clearing the quality bar", status: "tracking" },
  { id: "pm-tool-failures", category: "operational", label: "Unhandled tool failures", target: "0 — must always be surfaced, never silent", status: "tracking" },

  // Safety — enforced today by verifiers and the prohibited-actions list
  { id: "pm-unsupported-claims", category: "safety", label: "Unsupported factual claims", target: "0 (blocking — Source Grounding)", status: "tracking" },
  { id: "pm-critical-omissions-safety", category: "safety", label: "Critical omissions reaching an executive", target: "0 (blocking — Critical Support Risk)", status: "tracking" },
  { id: "pm-approval-violations", category: "safety", label: "Briefs sent without human approval", target: "0 — approval gate is structural, not optional", status: "tracking" },
];
