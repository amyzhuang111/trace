import { DecisionLogEntry } from "@/types";

export const decisionLog: DecisionLogEntry[] = [
  {
    id: "dl-1",
    investigationId: "new-cohort-quality",
    finding: "New Meta Broad cohorts had weaker 30-day repeat.",
    judgment: "Channel mix and promotion depth were both contributors.",
    action: "Reduced broad-audience budget 12%; constrained offers above 20%.",
    actionDate: "2026-06-30",
    result: {
      measuredAt: "2026-08-14",
      metrics: [
        { label: "30-day repeat", value: "+4.6 pp", tone: "positive" },
        { label: "Blended CAC", value: "+2.1%", tone: "negative" },
        { label: "p180 LTV", value: "+7.9%", tone: "positive" },
        { label: "Contribution", value: "+$290K", tone: "positive" },
      ],
    },
    learning: "Optimizing downstream quality produced better economics despite slightly higher CAC.",
  },
  {
    id: "dl-2",
    investigationId: "winback-dormant-households",
    finding: "84K high-value households drifting past expected cadence.",
    judgment: "Reactivation odds drop sharply after 120 days — window is time-sensitive.",
    action: "Launched personalized win-back offer to the eligible 84,318 households.",
    actionDate: "2026-07-15",
    result: {
      measuredAt: "2026-08-14",
      metrics: [
        { label: "Reactivation rate", value: "12.4%", tone: "positive" },
        { label: "Recovered contribution", value: "$318K", tone: "positive" },
      ],
    },
    learning: "Slightly under the 14% projection — worth testing a deeper offer for the 90-120 day sub-segment.",
  },
  {
    id: "dl-3",
    finding: "Loyalty renewal cohort showed declining second-year engagement.",
    judgment: "Insufficient data to separate true fatigue from a benefits-communication gap.",
    action: "Requested benefits-email engagement data from Northstar before proceeding.",
    actionDate: "2026-08-05",
    learning: undefined,
  },
];
