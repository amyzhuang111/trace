import { PromoIncrementality, PromoScatterPoint, PromotionRow } from "@/types";

export const promoSummary = {
  promoSpend: 3_800_000,
  ordersWithPromoPct: 37.4,
  incrementalRevenueEstimate: 2_600_000,
  oneTimeBuyerLeakage: 612_000,
};

export const promotions: PromotionRow[] = [
  {
    id: "promo-1",
    offer: "20% first order",
    customers: 118_000,
    redemption: 0.62,
    incrementalConversion: 0.07,
    repeat30d: 28.4,
    incrementalMargin: -8.4,
    p180Ltv: 121,
    likelyIncrementality: "Low",
    status: "Active",
  },
  {
    id: "promo-2",
    offer: "$15 off $75",
    customers: 74_000,
    redemption: 0.41,
    incrementalConversion: 0.11,
    repeat30d: 37.6,
    incrementalMargin: -4.1,
    p180Ltv: 156,
    likelyIncrementality: "Medium",
    status: "Active",
  },
  {
    id: "promo-3",
    offer: "Free delivery",
    customers: 205_000,
    redemption: 0.58,
    incrementalConversion: 0.16,
    repeat30d: 41.2,
    incrementalMargin: -1.8,
    p180Ltv: 169,
    likelyIncrementality: "Medium",
    status: "Active",
  },
  {
    id: "promo-4",
    offer: "Loyalty 2x points",
    customers: 96_000,
    redemption: 0.34,
    incrementalConversion: 0.09,
    repeat30d: 46.8,
    incrementalMargin: -0.9,
    p180Ltv: 188,
    likelyIncrementality: "High",
    status: "Active",
  },
  {
    id: "promo-5",
    offer: "Prepared foods bundle",
    customers: 51_000,
    redemption: 0.29,
    incrementalConversion: 0.13,
    repeat30d: 44.1,
    incrementalMargin: 1.2,
    p180Ltv: 179,
    likelyIncrementality: "High",
    status: "Testing",
  },
  {
    id: "promo-6",
    offer: "Win-back $10 credit",
    customers: 22_000,
    redemption: 0.19,
    incrementalConversion: 0.08,
    repeat30d: 31.7,
    incrementalMargin: -3.2,
    p180Ltv: 138,
    likelyIncrementality: "Medium",
    status: "Testing",
  },
];

export const promoIncrementality: Record<string, PromoIncrementality> = {
  "promo-1": {
    offer: "20% first order",
    observedConversionLift: 18,
    matchedIncrementalConversion: 7,
    firstOrderMarginDelta: -8.4,
    repeat90dDelta: -5.1,
    p180Contribution: -4.8,
  },
  "promo-3": {
    offer: "Free delivery",
    observedConversionLift: 12,
    matchedIncrementalConversion: 8,
    firstOrderMarginDelta: -1.8,
    repeat90dDelta: 1.4,
    p180Contribution: 6.2,
  },
};

function seededRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

const BUCKETS = [
  { min: 0, max: 10 },
  { min: 10, max: 20 },
  { min: 20, max: 30 },
  { min: 30, max: 45 },
];
const CHANNELS = ["Paid Social", "Paid Search", "Organic", "Referral"] as const;

export const promoScatter: PromoScatterPoint[] = (() => {
  const rand = seededRand(90210);
  const points: PromoScatterPoint[] = [];
  let idx = 0;
  for (const bucket of BUCKETS) {
    const baseRepeat = 46 - (bucket.min / 45) * 22;
    for (let i = 0; i < 9; i++) {
      idx++;
      points.push({
        customerId: `cluster-${idx}`,
        discountPct: Math.round(bucket.min + rand() * (bucket.max - bucket.min)),
        repeat90d: Math.round((baseRepeat + (rand() - 0.5) * 8) * 10) / 10,
        customers: Math.round(800 + rand() * 6000),
        channel: CHANNELS[Math.floor(rand() * CHANNELS.length)],
      });
    }
  }
  return points;
})();

export const promoMatchedTest = {
  matchedOn: ["acquisition channel", "first-order category", "geography", "first-order basket", "acquisition week"],
  estimatedRepeatGap: -5.1,
  confidenceInterval: [-6.2, -4.0] as [number, number],
  label: "Strong evidence of promotion-dependent behavior",
};
