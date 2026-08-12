"use client";

import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  CartesianGrid,
  ReferenceLine,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Label,
} from "recharts";
import { Experiment } from "@/types";
import { chartInk } from "@/lib/chartColors";
import { formatPct, formatUsd } from "@/lib/utils";

const EXPERIMENT_COLORS = ["#2a78d6", "#eb6834", "#1baf7a", "#4a3aa7"];

export function QualityCostScatter({ experiments, threshold }: { experiments: Experiment[]; threshold: number }) {
  const data = experiments.map((e, i) => ({
    ...e,
    x: e.costPerTaskUsd,
    y: e.score,
    z: e.latencySeconds,
    color: EXPERIMENT_COLORS[i % EXPERIMENT_COLORS.length],
  }));

  return (
    <ResponsiveContainer width="100%" height={320}>
      <ScatterChart margin={{ top: 10, right: 24, bottom: 24, left: 8 }}>
        <CartesianGrid stroke={chartInk.grid} />
        <XAxis
          type="number"
          dataKey="x"
          name="Cost"
          unit="$"
          tick={{ fill: chartInk.muted, fontSize: 11 }}
          axisLine={{ stroke: chartInk.axis }}
          tickLine={false}
          domain={[0, "dataMax + 0.15"]}
        >
          <Label value="Cost per task (USD)" position="insideBottom" offset={-16} style={{ fill: chartInk.secondary, fontSize: 11 }} />
        </XAxis>
        <YAxis
          type="number"
          dataKey="y"
          name="Score"
          tickFormatter={(v) => formatPct(v)}
          domain={[0.5, 1]}
          tick={{ fill: chartInk.muted, fontSize: 11 }}
          axisLine={{ stroke: chartInk.axis }}
          tickLine={false}
        >
          <Label value="Eval score" angle={-90} position="insideLeft" style={{ fill: chartInk.secondary, fontSize: 11, textAnchor: "middle" }} />
        </YAxis>
        <ZAxis type="number" dataKey="z" range={[120, 500]} name="Latency" unit="s" />
        <ReferenceLine
          y={threshold}
          stroke="#d03b3b"
          strokeDasharray="4 3"
          label={{ value: `Pilot quality bar · ${formatPct(threshold)}`, position: "insideTopRight", fill: "#d03b3b", fontSize: 11 }}
        />
        <Tooltip
          cursor={{ strokeDasharray: "3 3" }}
          contentStyle={{ fontSize: 12, borderRadius: 6, border: `1px solid ${chartInk.grid}` }}
          formatter={(value, name) => {
            const n = Number(value);
            if (name === "Score") return [formatPct(n), name];
            if (name === "Cost") return [formatUsd(n), name];
            if (name === "Latency") return [`${n}s`, name];
            return [String(value), String(name)];
          }}
          labelFormatter={() => ""}
        />
        <Scatter data={data} shape="circle">
          {data.map((d) => (
            <Cell key={d.id} fill={d.color} fillOpacity={0.85} stroke={d.color} />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export { EXPERIMENT_COLORS };
