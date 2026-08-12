import { PilotDecision } from "@/types";

export const pilotDecision: PilotDecision = {
  id: "pilot-decision-01",
  requiredActions: [
    "Author five additional adversarial contradiction-handling eval cases.",
    "Move the Critical Support Risk verifier to a hard pre-summarization filter.",
    "Run Configuration C (Frontier Model C · Prompt v5) against the full 24-case committed benchmark — it has only cleared a 16-case screening subset so far.",
    "Re-validate all three blocking verifiers pass before scheduling a pilot cohort.",
  ],
  checklist: [
    { id: "chk-biz-owner", category: "business", label: "Workflow owner identified", status: "done", detail: "Dana Whitfield, VP Customer Success, is the accountable owner." },
    { id: "chk-biz-baseline", category: "business", label: "Baseline measured", status: "done", detail: "Current prep time measured at 2.5 hours per brief, 160 briefs/month." },
    { id: "chk-biz-kpi", category: "business", label: "Target KPI defined", status: "done", detail: "≥60% reduction in prep time without loss of brief quality." },
    { id: "chk-biz-cohort", category: "business", label: "Pilot cohort selected", status: "done", detail: "12 strategic accounts across 3 account managers, mixed risk profile." },

    { id: "chk-data-sources", category: "data", label: "Required sources connected", status: "done", detail: "Salesforce, Zendesk, Product Analytics, Drive, Meeting Notes all connected read-only." },
    { id: "chk-data-permissions", category: "data", label: "Permissions approved", status: "done", detail: "Read-only scopes approved by IT and Legal." },
    { id: "chk-data-freshness", category: "data", label: "Freshness acceptable", status: "pending", detail: "Meeting-notes indexing lag (gap-08) improving; usage baseline gap (gap-02) still open." },
    { id: "chk-data-missing", category: "data", label: "Missing-data behavior defined", status: "done", detail: "Agent must flag missing data rather than infer a trend." },

    { id: "chk-agent-spec", category: "agent", label: "Spec approved", status: "pending", detail: "v4 in active review pending contradiction-handling fix." },
    { id: "chk-agent-prohibited", category: "agent", label: "Prohibited actions defined", status: "done", detail: "No writes, no customer contact, no ticket or opportunity changes." },
    { id: "chk-agent-approval", category: "agent", label: "Human approval gate defined", status: "done", detail: "A human must approve every brief before it reaches an executive." },
    { id: "chk-agent-escalation", category: "agent", label: "Escalation logic defined", status: "done", detail: "Four escalation triggers defined in spec v4." },

    { id: "chk-eval-suite", category: "evaluation", label: "Representative eval suite", status: "done", detail: "24 cases across 9 categories and 4 request types." },
    { id: "chk-eval-edge", category: "evaluation", label: "Edge cases covered", status: "pending", detail: "Severity-taxonomy adversarial coverage flagged as thin (failure-023)." },
    { id: "chk-eval-blocking", category: "evaluation", label: "Blocking verifiers pass", status: "blocked", detail: "Contradiction Handling and Critical Support Risk both fail on the current committed configuration." },
    { id: "chk-eval-threshold", category: "evaluation", label: "Quality threshold achieved", status: "blocked", detail: "Committed configuration score is below the required bar — see Overview for the live figure." },
    { id: "chk-eval-cost", category: "evaluation", label: "Cost acceptable", status: "done", detail: "Configuration C's per-task cost is well within the ROI model's assumption." },

    { id: "chk-sec-scope", category: "security", label: "Scoped access", status: "done", detail: "Read-only scopes limited to approved objects per system." },
    { id: "chk-sec-boundaries", category: "security", label: "Read/write boundaries", status: "done", detail: "No write actions are in the allowed-actions list for any spec version." },
    { id: "chk-sec-audit", category: "security", label: "Audit trail", status: "done", detail: "Every brief logs sources queried, conflicts found, and the approving reviewer." },
    { id: "chk-sec-rollback", category: "security", label: "Rollback plan", status: "pending", detail: "Fallback-to-manual-prep runbook drafted, not yet signed off by CS leadership." },
  ],
};
