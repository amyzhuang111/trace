import { PilotWorkstream } from "@/types";

export const pilotWorkstreams: PilotWorkstream[] = [
  {
    id: "ws-customer",
    name: "Customer / Workflow",
    owner: "Dana Whitfield — VP Customer Success",
    status: "done",
    nextMilestone: "Hold at current scope — workflow, owner, and baseline are confirmed.",
    blockerIds: [],
  },
  {
    id: "ws-data",
    name: "Data / Context",
    owner: "Elena Vasquez — Revenue Operations",
    status: "in-progress",
    nextMilestone: "Backfill usage-history baseline (gap-02) and add structured sponsor-change field (gap-05).",
    blockerIds: [],
  },
  {
    id: "ws-agent",
    name: "Agent",
    owner: "Engineering — Agent Spec",
    status: "in-progress",
    nextMilestone: "Ship the contradiction-handling fix behind spec v5; get spec approved out of active review.",
    blockerIds: ["blocker-contradiction"],
  },
  {
    id: "ws-evaluation",
    name: "Evaluation",
    owner: "Evaluation — Eval Authoring",
    status: "blocked",
    nextMilestone: "Author 5 adversarial contradiction cases + 4 severity-taxonomy cases, then re-run Configuration C on the full 24-case suite.",
    blockerIds: ["blocker-support-risk", "blocker-adversarial-coverage"],
  },
  {
    id: "ws-security",
    name: "Security / Governance",
    owner: "IT / Legal",
    status: "in-progress",
    nextMilestone: "Get CS leadership sign-off on the fallback-to-manual-prep rollback runbook.",
    blockerIds: [],
  },
  {
    id: "ws-pilot",
    name: "Pilot",
    owner: "Dana Whitfield — VP Customer Success",
    status: "not-started",
    nextMilestone: "Cannot start until Evaluation workstream clears all three blockers and the committed configuration reaches the quality bar.",
    blockerIds: ["blocker-contradiction", "blocker-support-risk", "blocker-adversarial-coverage"],
  },
];
