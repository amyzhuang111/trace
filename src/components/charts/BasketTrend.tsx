"use client";

import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { FrequencyPoint } from "@/types";
import { colorForIndex } from "@/lib/chartPalette";

export function BasketTrend({ points }: { points: FrequencyPoint[] }) {
  const segments = Array.from(new Set(points.map((p) => p.segment)));
  const periods = Array.from(new Set(points.map((p) => p.period)));
  const data = periods.map((period) => {
    const row: Record<string, string | number | null> = { period };
    for (const seg of segments) {
      row[seg] = points.find((p) => p.period === period && p.segment === seg)?.visitsPerHousehold ?? null;
    }
    return row;
  });

  return (
    <div>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 16, left: 8, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="period" tick={{ fontSize: 11, fill: "var(--muted-2)" }} axisLine={{ stroke: "var(--border)" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "var(--muted-2)" }} axisLine={false} tickLine={false} width={30} />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="rounded-md border border-border bg-surface px-3 py-2 text-[11.5px] shadow-sm">
                    <div className="mb-1 font-medium text-foreground">{label}</div>
                    {payload.map((p) => (
                      <div key={String(p.dataKey)} className="flex items-center gap-1.5 text-muted">
                        <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
                        {String(p.dataKey)}: <span className="font-medium text-foreground">{p.value}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            />
            {segments.map((seg, i) => (
              <Line key={seg} type="monotone" dataKey={seg} stroke={colorForIndex(i)} strokeWidth={2.25} dot={{ r: 2.5 }} activeDot={{ r: 4 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
        {segments.map((seg, i) => (
          <span key={seg} className="flex items-center gap-1.5 text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: colorForIndex(i) }} />
            {seg}
          </span>
        ))}
      </div>
      <p className="mt-1.5 text-[10.5px] text-muted-2">Source: orders · visits / active household / month</p>
    </div>
  );
}
