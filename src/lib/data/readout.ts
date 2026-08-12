import { ExecutiveReadout } from "@/types";

export const readout: ExecutiveReadout = {
  id: "readout-01",
  headline: "Executive Account Brief Agent — Engagement Readout",
  recommendation:
    "The Executive Account Brief workflow is a strong candidate for bounded agent deployment, but the current committed configuration is not yet ready for pilot. The workflow has meaningful time-saving potential, strong data availability, and clear human approval boundaries. However, the agent currently underperforms on contradiction handling and critical support risk detection.",
  whyThisWorkflow: [
    "Knowledge intensive and highly repetitive — draws on judgment senior account managers built over years.",
    "Strong, measurable baseline: current prep time is tracked and auditable today.",
    "Reversible output with human review already built into the process — no new approval step to invent.",
    "No autonomous financial or customer-facing action — the agent drafts, a human decides.",
  ],
  pilotRequirements: [
    "Add five adversarial contradiction-handling eval cases.",
    "Make Critical Support Risk a hard pre-summarization filter, not a post-hoc check.",
    "Run Configuration C against the complete 24-case committed benchmark before it can replace Configuration B.",
    "Close the usage-baseline and executive-sponsor-tracking context gaps (gap-02, gap-05) before broad rollout.",
  ],
  decisionsNeeded: [
    "Approve continued evaluation of Configuration C toward full-suite commitment.",
    "Approve the five additional adversarial eval cases before the next benchmark run.",
    "Confirm the 12-account pilot cohort and target start date.",
    "Sign off on the fallback-to-manual-prep rollback runbook.",
  ],
  generatedAt: "2026-08-08",
};
