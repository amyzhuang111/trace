import { CustomerEconomics, CustomerProfile, CustomerQuestion, RevenueBridgeItem } from "@/types";

export const customer: CustomerProfile = {
  name: "Northstar Market",
  synthetic: true,
  businessType: "Omnichannel grocery delivery + physical retail",
  market: "NYC core market",
  knownCustomers: 1_700_000,
  locations: 42,
  channels: ["Web", "Mobile"],
  attributes: [
    "Omnichannel grocery",
    "1.7M known customers",
    "NYC core market",
    "42 locations",
    "Membership program",
    "Paid + organic acquisition",
    "High promotional intensity",
    "High-frequency purchase behavior",
  ],
};

export const economics: CustomerEconomics = {
  activeCustomers: 648_000,
  monthlyRevenue: 46_200_000,
  monthlyOrders: 1_080_000,
  aov: 42.78,
  ordersPerActiveCustomer: 1.67,
  repeat90d: 41.6,
  blendedCac: 28.4,
  p180Ltv: 164,
  loyaltyPenetration: 31.8,
  promoOrderShare: 37.4,
};

export const revenueBridge: RevenueBridgeItem[] = [
  { label: "Prior period", value: 42_800_000 },
  { label: "Pricing / basket value", value: 4_100_000 },
  { label: "Acquisition volume", value: 1_200_000 },
  { label: "Repeat-frequency deterioration", value: -1_100_000 },
  { label: "Inactive-customer growth", value: -800_000 },
  { label: "Current period", value: 46_200_000 },
];

export const customerQuestions: CustomerQuestion[] = [
  { id: "q1", question: "Are our newest customers lower quality?", investigationId: "new-cohort-quality" },
  { id: "q2", question: "Are promotions creating incremental behavior?", investigationId: "promo-leakage" },
  { id: "q3", question: "Which loyalty behaviors truly compound?", investigationId: "loyalty-frequency" },
  { id: "q4", question: "Where should paid budget move?", investigationId: "branded-search-efficiency" },
  { id: "q5", question: "Which assortment changes increase repeat visits?", investigationId: "prepared-foods-frequency" },
];

// Behavior-vs-price decomposition for the core case — feeds
// BehaviorVsPriceDecomposition on Customer Overview, Investigation Detail,
// and Basket & Frequency.
export const behaviorVsPrice = {
  nominalGrowthPct: 11.8,
  priceEffectPP: 8.1,
  volumeFrequencyEffectPP: -4.7,
  customerBaseEffectPP: 8.4,
  conclusion: "Topline growth is positive, but underlying repeat behavior weakened.",
};

export const shareOfWallet = {
  segments: [
    { segment: "High-value loyalty households", pct: 47 },
    { segment: "High-value non-members", pct: 31 },
    { segment: "Promotion-dependent", pct: 18 },
  ],
  note: "Share of wallet is estimated because off-platform spend is not directly observed.",
};
