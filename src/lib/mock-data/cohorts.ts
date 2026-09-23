import { AcquisitionChannel, CohortDiff, CohortEconomics, CohortSeries } from "@/types";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"];

export const cohortSeries: CohortSeries[] = [
  {
    channel: "Paid Social",
    points: [36.2, 35.8, 35.1, 34.7, 30.3, 27.8, 25.4].map((repeat30d, i) => ({ month: MONTHS[i], repeat30d })),
  },
  {
    channel: "Paid Search",
    points: [37.1, 36.8, 36.2, 35.9, 35.1, 34.8, 34.3].map((repeat30d, i) => ({ month: MONTHS[i], repeat30d })),
  },
  {
    channel: "Organic",
    points: [45.8, 45.2, 44.6, 45.1, 44.3, 43.7, 43.9].map((repeat30d, i) => ({ month: MONTHS[i], repeat30d })),
  },
  {
    channel: "Referral",
    points: [48.6, 47.9, 48.2, 47.5, 47.8, 47.1, 47.4].map((repeat30d, i) => ({ month: MONTHS[i], repeat30d })),
  },
];

const CHANNELS: AcquisitionChannel[] = ["Paid Social", "Paid Search", "Organic", "Referral"];

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

export const cohortEconomics: CohortEconomics[] = (() => {
  const rand = seededRand(20260815);
  const rows: CohortEconomics[] = [];
  for (const month of MONTHS) {
    for (const channel of CHANNELS) {
      const series = cohortSeries.find((s) => s.channel === channel)!;
      const day30Repeat = series.points.find((p) => p.month === month)!.repeat30d;
      const customers = Math.round(4000 + rand() * 9000);
      const cac = channel === "Organic" ? 0 : Math.round(24 + rand() * 16);
      rows.push({
        cohortMonth: month,
        channel,
        customers,
        cac,
        firstOrderRevenue: Math.round(customers * (38 + rand() * 12)),
        day30Repeat,
        day60Repeat: Math.round((day30Repeat * (1.35 + rand() * 0.15)) * 10) / 10,
        p180Ltv: Math.round(110 + day30Repeat * 2.2),
        contributionMargin: Math.round(20 + day30Repeat * 1.6),
        paybackDays: cac === 0 ? 0 : Math.round(cac / (day30Repeat / 100) / 2),
      });
    }
  }
  return rows;
})();

export const cohortDiffs: CohortDiff[] = [
  {
    label: "July Meta Broad vs March Meta Broad",
    cohortA: "Mar · Paid Social",
    cohortB: "Jul · Paid Social",
    deltas: [
      { metric: "First-order discount", value: 9.1, unit: "pp" },
      { metric: "Organic-product mix", value: -6.4, unit: "pp" },
      { metric: "App activation", value: -11.8, unit: "pp" },
      { metric: "Units / first order", value: -4.2, unit: "pct" },
      { metric: "Delivery performance", value: 0.3, unit: "pp" },
    ],
  },
];

export const cohortDivergenceExplanation =
  "July's Paid Social cohort was acquired with materially deeper first-order discounts and skewed toward broad lookalike audiences with lower app activation. Organic-product mix (a proxy for higher-intent grocery shoppers) fell 6.4 points versus March, consistent with a lower-intent acquisition mix rather than a service quality change.";
