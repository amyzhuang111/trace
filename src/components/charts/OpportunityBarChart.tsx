"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { OpportunityScore } from "@/types";
import { chartInk, seriesColors } from "@/lib/chartColors";

const DIMENSION_LABELS: { key: keyof OpportunityScore; label: string }[] = [
  { key: "businessValue", label: "Business Value" },
  { key: "aiSuitability", label: "AI Suitability" },
  { key: "dataReadiness", label: "Data Readiness" },
  { key: "executionFeasibility", label: "Execution Feasibility" },
  { key: "evaluationReadiness", label: "Evaluation Readiness" },
  { key: "deploymentSafety", label: "Deployment Safety" },
  { key: "timeToValue", label: "Time to Value" },
];

export function OpportunityBarChart({ scores }: { scores: OpportunityScore }) {
  const data = DIMENSION_LABELS.map((d) => ({ label: d.label, value: scores[d.key] }));

  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 28, bottom: 4, left: 4 }}
        barCategoryGap={10}
      >
        <CartesianGrid horizontal={false} stroke={chartInk.grid} />
        <XAxis
          type="number"
          domain={[0, 5]}
          ticks={[0, 1, 2, 3, 4, 5]}
          tick={{ fill: chartInk.muted, fontSize: 11 }}
          axisLine={{ stroke: chartInk.axis }}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="label"
          width={168}
          tick={{ fill: chartInk.primary, fontSize: 12 }}
          axisLine={{ stroke: chartInk.axis }}
          tickLine={false}
        />
        <Tooltip
          cursor={{ fill: "rgba(11,11,11,0.03)" }}
          contentStyle={{ fontSize: 12, borderRadius: 6, border: `1px solid ${chartInk.grid}` }}
          formatter={(v) => [`${v} / 5`, "Score"]}
        />
        <Bar dataKey="value" radius={[3, 3, 3, 3]} maxBarSize={16}>
          {data.map((_, i) => (
            <Cell key={i} fill={seriesColors[0]} />
          ))}
          <LabelList dataKey="value" position="right" style={{ fill: chartInk.primary, fontSize: 11, fontWeight: 600 }} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
