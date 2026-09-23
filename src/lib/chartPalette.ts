// Fixed categorical series order — validated for CVD/contrast separation.
// Never cycle or reassign by rank; a series keeps its color regardless of filters.
export const CHART_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)", "var(--chart-4)"] as const;

export const CHANNEL_COLORS: Record<string, string> = {
  "Paid Social": "var(--chart-1)",
  "Paid Search": "var(--chart-2)",
  Organic: "var(--chart-3)",
  Referral: "var(--chart-4)",
};

export function colorForIndex(i: number): string {
  return CHART_COLORS[i % CHART_COLORS.length];
}
