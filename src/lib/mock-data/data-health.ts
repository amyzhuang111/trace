import { DataHealthIssue, DataHealthMetric, DataSourceRow } from "@/types";

export const dataHealthMetrics: DataHealthMetric[] = [
  { label: "Overall health", value: 98.1 },
  { label: "Freshness", value: 99.4 },
  { label: "Customer identity match", value: 98.8 },
  { label: "Transaction completeness", value: 99.7 },
  { label: "Campaign mapping", value: 94.2 },
  { label: "Product taxonomy coverage", value: 97.1 },
];

export const dataSources: DataSourceRow[] = [
  { source: "Orders", freshness: "12 min ago", completeness: 99.9, status: "Healthy" },
  { source: "Order Items", freshness: "12 min ago", completeness: 99.8, status: "Healthy" },
  { source: "Customer", freshness: "18 min ago", completeness: 98.8, status: "Healthy" },
  { source: "Loyalty", freshness: "22 min ago", completeness: 99.5, status: "Healthy" },
  { source: "Promotions", freshness: "31 min ago", completeness: 99.2, status: "Healthy" },
  { source: "Meta Ads", freshness: "44 min ago", completeness: 94.2, status: "Degraded" },
  { source: "Google Ads", freshness: "38 min ago", completeness: 97.6, status: "Healthy" },
  { source: "App events", freshness: "9 min ago", completeness: 99.1, status: "Healthy" },
  { source: "Delivery events", freshness: "14 min ago", completeness: 99.6, status: "Healthy" },
  { source: "Product catalog", freshness: "2 hr ago", completeness: 97.1, status: "Healthy" },
];

export const dataHealthIssues: DataHealthIssue[] = [
  {
    id: "dh-1",
    description: "5.8% of Meta campaign rows missing creative taxonomy",
    affectedAnalyses: ["Channel mix decomposition", "New cohort quality investigation"],
    severity: "Medium",
    workaround: "Campaign-level attribution confidence reduced; audience-level rollups remain reliable.",
    status: "Open",
  },
  {
    id: "dh-2",
    description: "Pinterest feed delayed 31 min",
    affectedAnalyses: ["Channels page (Pinterest rows only)"],
    severity: "Low",
    workaround: "Use prior sync until feed catches up; does not affect Meta/Google reporting.",
    status: "Monitoring",
  },
  {
    id: "dh-3",
    description: "1.2% household identity ambiguity",
    affectedAnalyses: ["Cross-device cohort matching"],
    severity: "Low",
    workaround: "Excluded from matched-cohort tests where identity confidence is required.",
    status: "Open",
  },
  {
    id: "dh-4",
    description: "2 categories changed taxonomy in July",
    affectedAnalyses: ["Category attach analysis", "Assortment investigation"],
    severity: "Medium",
    workaround: "July+ category rows re-mapped; pre-July comparisons use legacy taxonomy with a footnote.",
    status: "Resolved",
  },
];
