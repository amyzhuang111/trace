import { BasketComposition, CategoryAttach, FrequencyBasketQuadrantPoint, FrequencyPoint } from "@/types";

export const frequencyTrend: FrequencyPoint[] = (() => {
  const months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul"];
  const bySegment: Record<string, number[]> = {
    "Loyalty members": [3.35, 3.31, 3.28, 3.24, 3.22, 3.2],
    "Non-members": [2.18, 2.16, 2.12, 2.09, 2.06, 2.1],
    "New paid cohorts": [2.02, 1.98, 1.9, 1.74, 1.58, 1.46],
  };
  const points: FrequencyPoint[] = [];
  for (const [segment, values] of Object.entries(bySegment)) {
    values.forEach((v, i) => points.push({ period: months[i], visitsPerHousehold: v, segment }));
  }
  return points;
})();

export const basketComposition: BasketComposition = {
  basketValue: 42.78,
  itemsPerBasket: 14.6,
  effectivePricePerItem: 2.93,
  categoryBreadth: 4.1,
  privateLabelShare: 21.4,
  promotedItemShare: 37.4,
};

export const categoryAttach: CategoryAttach[] = [
  { category: "Prepared foods", penetration: 28, attachRate: 41, frequencyLift: 9.4, margin: 34, repeatAssociation: 0.62, confidence: "Medium" },
  { category: "Fresh produce", penetration: 71, attachRate: 68, frequencyLift: 4.1, margin: 22, repeatAssociation: 0.41, confidence: "High" },
  { category: "Beverages", penetration: 64, attachRate: 55, frequencyLift: 2.2, margin: 18, repeatAssociation: 0.28, confidence: "High" },
  { category: "Household", penetration: 52, attachRate: 44, frequencyLift: 1.8, margin: 26, repeatAssociation: 0.24, confidence: "High" },
  { category: "Bakery", penetration: 38, attachRate: 33, frequencyLift: 3.6, margin: 29, repeatAssociation: 0.36, confidence: "Medium" },
  { category: "Dairy", penetration: 69, attachRate: 61, frequencyLift: 2.6, margin: 20, repeatAssociation: 0.31, confidence: "High" },
  { category: "Snacks", penetration: 47, attachRate: 40, frequencyLift: 1.4, margin: 24, repeatAssociation: 0.19, confidence: "Medium" },
];

export const frequencyBasketQuadrant: FrequencyBasketQuadrantPoint[] = [
  { segment: "Loyalty core", frequency: 3.2, basket: 52.4, customers: 148_000 },
  { segment: "High-value occasional", frequency: 1.4, basket: 68.1, customers: 61_000 },
  { segment: "Frequent value shoppers", frequency: 3.6, basket: 28.7, customers: 172_000 },
  { segment: "New paid cohorts", frequency: 1.46, basket: 33.2, customers: 92_000 },
  { segment: "Dormant high-value", frequency: 0.6, basket: 71.3, customers: 84_000 },
  { segment: "Low-engagement", frequency: 0.9, basket: 24.1, customers: 91_000 },
];
