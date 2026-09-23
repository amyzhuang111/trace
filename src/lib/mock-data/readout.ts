import { CustomerMoment, ReadoutEntry } from "@/types";

export const readoutEntries: ReadoutEntry[] = [
  {
    investigationId: "new-cohort-quality",
    finding: "New-customer revenue grew 11.8%, but 30-day repeat fell 7.4 pp, concentrated in broad paid social.",
    moneyAtStake: "$1.18M 180-day revenue at risk",
    action: "Reallocate 12% of Meta Broad spend to higher-pLTV audiences; tighten deep-discount eligibility.",
    caveat: "Campaign creative metadata is not yet included in the model.",
  },
];

export const customerMoments: CustomerMoment[] = [
  {
    title: "Weekly growth review",
    when: "Tomorrow 10:00 AM",
    needsReady: "New cohort quality readout, action recommendation",
    outstandingAnalysis: "Confirm May campaign targeting changes with Northstar marketing",
    owner: "Amy",
  },
  {
    title: "Paid acquisition deep dive",
    when: "Friday",
    needsReady: "Channel decomposition, budget reallocation simulator",
    outstandingAnalysis: "Finalize matched-cohort promotion test writeup",
    owner: "Amy",
  },
  {
    title: "Monthly executive readout",
    when: "Aug 28",
    needsReady: "Full customer readout, decision log summary",
    outstandingAnalysis: "Win-back campaign results (measure at day 45)",
    owner: "Amy",
  },
];
