"use client";

import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { ChannelRow } from "@/types";

export function ChannelEconomicsChart({
  channels,
  view,
  highlight = "Meta Broad",
}: {
  channels: ChannelRow[];
  view: "acquisition" | "economics";
  highlight?: string;
}) {
  const metric = view === "acquisition" ? "firstOrderRoas" : "p180Ltv";
  const label = view === "acquisition" ? "First-order ROAS" : "p180 LTV ($)";
  const data = channels.map((c) => ({ channel: c.channel, value: c[metric] ?? 0 }));

  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 12, left: 8, bottom: 30 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="channel"
            tick={{ fontSize: 10.5, fill: "var(--muted-2)" }}
            angle={-18}
            textAnchor="end"
            height={44}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => (view === "acquisition" ? `${v}x` : `$${v}`)}
            tick={{ fontSize: 10.5, fill: "var(--muted-2)" }}
            axisLine={false}
            tickLine={false}
            width={38}
          />
          <Tooltip
            content={({ active, payload, label: xLabel }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-md border border-border bg-surface px-3 py-2 text-[11.5px] shadow-sm">
                  <div className="font-medium text-foreground">{xLabel}</div>
                  <div className="text-muted">
                    {label}: <span className="font-medium text-foreground">{payload[0].value as number}{view === "acquisition" ? "x" : ""}</span>
                  </div>
                </div>
              );
            }}
          />
          <Bar dataKey="value" radius={[3, 3, 0, 0]}>
            {data.map((d) => (
              <Cell key={d.channel} fill={d.channel === highlight ? "var(--danger)" : "var(--chart-1)"} fillOpacity={d.channel === highlight ? 0.85 : 0.55} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-1 text-[10.5px] text-muted-2">Source: acquisition + orders · {label} by channel{highlight ? ` · ${highlight} highlighted` : ""}</p>
    </div>
  );
}
