"use client";

import { CartesianGrid, ReferenceLine, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";
import { FrequencyBasketQuadrantPoint } from "@/types";
import { colorForIndex } from "@/lib/chartPalette";
import { formatCompact } from "@/lib/utils";

const QUADRANT_LABELS = {
  hh: "Protect",
  hl: "Increase cadence",
  lh: "Grow basket",
  ll: "Low priority",
};

export function FrequencyBasketMatrix({ points }: { points: FrequencyBasketQuadrantPoint[] }) {
  const medFreq = 1.8;
  const medBasket = 45;

  return (
    <div>
      <div className="relative h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 16, right: 24, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <ReferenceLine x={medFreq} stroke="var(--border-strong)" strokeDasharray="4 4" />
            <ReferenceLine y={medBasket} stroke="var(--border-strong)" strokeDasharray="4 4" />
            <XAxis
              type="number"
              dataKey="frequency"
              name="Frequency"
              domain={[0, 4]}
              tick={{ fontSize: 11, fill: "var(--muted-2)" }}
              axisLine={{ stroke: "var(--border)" }}
              tickLine={false}
              label={{ value: "Visits / household / month", position: "insideBottom", offset: -4, fontSize: 11, fill: "var(--muted-2)" }}
            />
            <YAxis
              type="number"
              dataKey="basket"
              name="Basket"
              domain={[0, 80]}
              tick={{ fontSize: 11, fill: "var(--muted-2)" }}
              axisLine={false}
              tickLine={false}
              width={36}
              label={{ value: "Basket value ($)", angle: -90, position: "insideLeft", fontSize: 11, fill: "var(--muted-2)" }}
            />
            <ZAxis type="number" dataKey="customers" range={[200, 1400]} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as FrequencyBasketQuadrantPoint;
                return (
                  <div className="rounded-md border border-border bg-surface px-3 py-2 text-[11.5px] shadow-sm">
                    <div className="font-medium text-foreground">{d.segment}</div>
                    <div className="text-muted">Frequency: {d.frequency}/mo</div>
                    <div className="text-muted">Basket: ${d.basket}</div>
                    <div className="text-muted">{formatCompact(d.customers)} customers</div>
                  </div>
                );
              }}
            />
            {points.map((p, i) => (
              <Scatter key={p.segment} data={[p]} fill={colorForIndex(i)} fillOpacity={0.8} name={p.segment} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
        <span className="pointer-events-none absolute right-4 top-3 text-[10px] font-medium uppercase tracking-wide text-muted-2">
          {QUADRANT_LABELS.hh}
        </span>
        <span className="pointer-events-none absolute left-10 top-3 text-[10px] font-medium uppercase tracking-wide text-muted-2">
          {QUADRANT_LABELS.lh}
        </span>
        <span className="pointer-events-none absolute right-4 bottom-8 text-[10px] font-medium uppercase tracking-wide text-muted-2">
          {QUADRANT_LABELS.hl}
        </span>
        <span className="pointer-events-none absolute left-10 bottom-8 text-[10px] font-medium uppercase tracking-wide text-muted-2">
          {QUADRANT_LABELS.ll}
        </span>
      </div>
      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
        {points.map((p, i) => (
          <span key={p.segment} className="flex items-center gap-1.5 text-[11px] text-muted">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: colorForIndex(i) }} />
            {p.segment}
          </span>
        ))}
      </div>
      <p className="mt-1.5 text-[10.5px] text-muted-2">Source: orders + loyalty · bubble size = customers</p>
    </div>
  );
}
