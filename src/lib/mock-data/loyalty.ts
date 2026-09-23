import { LoyaltyComparisonRow, WinBackSummary } from "@/types";

export const loyaltySummary = {
  memberMonthlyFrequency: 3.2,
  nonMemberMonthlyFrequency: 2.1,
  retentionAdvantagePP: 14.6,
};

export const loyaltyComparison: LoyaltyComparisonRow[] = [
  { group: "Members", frequency: 3.2, basket: 46.1, retention: 58.2, p180Ltv: 264, contribution: 92 },
  { group: "Matched non-members", frequency: 2.6, basket: 43.8, retention: 47.9, p180Ltv: 213, contribution: 71 },
  { group: "Raw non-members", frequency: 2.1, basket: 39.4, retention: 41.6, p180Ltv: 164, contribution: 58 },
];

export const loyaltyNarrative =
  "Members are more valuable, but part of the gap reflects selection: stronger customers are also more likely to join. The matched comparison still suggests meaningful incremental value.";

export const loyaltyRawVsMatched = {
  rawAdvantagePct: 61,
  matchedAdvantagePct: 24,
};

export const winBack: WinBackSummary = {
  eligibleCustomers: 84_318,
  expectedReactivationRate: 0.14,
  recoveredContribution: 420_000,
  criteria: [
    "p180 LTV > $220",
    "expected cadence missed by > 21 days",
    "last purchase < 120 days",
    "no active service issue",
  ],
};

export const assortmentFinding = {
  question: "Does prepared-food adoption increase customer frequency?",
  attachRateIncrease: 18,
  frequencyLiftExposedCohort: 9.4,
  conclusion:
    "Prepared-food adoption is associated with higher subsequent frequency, but self-selection explains part of the effect. The strongest test would be a geo/store-level exposure experiment.",
  suggestedAction: "Test increased prepared-food visibility in matched delivery zones.",
};
