"use client";

import { Bar, BarChart, CartesianGrid, Cell, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { RevenueBridgeItem } from "@/types";
import { formatUsd } from "@/lib/utils";

export function RevenueBridge({ items }: { items: RevenueBridgeItem[] }) {
  const { rows: data } = items.reduce<{
    rows: { label: string; base: number; value: number; isEndpoint: boolean; delta: number }[];
    running: number;
  }>(
    (acc, item, i) => {
      const isEndpoint = i === 0 || i === items.length - 1;
      if (isEndpoint) {
        return {
          rows: [...acc.rows, { label: item.label, base: 0, value: item.value, isEndpoint: true, delta: item.value }],
          running: item.value,
        };
      }
      const start = acc.running;
      const next = start + item.value;
      const base = Math.min(start, next);
      const height = Math.abs(item.value);
      return {
        rows: [...acc.rows, { label: item.label, base, value: height, isEndpoint: false, delta: item.value }],
        running: next,
      };
    },
    { rows: [], running: 0 },
  );

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 12, left: 12, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 10.5, fill: "var(--muted-2)" }}
            angle={-20}
            textAnchor="end"
            height={60}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`}
            tick={{ fontSize: 10.5, fill: "var(--muted-2)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as (typeof data)[number];
              return (
                <div className="rounded-md border border-border bg-surface px-3 py-2 text-[11.5px] shadow-sm">
                  <div className="font-medium text-foreground">{d.label}</div>
                  <div className="text-muted">
                    {d.isEndpoint ? formatUsd(d.delta) : `${d.delta > 0 ? "+" : ""}${formatUsd(d.delta)}`}
                  </div>
                </div>
              );
            }}
          />
          <Bar dataKey="base" stackId="bridge" fill="transparent" />
          <Bar dataKey="value" stackId="bridge" radius={[3, 3, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.isEndpoint ? "var(--foreground)" : d.delta >= 0 ? "var(--success)" : "var(--danger)"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="mt-1 text-[10.5px] text-muted-2">Source: orders + acquisition · price/volume/customer-base decomposition</p>
    </div>
  );
}
