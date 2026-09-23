"use client";

import { Line, LineChart, CartesianGrid, ReferenceArea, Tooltip, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { CohortSeries } from "@/types";
import { CHANNEL_COLORS } from "@/lib/chartPalette";

export function RetentionCurve({
  series,
  highlightChannel,
  highlightRange,
  source = "orders + acquisition",
}: {
  series: CohortSeries[];
  highlightChannel?: string;
  highlightRange?: [string, string];
  source?: string;
}) {
  const months = series[0]?.points.map((p) => p.month) ?? [];
  const data = months.map((month, i) => {
    const row: Record<string, string | number | null> = { month };
    for (const s of series) row[s.channel] = s.points[i]?.repeat30d ?? null;
    return row;
  });

  return (
    <div className="h-[260px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 16, left: 8, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          {highlightRange && (
            <ReferenceArea x1={highlightRange[0]} x2={highlightRange[1]} fill="var(--danger)" fillOpacity={0.05} />
          )}
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "var(--muted-2)" }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            tick={{ fontSize: 11, fill: "var(--muted-2)" }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className="rounded-md border border-border bg-surface px-3 py-2 text-[11.5px] shadow-sm">
                  <div className="mb-1 font-medium text-foreground">{label}</div>
                  {payload.map((p) => (
                    <div key={String(p.dataKey)} className="flex items-center gap-1.5 text-muted">
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.color }} />
                      {String(p.dataKey)}: <span className="font-medium text-foreground">{p.value}%</span>
                    </div>
                  ))}
                </div>
              );
            }}
          />
          {series.map((s) => {
            const dim = highlightChannel && s.channel !== highlightChannel;
            return (
              <Line
                key={s.channel}
                type="monotone"
                dataKey={s.channel}
                stroke={CHANNEL_COLORS[s.channel] ?? "var(--muted-2)"}
                strokeWidth={dim ? 1.5 : 2.25}
                strokeOpacity={dim ? 0.4 : 1}
                dot={{ r: 2.5 }}
                activeDot={{ r: 4 }}
              />
            );
          })}
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        {series.map((s) => (
          <span key={s.channel} className="flex items-center gap-1.5 text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: CHANNEL_COLORS[s.channel] }} />
            {s.channel}
          </span>
        ))}
      </div>
      <p className="mt-1.5 text-[10.5px] text-muted-2">Source: {source} · 30-day second-purchase rate by acquisition cohort</p>
    </div>
  );
}
