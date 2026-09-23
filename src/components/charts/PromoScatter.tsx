"use client";

import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { PromoScatterPoint } from "@/types";
import { CHANNEL_COLORS } from "@/lib/chartPalette";

export function PromoScatter({ points }: { points: PromoScatterPoint[] }) {
  const channels = Array.from(new Set(points.map((p) => p.channel)));

  return (
    <div>
      <div className="h-[280px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 20, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              type="number"
              dataKey="discountPct"
              name="First-order discount"
              unit="%"
              tick={{ fontSize: 11, fill: "var(--muted-2)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              label={{ value: "First-order discount %", position: "insideBottom", offset: -4, fontSize: 11, fill: "var(--muted-2)" }}
            />
            <YAxis
              type="number"
              dataKey="repeat90d"
              name="90-day repeat"
              unit="%"
              tick={{ fontSize: 11, fill: "var(--muted-2)" }}
              axisLine={false}
              tickLine={false}
              width={40}
              label={{ value: "90-day repeat %", angle: -90, position: "insideLeft", fontSize: 11, fill: "var(--muted-2)" }}
            />
            <ZAxis type="number" dataKey="customers" range={[40, 400]} name="customers" />
            <Tooltip
              cursor={{ strokeDasharray: "3 3", stroke: "var(--border-strong)" }}
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as PromoScatterPoint;
                return (
                  <div className="rounded-md border border-border bg-surface px-3 py-2 text-[11.5px] shadow-sm">
                    <div className="font-medium text-foreground">{d.channel}</div>
                    <div className="text-muted">Discount: {d.discountPct}%</div>
                    <div className="text-muted">90-day repeat: {d.repeat90d}%</div>
                    <div className="text-muted">~{d.customers.toLocaleString()} customers</div>
                  </div>
                );
              }}
            />
            {channels.map((c) => (
              <Scatter
                key={c}
                name={c}
                data={points.filter((p) => p.channel === c)}
                fill={CHANNEL_COLORS[c] ?? "var(--muted-2)"}
                fillOpacity={0.75}
              />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
        {channels.map((c) => (
          <span key={c} className="flex items-center gap-1.5 text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: CHANNEL_COLORS[c] ?? "var(--muted-2)" }} />
            {c}
          </span>
        ))}
      </div>
      <p className="mt-1.5 text-[10.5px] text-muted-2">
        Source: promotions + cohort features · bubble size = customers · observational, not a randomized comparison
      </p>
    </div>
  );
}
